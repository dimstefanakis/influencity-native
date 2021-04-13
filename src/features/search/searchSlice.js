import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getResults = createAsyncThunk(
  'search/getResults',
  async (data) => {
    try {
      let url = `${Config.API_URL}/v1/coaches?name=${data.searchQuery}`;

      if (data.expertise) {
        url = `${Config.API_URL}/v1/coaches?expertise=${data.expertise}&name=${data.searchQuery}`;
      }

      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    loading: false,
  },
  extraReducers: {
    [getResults.fulfilled]: (state, action) => {
      state.results = action.payload;
      state.loading = false;
    },
    [getResults.pending]: (state, action) => {
      state.loading = true;
    },
    [getResults.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
