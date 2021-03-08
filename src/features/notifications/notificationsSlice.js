import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getMyNotifications = createAsyncThunk(
  'notifications/getMyNotifications',
  async () => {
    const url = Config.API_URL + '/v1/notifications/';
    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (id, thunkApi) => {
    const url = `${Config.API_URL}/v1/notifications/${id}/`;

    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
  },
  extraReducers: {
    [getMyNotifications.fulfilled]: (state, action) => {
      state.notifications = action.payload;
    },
    [getMyNotifications.rejected]: (state, action) => {},
    [getMyNotifications.pending]: (state, action) => {},
    [addNotification.fulfilled]: (state, action) => {
      state.notifications.push(action.payload);
    },
    [addNotification.rejected]: (state, action) => {},
    [addNotification.pending]: (state, action) => {},
  },
});
