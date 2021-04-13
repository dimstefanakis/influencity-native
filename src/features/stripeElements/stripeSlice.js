import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const stripeSlice = createSlice({
  name: 'stripe',
  initialState: {
    settingUpConnectAccount: false,
  },
  reducers: {
    setConnectAccountStatus(state, action) {
      state.settingUpConnectAccount = action.payload;
    },
  },
});

export const {setConnectAccountStatus} = stripeSlice.actions;
