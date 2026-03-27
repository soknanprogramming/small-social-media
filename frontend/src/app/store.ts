import { configureStore } from '@reduxjs/toolkit';
// import jwtReducer from '../features/auth/jwtSlice';
import profileReducer from '../features/profile/profileSlice';
import loginReducer from '../features/auth/loginSlice';
import postReducer from '../features/posts/postSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    login: loginReducer,
    posts: postReducer,
  }
})


// important types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;