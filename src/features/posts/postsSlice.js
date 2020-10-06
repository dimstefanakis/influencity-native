import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';
//import store from '../../store';

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async (arg, thunkApi) => {
    const {user} = thunkApi.getState().authentication;
    const url = Config.API_URL + '/v1/posts/';
    try {
      console.log(url);
      let response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
  },
  extraReducers: {
    [getPosts.fulfilled]: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },
    [getPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [getPosts.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
