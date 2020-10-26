import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getExpertiseFields = createAsyncThunk(
  'expertise/getExpertiseFields',
  async () => {
    const url = Config.API_URL + '/v1/expertise_fields/';
    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {}
  },
);

export const expertiseSlice = createSlice({
  name: 'expertiseFields',
  initialState: {
    expertiseFields: [],
    loading: false,
  },
  extraReducers: {
    [getExpertiseFields.fulfilled]: (state, action) => {
      (state.expertiseFields = action.payload), (state.loading = false);
    },
    [getExpertiseFields.pending]: (state, action) => {
      state.loading = true;
    },
    [getExpertiseFields.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
