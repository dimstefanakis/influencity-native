import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getMyTeams = createAsyncThunk(
  'teams/getMyTeams',
  async (arg, thunkApi) => {
    const url = Config.API_URL + '/v1/my_teams/';
    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: {
    myTeams: [],
    loading: false,
  },
  extraReducers: {
    [getMyTeams.fulfilled]: (state, action) => {
      state.myTeams = action.payload;
      state.loading = false;
    },
    [getMyTeams.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyTeams.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
