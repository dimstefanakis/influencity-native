import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    type: 'mentee',
  },
  reducers: {
    toggleType(state, action) {
      if (state.type == 'mentee') {
        state.type = 'mentor';
      } else {
        state.type = 'mentee';
      }
    },
  },
});

export const {toggleType} = dashboardSlice.actions;
