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

export const getMyAwards = createAsyncThunk('awards/getMyAwards', async () => {
  try {
    const url = `${Config.API_URL}/v1/my_awards/`;
    let response = await axios.get(url);
    if (response.status == 403 || !response.data) {
      return [];
    } else {
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
});

export const awardsSlice = createSlice({
  name: 'awards',
  initialState: {
    awards: [],
    myAwards: [],
    loading: false,
    loadingMyAwards: false,
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
    [getMyAwards.fulfilled]: (state, action) => {
      if (action.payload) {
        state.myAwards = action.payload;
      }
      state.loadingMyAwards = false;
    },
    [getMyAwards.pending]: (state, action) => {
      state.loadingMyAwards = true;
    },
    [getMyAwards.rejected]: (state, action) => {
      state.loadingMyAwards = false;
    },
  },
});
