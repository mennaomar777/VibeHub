import { PostData, PostLike } from "@/app/interfaces/postData";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllPosts = createAsyncThunk("post/allPost", async () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const posts = res.data.data.posts;

    return posts;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
});

export const getHomeFeed = createAsyncThunk(
  "post/homeFeed",
  async (
    params: {
      only?: "following" | "all";
      limit?: number;
      page?: number;
      cursor?: string;
      hasImage?: boolean;
    } = {},
  ) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.get(
        `https://route-posts.routemisr.com/posts/feed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        },
      );
      const posts = res.data.data.posts;

      return posts;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  },
);

export const getUserBookmarks = createAsyncThunk(
  "post/userBookmarks",
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.get(
        "https://route-posts.routemisr.com/users/bookmarks",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        },
      );

      const bookmarks = response.data.data.bookmarks || [];
      const posts = bookmarks.map((bookmark: any) => ({
        ...(bookmark.post ?? bookmark),
        bookmarked: true,
      }));
      const pagination = response.data.meta?.pagination;

      return {
        posts: posts as PostData[],
        hasMore: pagination
          ? pagination.currentPage < pagination.numberOfPages
          : false,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        throw new Error(
          error.response?.data?.message || "Could not load saved posts",
        );
      }

      throw error;
    }
  },
);

export const getPostLikes = createAsyncThunk(
  "post/getLikes",
  async ({
    postId,
    page = 1,
    limit = 20,
  }: {
    postId: string;
    page?: number;
    limit?: number;
  }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/likes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, limit },
        },
      );

      const users: PostLike[] = response.data.data.likes.map(
        (like: PostLike) => ({
          _id: like._id,
          name: like.name,
          username: like.username,
          photo: like.photo,
        }),
      );

      const meta = response.data.meta.pagination;

      const hasMore = meta.currentPage < meta.numberOfPages;

      return { postId, page, users, hasMore };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        throw new Error(
          error.response?.data?.message || "Could not load likes",
        );
      }

      throw error;
    }
  },
);

export const getSinglePost = createAsyncThunk(
  "post/singlePost",
  async (id: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.get(
        `https://route-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const post = res.data.data.post as PostData;
      return {
        ...post,
        comments: post.topComment ? [post.topComment] : [],
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.delete(
        `https://route-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  },
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ id, formData }: { id: string; formData: FormData }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.put(
        `https://route-posts.routemisr.com/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  },
);

export const sharePost = createAsyncThunk(
  "post/sharePost",
  async ({ postId, body }: { postId: string; body: string }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/share`,
        { body },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data.data.post as PostData;
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string; errors?: string[] }>(error)) {
        const details = error.response?.data?.errors?.filter(Boolean).join(" ");
        throw new Error(
          details || error.response?.data?.message || "Could not share post",
        );
      }

      throw error;
    }
  },
);

export const togglePostLike = createAsyncThunk(
  "post/toggleLike",
  async (postId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return { postId, data: response.data.data };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        throw new Error(
          error.response?.data?.message || "Could not update like",
        );
      }

      throw error;
    }
  },
);

export const togglePostBookmark = createAsyncThunk(
  "post/toggleBookmark",
  async (postId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        postId,
        bookmarked: response.data.data.bookmarked as boolean,
        bookmarksCount: response.data.data.bookmarksCount as number,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        throw new Error(
          error.response?.data?.message || "Could not update saved post",
        );
      }

      throw error;
    }
  },
);

const initialState: {
  allPosts: PostData[] | null;
  homeFeed: PostData[] | null;
  savedPosts: PostData[] | null;
  savedPostsLoading: boolean;
  savedPostsError: string | null;
  savedPostsHasMore: boolean;
  savedPostsPage: number;
  isLoading: boolean;
  singlePost: PostData | null;
  isError: boolean;
  error: string | null;
  postLikes: Record<string, PostLike[]>;
  likesPage: Record<string, number>;
  likesHasMore: Record<string, boolean>;
  likesLoading: boolean;
  likesError: string | null;
  likingPostIds: string[];
  bookmarkingPostIds: string[];
} = {
  allPosts: null,
  homeFeed: null,
  savedPosts: null,
  savedPostsLoading: false,
  savedPostsError: null,
  savedPostsHasMore: false,
  savedPostsPage: 0,
  isLoading: false,
  singlePost: null,
  isError: false,
  error: null,
  postLikes: {},
  likesPage: {},
  likesHasMore: {},
  likesLoading: false,
  likesError: null,
  likingPostIds: [],
  bookmarkingPostIds: [],
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
      state.isError = false;
      state.error = null;
      state.allPosts = action.payload;
    });
    builder.addCase(getAllPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(getAllPosts.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.error = null;
    });

    builder.addCase(getHomeFeed.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.homeFeed = action.payload;
    });
    builder.addCase(getHomeFeed.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(getHomeFeed.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.error = null;
    });

    builder.addCase(sharePost.fulfilled, (state, action) => {
      const shared = action.payload;
      state.homeFeed = [
        shared,
        ...(state.homeFeed || []).filter((post) => post._id !== shared._id),
      ];
      state.allPosts = [
        shared,
        ...(state.allPosts || []).filter((post) => post._id !== shared._id),
      ];

      const originalId = shared.sharedPost?._id;
      const originalSharesCount = shared.sharedPost?.sharesCount;
      if (originalId && originalSharesCount !== undefined) {
        for (const posts of [state.homeFeed, state.allPosts]) {
          const original = posts.find((post) => post._id === originalId);
          if (original) original.sharesCount = originalSharesCount;
        }
      }
    });

    builder.addCase(getUserBookmarks.pending, (state) => {
      state.savedPostsLoading = true;
      state.savedPostsError = null;
    });
    builder.addCase(getUserBookmarks.fulfilled, (state, action) => {
      const { page = 1 } = action.meta.arg || {};
      const { posts, hasMore } = action.payload;
      const existingPosts = page === 1 ? [] : state.savedPosts || [];
      const existingIds = new Set(existingPosts.map((post) => post._id));
      state.savedPosts = [
        ...existingPosts,
        ...posts.filter((post) => !existingIds.has(post._id)),
      ];
      state.savedPostsPage = page;
      state.savedPostsHasMore = hasMore;
      state.savedPostsLoading = false;
    });
    builder.addCase(getUserBookmarks.rejected, (state, action) => {
      state.savedPostsLoading = false;
      state.savedPostsError = action.error.message || "Could not load saved posts";
    });

    builder.addCase(getPostLikes.pending, (state) => {
      state.likesLoading = true;
      state.likesError = null;
    });
    builder.addCase(getPostLikes.fulfilled, (state, action) => {
      const { postId, page, users, hasMore } = action.payload;
      const existingUsers = page === 1 ? [] : state.postLikes[postId] || [];
      const existingIds = new Set(existingUsers.map((user) => user._id));
      state.postLikes[postId] = [
        ...existingUsers,
        ...users.filter((user) => !existingIds.has(user._id)),
      ];
      state.likesPage[postId] = page;
      state.likesHasMore[postId] = hasMore;
      state.likesLoading = false;
    });
    builder.addCase(getPostLikes.rejected, (state, action) => {
      state.likesLoading = false;
      state.likesError = action.error.message || "Could not load likes";
    });

    builder.addCase(togglePostLike.pending, (state, action) => {
      if (!state.likingPostIds.includes(action.meta.arg)) {
        state.likingPostIds.push(action.meta.arg);
      }
    });

    builder.addCase(togglePostLike.fulfilled, (state, action) => {
      const { postId, data } = action.payload;
      const { liked, likesCount } = data;

      // Remove postId from loading list
      state.likingPostIds = state.likingPostIds.filter((id) => id !== postId);

      // Update the post's like status and count
      const updateLike = (post: PostData) => {
        if (post._id !== postId) return post;

        return {
          ...post,
          isLiked: liked,
          likesCount: likesCount,
        };
      };

      if (state.allPosts) {
        state.allPosts = state.allPosts.map(updateLike);
      }

      if (state.homeFeed) {
        state.homeFeed = state.homeFeed.map(updateLike);
      }

      if (state.singlePost) {
        state.singlePost = updateLike(state.singlePost);
      }
    });

    builder.addCase(togglePostLike.rejected, (state, action) => {
      state.likingPostIds = state.likingPostIds.filter(
        (id) => id !== action.meta.arg,
      );
    });

    builder.addCase(togglePostBookmark.pending, (state, action) => {
      if (!state.bookmarkingPostIds.includes(action.meta.arg)) {
        state.bookmarkingPostIds.push(action.meta.arg);
      }
    });
    builder.addCase(togglePostBookmark.fulfilled, (state, action) => {
      const { postId, bookmarked, bookmarksCount } = action.payload;
      state.bookmarkingPostIds = state.bookmarkingPostIds.filter(
        (id) => id !== postId,
      );

      const bookmarkedPost =
        state.homeFeed?.find((post) => post._id === postId) ??
        state.allPosts?.find((post) => post._id === postId) ??
        (state.singlePost?._id === postId ? state.singlePost : undefined);
      const updateBookmark = (post: PostData) =>
        post._id === postId
          ? { ...post, bookmarked, bookmarksCount }
          : post;

      if (state.allPosts) state.allPosts = state.allPosts.map(updateBookmark);
      if (state.homeFeed) state.homeFeed = state.homeFeed.map(updateBookmark);
      if (state.singlePost) state.singlePost = updateBookmark(state.singlePost);
      if (state.savedPosts) {
        state.savedPosts = bookmarked
          ? state.savedPosts.some((post) => post._id === postId)
            ? state.savedPosts.map(updateBookmark)
            : bookmarkedPost
              ? [...state.savedPosts, { ...bookmarkedPost, bookmarked, bookmarksCount }]
              : state.savedPosts
          : state.savedPosts.filter((post) => post._id !== postId);
      }
    });
    builder.addCase(togglePostBookmark.rejected, (state, action) => {
      state.bookmarkingPostIds = state.bookmarkingPostIds.filter(
        (id) => id !== action.meta.arg,
      );
    });

    builder.addCase(getSinglePost.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isError = false;
      state.error = null;
      state.singlePost = action.payload;
    });

    builder.addCase(getSinglePost.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });

    builder.addCase(getSinglePost.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.error = null;
    });

    builder.addCase(deletePost.fulfilled, (state, action: any) => {
      state.isLoading = false;
      if (state.allPosts) {
        state.allPosts = state.allPosts.filter(
          (post) => post._id !== action.payload.post._id,
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

      if (state.allPosts) {
        state.allPosts = state.allPosts.map((post) =>
          post._id === action.payload.post._id ? action.payload.post : post,
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
