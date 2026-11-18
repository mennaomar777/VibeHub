import { UserData } from "@/app/interfaces/postData";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type FollowSuggestion = {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  mutualFollowersCount: number;
  followersCount: number;
};

export const toggleFollowUser = createAsyncThunk(
  "profile/toggleFollowUser",
  async ({ userId }: { userId: string }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return {
        userId,
        following: Boolean(response.data.data.following),
        followersCount: Number(response.data.data.followersCount ?? 0),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        throw new Error(error.response?.data?.message || "Could not update follow status");
      }

      throw error;
    }
  },
);

export const getUserProfileById = createAsyncThunk(
  "profile/userProfileById",
  async (userId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return {
        user: response.data.data.user as UserData,
        isFollowing: Boolean(response.data.data.isFollowing),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        throw new Error(error.response?.data?.message || "Could not load profile");
      }

      throw error;
    }
  },
);

export const getFollowSuggestions = createAsyncThunk(
  "profile/followSuggestions",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    try {
      const response = await axios.get(
        "https://route-posts.routemisr.com/users/suggestions",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        },
      );
      const pagination = response.data.meta?.pagination;

      return {
        suggestions: response.data.data.suggestions as FollowSuggestion[],
        page: pagination?.currentPage ?? page,
        hasMore: Boolean(pagination?.nextPage),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        throw new Error(
          error.response?.data?.message || "Could not load friend suggestions",
        );
      }

      throw error;
    }
  },
);

export const uploadProfilePhoto = createAsyncThunk(
  "profile/uploadPhoto",
  async (formdata: FormData) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const getUserData = createAsyncThunk("profile/userData", async () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      message: res.data.message,
      user: res.data.data?.user ?? res.data.user ?? res.data.data,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
});

export const changePassword = createAsyncThunk(
  "profile/changePass",
  async (data: { password: string; newPassword: string }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    try {
      const res = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  message: string;
  userData: UserData;
  viewedUser: UserData | null;
  viewedUserId: string | null;
  viewedUserIsFollowing: boolean;
  followStatusByUserId: Record<string, boolean>;
  followActionUserIds: string[];
  viewedUserLoading: boolean;
  viewedUserError: string | null;
  followSuggestions: FollowSuggestion[];
  suggestionsLoaded: boolean;
  suggestionsLoading: boolean;
  suggestionsError: string | null;
  suggestionsHasMore: boolean;
  suggestionsPage: number;
} = {
  isLoading: false,
  isError: false,
  error: null,
  message: "",
  userData: {
    _id: "",
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    photo: "",
    createdAt: "",
  },
  viewedUser: null,
  viewedUserId: null,
  viewedUserIsFollowing: false,
  followStatusByUserId: {},
  followActionUserIds: [],
  viewedUserLoading: false,
  viewedUserError: null,
  followSuggestions: [],
  suggestionsLoaded: false,
  suggestionsLoading: false,
  suggestionsError: null,
  suggestionsHasMore: false,
  suggestionsPage: 0,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserProfileById.pending, (state, action) => {
      state.viewedUserId = action.meta.arg;
      state.viewedUser = null;
      state.viewedUserIsFollowing = false;
      state.viewedUserLoading = true;
      state.viewedUserError = null;
    });
    builder.addCase(getUserProfileById.fulfilled, (state, action) => {
      if (state.viewedUserId !== action.meta.arg) return;
      state.viewedUser = action.payload.user;
      state.viewedUserIsFollowing = action.payload.isFollowing;
      state.followStatusByUserId[action.meta.arg] = action.payload.isFollowing;
      state.viewedUserLoading = false;
    });
    builder.addCase(getUserProfileById.rejected, (state, action) => {
      if (state.viewedUserId !== action.meta.arg) return;
      state.viewedUserLoading = false;
      state.viewedUserError = action.error.message || "Could not load profile";
    });

    builder.addCase(getFollowSuggestions.pending, (state) => {
      state.suggestionsLoading = true;
      state.suggestionsError = null;
    });
    builder.addCase(getFollowSuggestions.fulfilled, (state, action) => {
      const { page, suggestions, hasMore } = action.payload;
      const existing = page === 1 ? [] : state.followSuggestions;
      const existingIds = new Set(existing.map((user) => user._id));
      state.followSuggestions = [
        ...existing,
        ...suggestions.filter((user) => !existingIds.has(user._id)),
      ];
      state.suggestionsPage = page;
      state.suggestionsHasMore = hasMore;
      state.suggestionsLoaded = true;
      state.suggestionsLoading = false;
    });
    builder.addCase(getFollowSuggestions.rejected, (state, action) => {
      state.suggestionsLoading = false;
      state.suggestionsError =
        action.error.message || "Could not load friend suggestions";
    });

    builder.addCase(toggleFollowUser.pending, (state, action) => {
      if (!state.followActionUserIds.includes(action.meta.arg.userId)) {
        state.followActionUserIds.push(action.meta.arg.userId);
      }
    });
    builder.addCase(toggleFollowUser.fulfilled, (state, action) => {
      const { userId, following, followersCount } = action.payload;
      const wasFollowing =
        state.followStatusByUserId[userId] ??
        (state.viewedUserId === userId && state.viewedUserIsFollowing);

      state.followStatusByUserId[userId] = following;
      state.followActionUserIds = state.followActionUserIds.filter(
        (id) => id !== userId,
      );

      if (state.viewedUserId === userId) {
        state.viewedUserIsFollowing = following;
        if (state.viewedUser) state.viewedUser.followersCount = followersCount;
      }

      if (following) {
        state.followSuggestions = state.followSuggestions.filter(
          (user) => user._id !== userId,
        );
      } else {
        const suggestion = state.followSuggestions.find(
          (user) => user._id === userId,
        );
        if (suggestion) suggestion.followersCount = followersCount;
      }

      if (state.userData._id) {
        const followingDelta = Number(following) - Number(wasFollowing);
        state.userData.followingCount = Math.max(
          0,
          (state.userData.followingCount ?? state.userData.following?.length ?? 0) + followingDelta,
        );
      }
    });
    builder.addCase(toggleFollowUser.rejected, (state, action) => {
      state.followActionUserIds = state.followActionUserIds.filter(
        (id) => id !== action.meta.arg.userId,
      );
    });

    builder.addCase(uploadProfilePhoto.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.error = "";
      state.message = action.payload.message;
    });
    builder.addCase(uploadProfilePhoto.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(uploadProfilePhoto.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.error = "";
      state.message = action.payload.message;
      state.userData = action.payload.user ?? state.userData;
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(getUserData.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.error = "";
      state.message = action.payload.message;
      const token = action.payload.data?.token;
      if (token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
        }
      }
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
    });
  },
});
export const profileReducer = profileSlice.reducer;
