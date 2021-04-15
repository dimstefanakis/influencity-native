import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getMyCoaches = createAsyncThunk(
  'myCoaches/getMyCoaches',
  async () => {
    try {
      let response = await axios.get(`${Config.API_URL}/v1/my_coaches/`);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const myCoachesSlice = createSlice({
  name: 'myCoaches',
  initialState: {
    myCoaches: [],
    loading: false,
  },
  extraReducers: {
    [getMyCoaches.fulfilled]: (state, action) => {
      state.myCoaches = action.payload;
      state.loading = false;
    },
    [getMyCoaches.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyCoaches.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
