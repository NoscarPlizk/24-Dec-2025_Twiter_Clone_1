import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// const BASE_URL = "https://12de56fe-6066-4f67-9c97-3b39be24af16-00-31a0nkx32vpgv.pike.replit.dev/";
export const updatePost = createAsyncThunk(
  'posts/updatePost', 
  async ({ userId, postId, newPostContent, newFile }) => { })
export const savePost = createAsyncThunk(
  'posts/savePost', 
  async ({ userId, postId, newPostContent, newFile }) => {
    try {
      let newImageUrl;
      if (newFile) {
        const imageRef = ref(storage, `posts/${newFile.name}`);
        const response = await uploadBytes(imageRef, newFile);
        newImageUrl = await getDownloadURL(response.ref);
      }

      const postsRef = doc(db, `users/${userId}/posts/${postId}`);

      const postSnap = await getDoc(postsRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        const updatedData = {
          ...postData,
          content: newPostContent || postData.content,
          imageUrl: newImageUrl || postData.imageUrl,
        };

        await updateDoc(postsRef, updatedData);
        const updatedPost = { id: postId, ...updatedData };
        return updatedPost;
      } else {
        throw new Error("Post does not exist");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const fetchPostsByUser = createAsyncThunk('posts/fetchPostsByUser',
  async (userId) => {
    try {
      const postsRef = collection(db, `users/${userId}/posts`);
      const querySnapshot = await getDocs(postsRef);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return docs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db , `users/${userId}/posts/${postId}`);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = [...postData.likes, userId];

        await setDoc(postRef, { ...postData, likes });
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const removeLikeFromPost = createAsyncThunk(
  "posts/removelikePost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db , `users/${userId}/posts/${postId}`);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = postData.likes.filter((id) => id !== userId);

        await setDoc(postRef, { ...postData, likes });
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: true },
  extraReducers: (builder) => {
    builder
    .addCase(fetchPostsByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    })

    .addCase(updatePost.fulfilled, (state, action) => {
      const updatedPost = action.payload;
      const postIndex = state.posts.findIndex(
        (post) => post.id === updatedPost.id
      );
      if (postIndex !== -1) {
        state.posts[postIndex] = updatedPost;
      }
    })

    .addCase(savePost.fulfilled, (state, action) => {
      state.posts = [action.payload, ...state.posts];
    })

    .addCase(likePost.fulfilled, (state, action) => {
      const { userId, postId } = action.payload;

      const postIndex = state.posts.findIndex((post) => post.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex].likes.push(userId);
      }
    })
    
    .addCase(removeLikeFromPost.fulfilled, (state, action) => {
      const { userId, postId } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex].likes = state.posts[postIndex].likes.filter((id) => id !== userId);
      }
    });
  },
});

export default postsSlice.reducer