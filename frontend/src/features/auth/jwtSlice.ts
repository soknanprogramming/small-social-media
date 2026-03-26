import { createSlice } from '@reduxjs/toolkit';

interface jwtState {
  token: string | null;
}

const initialState: jwtState = {
  token: localStorage.getItem('authToken') ?? null
};

const jwtSlice = createSlice({
  name: 'jwt',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('authToken', action.payload);
      } else {
        localStorage.removeItem('authToken');
      }
    },

    deleteToken: (state) => {
      state.token = null;
      localStorage.removeItem('authToken');
    }
  }
});

export const { setToken, deleteToken } = jwtSlice.actions;
export default jwtSlice.reducer;
