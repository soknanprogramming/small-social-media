// features/posts/postSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../libs/axios";
import type { PostResponse } from "./types/post"

interface PostState {
  posts: PostResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

// Async thunk to fetch posts with pagination
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await api.get<PostResponse[]>("/api/posts", { params: { page, limit } });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch posts");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default postSlice.reducer;