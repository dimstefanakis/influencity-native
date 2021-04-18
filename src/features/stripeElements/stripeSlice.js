import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getPaymentMethod = createAsyncThunk(
  'stripe/getPaymentMethod',
  async () => {
    try {
      let response = await axios.get(
        `${Config.API_URL}/v1/get_payment_method/`,
      );

      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const stripeSlice = createSlice({
  name: 'stripe',
  initialState: {
    settingUpConnectAccount: false,
    paymentMethod: null,
  },
  reducers: {
    setConnectAccountStatus(state, action) {
      state.settingUpConnectAccount = action.payload;
    },
  },
  extraReducers: {
    [getPaymentMethod.fulfilled]: (state, action) => {
      state.paymentMethod = action.payload.payment_method;
    },
    [getPaymentMethod.pending]: (state, action) => {},
    [getPaymentMethod.rejected]: (state, action) => {},
  },
});

export const {setConnectAccountStatus} = stripeSlice.actions;
