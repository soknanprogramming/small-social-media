import { createSlice } from "@reduxjs/toolkit";

interface LoginState {
    isLoggedIn: boolean;
}

const initialState: LoginState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true"
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoggedIn: (state, action: { payload: boolean }) => {
            state.isLoggedIn = action.payload;
            localStorage.setItem("isLoggedIn", String(action.payload));
        }
    }
});

export const { setLoggedIn } = loginSlice.actions;
export default loginSlice.reducer;