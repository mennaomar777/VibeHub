import { Comment } from "@/app/interfaces/postData";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllComments = createAsyncThunk(
  "comments/allcomments",
  async ({ postId, page = 1, limit = 10 }: { postId: string; page?: number; limit?: number }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, limit },
        },
      );
      const pagination = res.data.meta?.pagination;
      const comments = (res.data.data?.comments ?? []) as Comment[];

      return {
        postId,
        comments,
        currentPage: pagination?.currentPage ?? page,
        hasMore:
          pagination?.currentPage && pagination?.numberOfPages
            ? pagination.currentPage < pagination.numberOfPages
            : comments.length === limit,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.errors?.filter(Boolean).join(" ") ||
          error.response?.data?.message ||
          "Could not load comments",
      );
    }
  }
);

export const getCommentReplies = createAsyncThunk(
  "comments/getReplies",
  async ({
    postId,
    commentId,
    page = 1,
    limit = 10,
  }: {
    postId: string;
    commentId: string;
    page?: number;
    limit?: number;
  }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        },
      );
      const replies = (response.data.data?.replies ?? []) as Comment[];
      const pagination = response.data.meta?.pagination;
      const currentPage = pagination?.currentPage ?? page;
      const numberOfPages = pagination?.numberOfPages;

      return {
        commentId,
        replies,
        currentPage,
        hasMore:
          typeof numberOfPages === "number"
            ? currentPage < numberOfPages
            : replies.length === limit,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string; errors?: string[] }>(error)) {
        throw new Error(
          error.response?.data?.errors?.filter(Boolean).join(" ") ||
            error.response?.data?.message ||
            "Could not load replies",
        );
      }

      throw error;
    }
  },
);

type ToggleCommentLikeArgs = {
  postId: string;
  commentId: string;
  currentlyLiked: boolean;
  likesCount: number;
};

export const toggleCommentLike = createAsyncThunk(
  "comments/toggleLike",
  async ({ postId, commentId }: ToggleCommentLikeArgs) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = response.data.data;

      return {
        commentId,
        liked: Boolean(data.liked),
        likesCount: Number(data.likesCount ?? data.comment?.likesCount ?? 0),
        comment: data.comment as Comment,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string; errors?: string[] }>(error)) {
        throw new Error(
          error.response?.data?.errors?.filter(Boolean).join(" ") ||
            error.response?.data?.message ||
            "Could not update comment like",
        );
      }

      throw error;
    }
  },
  {
    condition: ({ commentId }, { getState }) =>
      !(getState() as { comments: { commentLikingIds: string[] } }).comments.commentLikingIds.includes(
        commentId,
      ),
  },
);

export const createCommentReply = createAsyncThunk(
  "comments/createReply",
  async ({
    postId,
    commentId,
    formData,
  }: {
    postId: string;
    commentId: string;
    formData: FormData;
  }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return {
        commentId,
        reply: (response.data.data?.reply ?? response.data.data) as Comment,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string; errors?: string[] }>(error)) {
        throw new Error(
          error.response?.data?.errors?.filter(Boolean).join(" ") ||
            error.response?.data?.message ||
            "Could not create reply",
        );
      }

      throw error;
    }
  },
);

export const createComment = createAsyncThunk(
  "comments/createcomment",
  async (data: { post: string; formData: FormData }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.post(
        `https://route-posts.routemisr.com/posts/${data.post}/comments`,
        data.formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return (res.data.data?.comment ?? res.data.data) as Comment;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.errors?.filter(Boolean).join(" ") ||
          error.response?.data?.message ||
          "Could not create comment",
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deletecomment",
  async ({ id, post }: { id: string; post: string }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const res = await axios.delete(
        `https://route-posts.routemisr.com/posts/${post}/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  async ({
    id,
    post,
    formData,
  }: {
    id: string;
    post: string;
    formData: FormData;
  }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const res = await axios.put(
        `https://route-posts.routemisr.com/posts/${post}/comments/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = (res.data.data?.comment ?? res.data.data) as Partial<Comment>;
      return { ...updated, _id: updated._id || id } as Comment;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.errors?.filter(Boolean).join(" ") ||
          error.response?.data?.message ||
          "Could not update comment",
      );
    }
  }
);

const initialState: {
  allComments: Comment[] | null;
  currentPostId: string | null;
  commentsPage: number;
  commentsHasMore: boolean;
  commentsFetchLoading: boolean;
  commentsFetchError: string | null;
  repliesByCommentId: Record<string, Comment[]>;
  repliesLoadingByCommentId: Record<string, boolean>;
  repliesErrorByCommentId: Record<string, string | null>;
  repliesPageByCommentId: Record<string, number>;
  repliesHasMoreByCommentId: Record<string, boolean>;
  repliesLoadedByCommentId: Record<string, boolean>;
  commentLikingIds: string[];
  commentLikeOverrides: Record<
    string,
    { isLiked: boolean; likesCount: number; requestId?: string }
  >;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
} = {
  allComments: null,
  currentPostId: null,
  commentsPage: 0,
  commentsHasMore: false,
  commentsFetchLoading: false,
  commentsFetchError: null,
  repliesByCommentId: {},
  repliesLoadingByCommentId: {},
  repliesErrorByCommentId: {},
  repliesPageByCommentId: {},
  repliesHasMoreByCommentId: {},
  repliesLoadedByCommentId: {},
  commentLikingIds: [],
  commentLikeOverrides: {},
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
        state.commentsPage = 0;
        state.commentsHasMore = false;
        state.commentsFetchLoading = false;
        state.commentsFetchError = null;
        state.isError = false;
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllComments.fulfilled, (state, action) => {
      if (state.currentPostId !== action.payload.postId) return;
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.commentsFetchLoading = false;
      state.commentsFetchError = null;
      const existing = action.payload.currentPage === 1 ? [] : state.allComments || [];
      const existingIds = new Set(existing.map((comment) => comment._id));
      state.allComments = [
        ...existing,
        ...action.payload.comments.filter((comment) => !existingIds.has(comment._id)),
      ];
      state.commentsPage = action.payload.currentPage;
      state.commentsHasMore = action.payload.hasMore;
    });
    builder.addCase(getAllComments.rejected, (state, action) => {
      if (state.currentPostId !== action.meta.arg.postId) return;
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Could not load comments";
      state.commentsFetchLoading = false;
      state.commentsFetchError = action.error.message || "Could not load comments";
    });
    builder.addCase(getAllComments.pending, (state, action) => {
      if (state.currentPostId !== action.meta.arg.postId) return;
      state.isLoading = true;
      state.isError = false;
      state.error = null;
      state.commentsFetchLoading = true;
      state.commentsFetchError = null;
    });

    builder.addCase(getCommentReplies.pending, (state, action) => {
      const { commentId } = action.meta.arg;
      state.repliesLoadingByCommentId[commentId] = true;
      state.repliesErrorByCommentId[commentId] = null;
    });
    builder.addCase(getCommentReplies.fulfilled, (state, action) => {
      const { commentId, replies, currentPage, hasMore } = action.payload;
      const existing = currentPage === 1 ? [] : state.repliesByCommentId[commentId] || [];
      const existingIds = new Set(existing.map((reply) => reply._id));
      state.repliesByCommentId[commentId] = [
        ...existing,
        ...replies.filter((reply) => !existingIds.has(reply._id)),
      ];
      state.repliesPageByCommentId[commentId] = currentPage;
      state.repliesHasMoreByCommentId[commentId] = hasMore;
      state.repliesLoadedByCommentId[commentId] = true;
      state.repliesLoadingByCommentId[commentId] = false;
      state.repliesErrorByCommentId[commentId] = null;
    });
    builder.addCase(getCommentReplies.rejected, (state, action) => {
      const { commentId } = action.meta.arg;
      state.repliesLoadingByCommentId[commentId] = false;
      state.repliesErrorByCommentId[commentId] =
        action.error.message || "Could not load replies";
    });
    builder.addCase(toggleCommentLike.pending, (state, action) => {
      const { commentId, currentlyLiked, likesCount } = action.meta.arg;
      if (!state.commentLikingIds.includes(commentId)) {
        state.commentLikingIds.push(commentId);
      }
      const previous = state.commentLikeOverrides[commentId];
      state.commentLikeOverrides[commentId] = {
        isLiked: !currentlyLiked,
        likesCount: Math.max(0, likesCount + (currentlyLiked ? -1 : 1)),
        requestId: action.meta.requestId,
      };
      if (previous) {
        state.commentLikeOverrides[commentId].likesCount = Math.max(
          0,
          previous.likesCount + (currentlyLiked ? -1 : 1),
        );
      }
    });
    builder.addCase(toggleCommentLike.fulfilled, (state, action) => {
      const {
        commentId,
        comment: updatedComment,
        liked,
        likesCount,
      } = action.payload;
      state.commentLikingIds = state.commentLikingIds.filter((id) => id !== commentId);
      const currentOverride = state.commentLikeOverrides[commentId];
      if (currentOverride?.requestId !== action.meta.requestId) return;
      state.commentLikeOverrides[commentId] = {
        isLiked: liked,
        likesCount: Math.max(0, likesCount),
      };
      const updated = { ...updatedComment, likesCount, isLiked: liked };
      if (state.allComments) {
        state.allComments = state.allComments.map((comment) =>
          comment._id === commentId ? { ...comment, ...updated } : comment,
        );
      }
      for (const replies of Object.values(state.repliesByCommentId)) {
        const replyIndex = replies.findIndex((reply) => reply._id === commentId);
        if (replyIndex !== -1) {
          replies[replyIndex] = { ...replies[replyIndex], ...updated };
        }
      }
    });
    builder.addCase(toggleCommentLike.rejected, (state, action) => {
      state.commentLikingIds = state.commentLikingIds.filter(
        (id) => id !== action.meta.arg.commentId,
      );
      const { commentId, currentlyLiked, likesCount } = action.meta.arg;
      if (
        state.commentLikeOverrides[commentId]?.requestId !== action.meta.requestId
      ) {
        return;
      }
      state.commentLikeOverrides[commentId] = {
        isLiked: currentlyLiked,
        likesCount: Math.max(0, likesCount),
      };
    });
    builder.addCase(createCommentReply.fulfilled, (state, action) => {
      const { commentId, reply } = action.payload;
      const existingReplies = state.repliesByCommentId[commentId] || [];
      if (!existingReplies.some((item) => item._id === reply._id)) {
        state.repliesByCommentId[commentId] = [reply, ...existingReplies];
      }
      state.repliesLoadedByCommentId[commentId] = true;
      state.repliesErrorByCommentId[commentId] = null;

      const parentComment = state.allComments?.find((item) => item._id === commentId);
      if (parentComment) {
        parentComment.repliesCount = (parentComment.repliesCount ?? existingReplies.length) + 1;
      }
    });

    builder.addCase(createComment.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.allComments = state.allComments
        ? [action.payload, ...state.allComments]
        : [action.payload];
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
          comment._id === action.payload._id
            ? { ...comment, ...action.payload }
            : comment
        );
      }
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
