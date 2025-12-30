import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const BASE_URL = "https://12de56fe-6066-4f67-9c97-3b39be24af16-00-31a0nkx32vpgv.pike.replit.dev/";

export const savePost = createAsyncThunk('posts/savePost', 
  async (postContent) => {
    const token = localStorage.getItem('authToken');
    const decode = jwtDecode(token);
    const userId = decode.userId;

    const data = {
      title: '',
      content: postContent,
      user_id:  userId
    };

    const response = await axios.post(`${BASE_URL}/posts`, data);
    return response.data;
  }
);

export const fetchPostsByUser = createAsyncThunk('posts/fetchPostsByUser',
  async (userId) => {
    console.log(userId);
    const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
    return response.data;
  }
)

const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: true },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    });

    builder.addCase(savePost.fulfilled, (state, action) => {
      state.posts = [action.payload, ...state.posts];
    })
  },
});

export default postsSlice.reducer