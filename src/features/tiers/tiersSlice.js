import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getMyTiers = createAsyncThunk('tiers/getMyTiers', async () => {
  const url = Config.API_URL + '/v1/my_tiers/';
  try {
    let response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.error(e);
  }
});

export const tiersSlice = createSlice({
  name: 'tiers',
  initialState: {
    myTiers: [],
  },
  extraReducers: {
    [getMyTiers.fulfilled]: (state, action) => {
      state.myTiers = action.payload;
    },
    [getMyTiers.rejected]: (state, action) => {},
    [getMyTiers.pending]: (state, action) => {},
  },
});
