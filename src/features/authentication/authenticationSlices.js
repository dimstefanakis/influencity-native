import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import axios from 'axios';

async function getTokens(credentials) {
  const url = Config.API_URL + '/token/';
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        username: credentials.email,
        password: credentials.password,
      }),
    });
    let data = await response.json();
    let payload = {
      access: data?.access,
      refresh: data?.refresh,
      status: response.status,
    };
    return payload;
  } catch (e) {}
}

export const login = createAsyncThunk(
  'authentication/login',
  async (credentials) => {
    let data = await getTokens(credentials);
    try {
      await AsyncStorage.setItem('@token', data.access);
      await AsyncStorage.setItem('@refresh', data.refresh);
    } catch (e) {}
    return data;
  },
);

export const changePassword = createAsyncThunk(
  'authentication/changePassword',
  async (data) => {
    const url = Config.DOMAIN + '/rest-auth/password/change/';
    try {
      let formData = new FormData();
      formData.append('old_password', data.oldPassword);
      formData.append('new_password1', data.newPassword1);
      formData.append('new_password2', data.newPassword2);
      let response = await axios.post(url, formData);
      return response;
    } catch (e) {}
  },
);

export const forgotPassword = createAsyncThunk(
  'authentication/forgotPassword',
  async (email) => {
    const url = Config.DOMAIN + '/rest-auth/password/reset/';

    try {
      let formData = new FormData();
      formData.append('email', email);
      let response = await axios.post(url, formData);
    } catch (e) {}
  },
);

export const register = createAsyncThunk(
  'authentication/register',
  async (credentials) => {
    const url = Config.DOMAIN + '/rest-auth/registration/';
    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          username: credentials.email,
          password1: credentials.password1,
          password2: credentials.password2,
        }),
      });
      let data = await response.json();
      let tokens = {};
      if (response.status == 200 || response.status == 201) {
        tokens = await getTokens({
          email: credentials.email,
          password: credentials.password1,
        });
        try {
          await AsyncStorage.setItem('@token', tokens.access);
          await AsyncStorage.setItem('@refresh', tokens.refresh);
          try {
            axios.defaults.withCredentials = true;
            axios.interceptors.request.use(function (config) {
              const token = tokens.access;
              if (token) {
                config.headers.Authorization = 'Bearer ' + token;
              }
              return config;
            });
          } catch (e) {}
        } catch (e) {}
      }

      let payload = {
        access: tokens?.access,
        refresh: tokens?.refresh,
        data: data,
      };
      return payload;
    } catch (e) {}
  },
);

export const getUserData = createAsyncThunk(
  'authentication/getUserData',
  async () => {
    let userData = {};
    let userToken;

    try {
      userToken = await AsyncStorage.getItem('@token');
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

export const updateUserData = createAsyncThunk(
  'authentication/updateUserData',
  async (data) => {
    let userData = {};

    try {
      let results = await axios.get(Config.API_URL + '/v1/user/me/');
      userData.user = results.data[0];
    } catch (e) {
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
    changePasswordLoading: false,
    updatingUserData: false,
    checkingForToken: true,
  },
  reducers: {
    async logout(state, action) {
      state.token = null;
      state.refresh = null;
      await AsyncStorage.removeItem('@token');
      await AsyncStorage.removeItem('@refresh');
    },
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
    [register.fulfilled]: (state, action) => {
      state.token = action.payload.access;
      state.loading = false;

      if (action.payload.access) {
        state.token = action.payload.access;
        state.refresh = action.payload.refresh;
      }
    },
    [register.pending]: (state, action) => {
      state.loading = true;
    },
    [register.rejected]: (state, action) => {
      state.loading = true;
    },
    [getUserData.fulfilled]: (state, action) => {
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
    [updateUserData.fulfilled]: (state, action) => {
      state.updatingUserData = false;
      state.user = action.payload.user;
    },
    [updateUserData.pending]: (state, action) => {
      state.updatingUserData = true;
    },
    [updateUserData.rejected]: (state, action) => {
      state.updatingUserData = false;
      state.user = null;
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [forgotPassword.pending]: (state, action) => {
      state.loading = true;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.loading = false;
    },
    [changePassword.fulfilled]: (state, action) => {
      state.changePasswordLoading = false;
    },
    [changePassword.pending]: (state, action) => {
      state.changePasswordLoading = true;
    },
    [changePassword.rejected]: (state, action) => {
      state.changePasswordLoading = false;
    },
  },
});

export const {logout} = authenticationSlice.actions;
