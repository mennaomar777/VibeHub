import { JwtPayload } from "./../../node_modules/jwt-decode/build/cjs/index.d";
import { Comment } from "@/app/interfaces/postData";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllComments = createAsyncThunk(
  "comments/allcomments",
  async (id: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.get(
        `https://linked-posts.routemisr.com/posts/${id}/comments`,
        {
          headers: {
            token,
          },
        }
      );
      return res.data.comments;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createcomment",
  async (data: { content: string; post: string }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        data,
        {
          headers: {
            token,
          },
        }
      );
      return res.data.comments;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deletecomment",
  async (id: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const res = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${id}`,
        {
          headers: {
            token,
          },
        }
      );

      return id;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updatecomment",
  async ({ id, content }: { id: string; content: string }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const res = await axios.put(
        `https://linked-posts.routemisr.com/comments/${id}`,
        { content },
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
  allComments: Comment[] | null;
  currentPostId: string | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
} = {
  allComments: null,
  currentPostId: null,
  isLoading: false,
  isError: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setCurrentCommentsPostId: (state, action: PayloadAction<string>) => {
      if (state.currentPostId !== action.payload) {
        state.allComments = null;
        state.currentPostId = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllComments.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.allComments = action.payload;
    });
    builder.addCase(getAllComments.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(getAllComments.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createComment.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.allComments = action.payload;
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(createComment.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteComment.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;

      if (state.allComments) {
        state.allComments = state.allComments?.filter(
          (comment) => comment._id !== action.payload
        );
      }
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(deleteComment.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateComment.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      if (state.allComments) {
        state.allComments = state.allComments?.map((comment) =>
          comment._id == action.payload.comment._id
            ? action.payload.comment
            : comment
        );
      }
      console.log(action.payload);
    });
    builder.addCase(updateComment.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(updateComment.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const commentsReducer = commentsSlice.reducer;
export const { setCurrentCommentsPostId } = commentsSlice.actions;
