import { configureStore } from '@reduxjs/toolkit';
import jwtReducer from '../features/auth/jwtSlice';

export const store = configureStore({
  reducer: {
    jwt: jwtReducer
  }
})


// important types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;