import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';
import { LOCAL_API_URL,API_URL } from "../../../utils/apiConfig";


const url = 'http://localhost:5555';



export const fetchLatestIotData = createAsyncThunk(
    'iotData/fetchLatestIotData',
    async(userName,{rejectWithValue})=>{
        try {
            const response = await axios.get(`${API_URL}/api/latest-iot-data/${userName}`);
            return response.data.data[0] || {};
            
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
// New fetchIotDataByUserName thunk
export const fetchIotDataByUserName = createAsyncThunk(
    'iotData/fetchIotDataByUserName',
    async(userName, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${url}/api/get-IoT-Data-by-userName/${userName}`);
            const data = response.data.data;

            if (!data || data.length === 0) {
                return rejectWithValue({ message: `No data found for ${userName}` });
            }
            // Assuming the data has a `timestamp` field or similar for determining the most recent entry
            const latestEntry = data.reduce((latest, current) => {
                return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
            }, data[0]);

            return latestEntry  || { message: `No data found for ${userName}` };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAverageIotData = createAsyncThunk(
    'iotData/fetchAverageIotData',
    async (userName, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/get-average-data/${userName}`);
            console.log("userName to fetch IoT Average:",userName)
            console.log('API Response AVERAGE IOT DATA:', response.data.userIoTdata); 
            return response.data.userIoTdata;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
const iotDataSlice = createSlice({
    name: 'iotData',
    initialState: {
        latestData: {},
        averageData: [],
        userIotData: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLatestIotData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLatestIotData.fulfilled, (state, action) => {
                state.loading = false;
                state.latestData = action.payload;
            })
            .addCase(fetchLatestIotData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handling fetchIotDataByUserName actions
            .addCase(fetchIotDataByUserName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIotDataByUserName.fulfilled, (state, action) => {
                state.loading = false;
                state.userIotData = action.payload;
            })
            .addCase(fetchIotDataByUserName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAverageIotData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAverageIotData.fulfilled, (state, action) => {
                state.loading = false;
                state.averageData = action.payload;
                console.log('State averageData:', state.averageData);
            })
            .addCase(fetchAverageIotData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default iotDataSlice.reducer;