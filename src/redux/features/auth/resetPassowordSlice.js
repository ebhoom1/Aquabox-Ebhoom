import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'


const url  = 'http://localhost:5555'

export const validateUser = createAsyncThunk(
    'resetPassword/validateUser',
    async({id,token},{rejectWithValue})=>{
        try{
            const response = await axios.get(`${url}/api/forgotpassword/${id}/${token}`,{
                headers:{
                    "Content-Type":"application/json",
                    "Accept":'application/json'                }
            });
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
);

export const resetPassword =createAsyncThunk(
    'resetPassword/resetPassword',
    async({id,token,password,cpassword},{rejectWithValue})=>{
        try {
            const response = await axios.post(`${url}/api/${id}/${token}`,{
                password,
                cpassword
            },{
                headers:{
                    "Content-Type":"application/json"
                }
            });
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

const resetPasswordSlice =createSlice({
    name:'resetPassword',
    initialState:{
        loading:false,
        error:null,
        success:false,
    },
    reducers:{
        clearState:(state)=>{
            state.loading = false;
            state.error=null;
            state.success = false;
        }
    },
    extraReducers:(builder) =>{
        builder
        .addCase(validateUser.pending,(state)=>{
            state.loading =true
        })
        .addCase(validateUser.fulfilled,(state)=>{
            state.loading =false;
        })
        .addCase(validateUser.rejected,(state,action)=>{
            state.loading = false;
            state.error =action.payload;
        })
        .addCase(resetPassword.pending,(state)=>{
            state.pending = true;
            state.error = null;
            state.success = false;
        })
        .addCase(resetPassword.fulfilled,(state)=>{
            state.loading =false;
            state.success = true;

        })
        .addCase(resetPassword.rejected,(state,action)=>{
              state.loading = false;
              state.error = action.payload;
              state.success = false;
        })
    }
})

export const {clearState} =resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
