import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOCAL_API_URL ,API_URL} from '../../../utils/apiConfig';

const url = 'http://localhost:5555';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userdatatoken');
     
      const response =
      
      
      await axios.get(`${LOCAL_API_URL}/api/validuser`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'user/fetchNotifications',
  async (userName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LOCAL_API_URL}/api/get-notification-of-user/${userName}`);
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      let token = localStorage.getItem('userdatatoken');
      const response = await axios.get(`${LOCAL_API_URL}/api/logout`, {
        headers: {
          'Content-Type': "application/json",
          'Authorization': token,
          Accept: 'application/json'
        },
        withCredentials: true
      });
      if (response.data.status === 201) {
        localStorage.removeItem('userdatatoken');
        dispatch(logout());
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    notifications: [],
    loading: false,
    error: null,
    userType: '',
  },
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.userType = '';
      state.notifications = [];
    },
  
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.userType = action.payload.validUserOne.userType;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      
  }
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
