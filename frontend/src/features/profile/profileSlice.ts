import { createSlice } from "@reduxjs/toolkit";
import type { ProfileResponse } from "./types/profile";

const initialState: ProfileResponse = {
    id: "",
    email: "",
    name: null,
    createdAt: null,
    updatedAt: null
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            return action.payload;
        }
    }
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;