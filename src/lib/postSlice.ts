import { PostData } from "@/app/interfaces/postData";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllPosts = createAsyncThunk("post/allPost", async () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=50&page=77`,
      {
        headers: {
          token,
        },
      }
    );
    return res.data.posts;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
});

export const getSinglePost = createAsyncThunk(
  "post/singlePost",
  async (id: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.get(
        `https://linked-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            token,
          },
        }
      );
      return res.data.post;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            token,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ id, formData }: { id: string; formData: FormData }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.put(
        `https://linked-posts.routemisr.com/posts/${id}`,
        formData,
        {
          headers: {
            token,
          },
        }
      );

      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);
const initialState: {
  allPost: PostData[] | null;
  isLoading: boolean;
  singlePost: PostData | null;
  isError: boolean;
  error: string | null;
} = {
  allPost: null,
  isLoading: false,
  singlePost: null,
  isError: false,
  error: null,
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setCurrentPost(state, action: PayloadAction<PostData | null>) {
      state.singlePost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPosts.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.allPost = action.payload.reverse();
    });
    builder.addCase(getAllPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(getAllPosts.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getSinglePost.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.singlePost = action.payload;
    });

    builder.addCase(getSinglePost.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });

    builder.addCase(getSinglePost.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deletePost.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (state.allPost) {
        state.allPost = state.allPost.filter(
          (post) => post._id !== action.payload.post._id
        );
      }
    });

    builder.addCase(deletePost.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });

    builder.addCase(deletePost.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updatePost.fulfilled, (state, action: any) => {
      state.isLoading = false;

      if (state.allPost) {
        state.allPost = state.allPost.map((post) =>
          post._id === action.payload.post._id ? action.payload.post : post
        );
      }

      if (state.singlePost?._id === action.payload.post._id) {
        state.singlePost = action.payload.post;
      }
    });

    builder.addCase(updatePost.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });

    builder.addCase(updatePost.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const postReducer = postSlice.reducer;
export const { setCurrentPost } = postSlice.actions;
