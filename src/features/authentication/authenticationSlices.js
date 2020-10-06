import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';
import axios from 'axios';

export const login = createAsyncThunk(
  'authentication/login',
  async (credentials) => {
    const url = Config.API_URL + '/token/';
    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password,
        }),
      });
      let data = await response.json();
      try {
        await AsyncStorage.setItem('token', data.access);
        await AsyncStorage.setItem('refresh', data.refresh);
      } catch (e) {}
      return data;
    } catch (e) {}
  },
);

export const getUserData = createAsyncThunk(
  'authentication/getUserData',
  async () => {
    let userData = {};
    let userToken;

    try {
      userToken = await AsyncStorage.getItem('token');
      userData.token = userToken;
      axios.defaults.withCredentials = true;
      axios.interceptors.request.use(function (config) {
        const token = userToken;

        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
      });
      if (userToken) {
        userData.token = userToken;
        let results = await axios.get(Config.API_URL + '/v1/user/me/');
        userData.user = results.data[0];
      }
    } catch (e) {
      userData.token = null;
      userData.user = null;
    }
    return userData;
  },
);

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    token: null,
    refresh: null,
    user: null,
    loading: false,
    checkingForToken: true,
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.token = action.payload.access;
      state.loading = false;

      if (action.payload.access) {
        state.token = action.payload.access;
        state.refresh = action.payload.refresh;
      }
    },
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.rejected]: (state, action) => {
      state.loading = true;
    },
    [getUserData.fulfilled]: (state, action) => {
      console.log(action);
      state.checkingForToken = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    [getUserData.pending]: (state, action) => {
      state.checkingForToken = true;
    },
    [getUserData.rejected]: (state, action) => {
      state.checkingForToken = false;
      state.token = null;
      state.user = null;
    },
  },
});
