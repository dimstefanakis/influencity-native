import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getProjects = createAsyncThunk(
  'projects/getProjects',
  async (arg, thunkApi) => {
    const url = Config.API_URL + '/v1/projects/';
    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
  },
  extraReducers: {
    [getProjects.fulfilled]: (state, action) => {
      state.projects = action.payload;
      state.loading = false;
    },
    [getProjects.pending]: (state, action) => {
      state.loading = true;
    },
    [getProjects.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
