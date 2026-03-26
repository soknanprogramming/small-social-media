import { configureStore } from '@reduxjs/toolkit';
import jwtReducer from '../features/auth/jwtSlice';
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    jwt: jwtReducer,
    profile: profileReducer
  }
})


// important types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;