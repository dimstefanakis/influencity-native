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

export const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async () => {
    const url = `${Config.API_URL}/v1/unread_notifications_count/`;

    try {
      let response = await axios.get(url);
      return response.data.unread_count;
    } catch (e) {
      console.error(e);
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  'notifications/getUnreadCount',
  async () => {
    const url = `${Config.API_URL}/v1/mark_all_notifications_as_read/`;

    try {
      let response = await axios.post(url);
      return response.data.unread_count;
    } catch (e) {
      console.error(e);
    }
  },
);

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    hasLoadedInitial: false,
  },
  reducers: {
    incrementUnread(state, action) {
      state.unreadCount = state.unreadCount + 1;
    },
  },
  extraReducers: {
    [getMyNotifications.fulfilled]: (state, action) => {
      state.notifications = action.payload;
      if (!state.hasLoadedInitial) {
        state.hasLoadedInitial = true;
      }
    },
    [getMyNotifications.rejected]: (state, action) => {},
    [getMyNotifications.pending]: (state, action) => {},
    [addNotification.fulfilled]: (state, action) => {
      state.notifications.push(action.payload);
    },
    [addNotification.rejected]: (state, action) => {},
    [addNotification.pending]: (state, action) => {},
    [getUnreadCount.fulfilled]: (state, action) => {
      state.unreadCount = action.payload;
    },
    [getUnreadCount.rejected]: (state, action) => {},
    [getUnreadCount.pending]: (state, action) => {},
    [markAllAsRead.fulfilled]: (state, action) => {
      state.unreadCount = action.payload;
    },
    [markAllAsRead.rejected]: (state, action) => {},
    [markAllAsRead.pending]: (state, action) => {},
  },
});

export const {incrementUnread} = notificationsSlice.actions;
