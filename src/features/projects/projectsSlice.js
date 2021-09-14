import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';

export const getProjects = createAsyncThunk(
  'projects/getProjects',
  async (arg, thunkApi) => {
    const url = Config.API_URL + '/v1/my_projects/';
    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const getMyProjects = createAsyncThunk(
  'projects/getMyProjects',
  async () => {
    const url = Config.API_URL + '/v1/my_projects/';
    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const getMyCreatedProjects = createAsyncThunk(
  'projects/getMyCreatedProjects',
  async () => {
    const url = Config.API_URL + '/v1/created_projects/';
    try {
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const getMyCoachesProjects = createAsyncThunk(
  'projects/getMyCoachesProjects',
  async () => {
    const url = Config.API_URL + '/v1/my_coaches_projects/';
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
    myProjects: [],
    createdProjects: [],
    myCoachesProjects: [],
    selectedProjectTeams: [],
    loading: false,
  },
  reducers: {
    setSelectedProjectTeams(state, action) {
      state.selectedProjectTeams = action.payload;
    },
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
    [getMyProjects.fulfilled]: (state, action) => {
      state.myProjects = action.payload;
    },
    [getMyProjects.pending]: (state, action) => {},
    [getMyProjects.rejected]: (state, action) => {},
    [getMyCreatedProjects.fulfilled]: (state, action) => {
      state.createdProjects = action.payload;
    },
    [getMyCreatedProjects.pending]: (state, action) => {},
    [getMyCreatedProjects.rejected]: (state, action) => {},
    [getMyCoachesProjects.fulfilled]: (state, action) => {
      state.myCoachesProjects = action.payload;
    },
    [getMyCoachesProjects.pending]: (state, action) => {},
    [getMyCoachesProjects.rejected]: (state, action) => {},
  },
});

export const {setSelectedProjectTeams} = projectsSlice.actions;
