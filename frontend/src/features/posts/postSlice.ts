// features/posts/postSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../libs/axios";
import type { PostResponse } from "./types/post"

interface PostState {
  posts: PostResponse[];
  ownPosts: PostResponse[];
  loading: boolean;
  error: string | null;
  ownPostsLoading: boolean;
  ownPostsError: string | null;
  ownPostsHasMore: boolean;
}

const initialState: PostState = {
  posts: [],
  ownPosts: [],
  loading: false,
  error: null,
  ownPostsLoading: false,
  ownPostsError: null,
  ownPostsHasMore: true,
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

// Async thunk to fetch user's own posts with pagination
export const fetchOwnPosts = createAsyncThunk(
  "posts/fetchOwnPosts",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await api.get<PostResponse[]>("/api/posts/own", { params: { page, limit } });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch own posts");
    }
  }
);

// Async thunk to like a post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      return postId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to like post");
    }
  }
);

// Async thunk to unlike a post
export const unlikePost = createAsyncThunk(
  "posts/unlikePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/posts/${postId}/like`);
      return postId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to unlike post");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetOwnPosts(state) {
      state.ownPosts = [];
      state.ownPostsHasMore = true;
      state.ownPostsError = null;
    }
  },
  // extraReducers to handle the async thunk states
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
      })
      .addCase(fetchOwnPosts.pending, (state) => {
        state.ownPostsLoading = true;
        state.ownPostsError = null;
      })
      .addCase(fetchOwnPosts.fulfilled, (state, action) => {
        state.ownPostsLoading = false;
        const newPosts = action.payload;
        
        // Append new posts to existing list, filtering out duplicates (infinite scroll)
        const existingIds = new Set(state.ownPosts.map(post => post.id));
        const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
        state.ownPosts = [...state.ownPosts, ...uniqueNewPosts];
        
        // If returned posts < limit, we've reached the end
        const POSTS_PER_PAGE = 10;
        state.ownPostsHasMore = newPosts.length === POSTS_PER_PAGE;
      })
      .addCase(fetchOwnPosts.rejected, (state, action) => {
        state.ownPostsLoading = false;
        state.ownPostsError = action.payload as string;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const postId = action.payload;
        // Update post in posts array
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.isLiked = true;
          post._count.likes += 1;
        }
        // Update post in ownPosts array
        const ownPost = state.ownPosts.find(p => p.id === postId);
        if (ownPost) {
          ownPost.isLiked = true;
          ownPost._count.likes += 1;
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const postId = action.payload;
        // Update post in posts array
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.isLiked = false;
          post._count.likes -= 1;
        }
        // Update post in ownPosts array
        const ownPost = state.ownPosts.find(p => p.id === postId);
        if (ownPost) {
          ownPost.isLiked = false;
          ownPost._count.likes -= 1;
        }
      });
  },
});

export const { resetOwnPosts } = postSlice.actions;

export default postSlice.reducer;