import {createSlice,createAsyncThunk}from '@reduxjs/toolkit'
import  axios  from 'axios'
import { LOCAL_API_URL,API_URL } from '../../../utils/apiConfig';

const url = 'http://localhost:5555';


export const fetchUsers =createAsyncThunk(
    'userLog/fetchUsers',
    async(_, { rejectWithValue })=>{
        try {
            const response =await axios.get(`${API_URL}/api/getallusers`)
            return response.data.users;
            
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async(userId,{rejectWithValue})=>{
        try{
            const response = await axios.get(`${API_URL}/api/getauser/${userId}`)
            return response.data.user
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
);


export const addUser =createAsyncThunk(
    'users/adduser',
    async (formData, { rejectWithValue })=>{
      try{
        const response = await axios.post(`${API_URL}/api/register`,formData,{
          headers:{
            'Content-Type':'multipart/form-data',
          },
        });
        return response.data.storeData;
      }catch(error){
        return rejectWithValue(error.response.data);
      }
     
    }
  );

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async({userId,userData},{rejectWithValue})=>{
        try {
            const response = await axios.patch(`${API_URL}/api/edituser/${userId}`,userData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)  

  export const deleteUser =createAsyncThunk(
    `user/deleteUser`,
    async(userName,{ rejectWithValue })=>{
    try {
      const response = await axios.delete(`${API_URL}/api/deleteuser/${userName}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  
const userLogSlice = createSlice({
    name:'userLog',
    initialState:{
        users:[],
        filteredUsers:[],
        loading:false,
        error:null,
    },
    reducers:{
        setFilteredUsers:(state,action)=>{
            state.filteredUsers =action.payload;
        },
        clearState: (state) => {
            state.loading = false;
            state.error = null;
          },
    },
    extraReducers:(builder) =>{
        builder

        .addCase(fetchUsers.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled,(state,action)=>{
            state.loading = false;
            state.users = action.payload;
            state.filteredUsers = action.payload;
        })
        .addCase(fetchUsers.rejected,(state,action)=>{
            state.loading =false;
            state.error =action.payload;
        })
        .addCase(fetchUserById.pending,(state)=>{
            state.loading =false;
        })
        .addCase(fetchUserById.fulfilled,(state,action)=>{
            state.loading =false;
            state.selectedUser =action.payload;
        })
        .addCase(fetchUserById.rejected,(state,action)=>{
            state.loading =false;
            state.error =action.error.message;
        })
        .addCase(addUser.pending,(state)=>{
            state.loading =true;
            state.error = null;
          })
          .addCase(addUser.fulfilled,(state,action)=>{
            state.loading =false;
            state.users.push(action.payload)
          })
          .addCase(addUser.rejected,(state,action)=>{
            state.loading =false;
            state.error =action.error.message
          })
          .addCase(updateUser.pending,(state)=>{
            state.loading =true;
          })
          .addCase(updateUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.fulfilled =true;
            const index = state.users.findIndex(user =>user._id === action.payload._id);
            if(index !== -1){
                state.users[index] = action.payload
            }
          })
          .addCase(updateUser.rejected,(state,action)=>{
            state.loading =false;
            state.error = action.error.message;
          })
          .addCase(deleteUser.pending, (state) => {
            state.loading = true;
          })
          .addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = state.users.filter(user => user.userName !== action.payload);
          })
          .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
});

export const {setFilteredUsers,clearState} = userLogSlice.actions;

export default userLogSlice.reducer;