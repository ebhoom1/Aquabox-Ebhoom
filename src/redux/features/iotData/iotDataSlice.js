import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

const url = 'http://localhost:5555';

export const fetchLatestIotData = createAsyncThunk(
    'iotData/fetchLatestIotData',
    async(userName,{rejectWithValue})=>{
        try {
            const response = await axios.get(`${url}/api/latest-iot-data/${userName}`);
            return response.data.data[0] || {};
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const iotDataSlice =createSlice({
    name:'iotData',
    initialState:{
        latestData:{},
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder

        .addCase(fetchLatestIotData.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchLatestIotData.fulfilled,(state,action)=>{
            state.loading =false;
            state.latestData = action.payload;
        })
        .addCase(fetchLatestIotData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    }
})

export default iotDataSlice.reducer