import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getAwards = createAsyncThunk('awards/getAwards', async () => {
  try {
    let response = await axios.get(`${Config.API_URL}/v1/awards/`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
});

export const awardsSlice = createSlice({
  name: 'awards',
  initialState: {
    awards: [],
    loading: false,
  },
  extraReducers: {
    [getAwards.fulfilled]: (state, action) => {
      state.awards = action.payload;
      state.loading = false;
    },
    [getAwards.pending]: (state, action) => {
      state.loading = true;
    },
    [getAwards.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
