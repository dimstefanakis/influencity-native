import {configureStore} from '@reduxjs/toolkit';
import {authenticationSlice} from './features/authentication/authenticationSlices';
import {postsSlice} from './features/posts/postsSlice';
import {projectsSlice} from './features/projects/projectsSlice';

export default configureStore({
  reducer: {
    authentication: authenticationSlice.reducer,
    posts: postsSlice.reducer,
    projects: projectsSlice.reducer,
  },
});
