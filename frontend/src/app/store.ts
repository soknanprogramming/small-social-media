import { configureStore } from '@reduxjs/toolkit';
// import jwtReducer from '../features/auth/jwtSlice';
import profileReducer from '../features/profile/profileSlice';
import loginReducer from '../features/auth/loginSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    login: loginReducer
  }
})


// important types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;