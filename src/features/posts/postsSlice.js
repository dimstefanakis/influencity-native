import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import axios from 'axios';
//import store from '../../store';

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async (config, thunkApi) => {
    const {endpoint, type} = config;
    const {next, hasMore, posts} = thunkApi.getState().posts;
    let _next = next;
    let _posts = posts;
    let _hasMore = hasMore;
    try {
      let url = next ? next : endpoint;
      let response = await axios.get(url);
      _next = response.data.next;
      if (!response.data.next) {
        hasMore.current = false;
      }
      if (!response.data.previous) {
        _posts = response.data.results;
      } else {
        _posts = [...posts, ...response.data.results];
      }
      return {
        next: _next,
        posts: _posts,
        hasMore: _hasMore,
        type: type,
      };
    } catch (e) {}
  },
);

export const getNewPosts = createAsyncThunk(
  'posts/getNewPosts',
  async (arg, thunkApi) => {
    const url = Config.API_URL + '/v1/new_posts/';
    try {
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
    next: null,
    coachPostCount: 0,
    hasMore: true,
    newPosts: [],
    selectedForAttachment: [],
    loading: false,
    hasLoadedInitial: false,
    hasLoadedInitialCoachPosts: false,
    feedLoading: true,
  },
  reducers: {
    addAttachedPost(state, action) {
      const {id} = action.payload;
      state.selectedForAttachment = [...state.selectedForAttachment, id];
    },
    removeAttachedPost(state, action) {
      const {id} = action.payload;
      state.selectedForAttachment = state.selectedForAttachment.filter(
        (selected) => selected != id,
      );
    },
    setCoachPostCount(state, action) {
      state.coachPostCount = action.payload;
    },
    setHasLoadedInitialCoachPosts(state, action) {
      state.hasLoadedInitialCoachPosts = action.payload;
    },
    resetFeedPosts(state, action) {
      state.posts = [];
      state.next = null;
      state.hasMore = true;
      state.hasLoadedInitial = false;
      state.feedLoading = true;
    },
  },
  extraReducers: {
    [getPosts.fulfilled]: (state, action) => {
      const {posts, next, hasMore} = action.payload;
      state.posts = posts;
      state.next = next;
      state.hasMore = hasMore;
      state.loading = false;

      if (!state.hasLoadedInitial) {
        state.hasLoadedInitial = true;
      }
    },
    [getPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [getPosts.rejected]: (state, action) => {
      state.loading = false;

      if (!state.hasLoadedInitial) {
        state.hasLoadedInitial = true;
      }
    },
    [getNewPosts.fulfilled]: (state, action) => {
      state.newPosts = action.payload;
      state.feedLoading = false;
    },
    [getNewPosts.pending]: (state, action) => {
      state.feedLoading = true;
    },
    [getNewPosts.rejected]: (state, action) => {
      state.feedLoading = false;
    },
  },
});

export const {
  addAttachedPost,
  removeAttachedPost,
  setCoachPostCount,
  setHasLoadedInitialCoachPosts,
  resetFeedPosts,
} = postsSlice.actions;
