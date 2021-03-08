import {configureStore} from '@reduxjs/toolkit';
import {authenticationSlice} from './features/authentication/authenticationSlices';
import {postsSlice} from './features/posts/postsSlice';
import {projectsSlice} from './features/projects/projectsSlice';
import {expertiseSlice} from './features/expertise/expertiseSlice';
import {tiersSlice} from './features/tiers/tiersSlice';
import {teamsSlice} from './features/teams/teamsSlice';
import {myCoachesSlice} from './features/myCoaches/myCoachesSlice';
import {chatSlice} from './features/chat/chatSlice';
import {notificationsSlice} from './features/notifications/notificationsSlice';

export default configureStore({
  reducer: {
    authentication: authenticationSlice.reducer,
    posts: postsSlice.reducer,
    projects: projectsSlice.reducer,
    expertiseFields: expertiseSlice.reducer,
    tiers: tiersSlice.reducer,
    teams: teamsSlice.reducer,
    myCoaches: myCoachesSlice.reducer,
    chat: chatSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});
