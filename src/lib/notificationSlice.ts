import { INotification } from "./../app/interfaces/INotification";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

function requestErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
}

export const getNotifications = createAsyncThunk<
  {
    notifications: INotification[];
    currentPage: number;
    hasMore: boolean;
  },
  {
    unread?: boolean;
    page?: number;
    limit?: number;
  },
  {
    rejectValue: string;
    state: { notifications: NotificationsState };
  }
>(
  "notifications/getNotifications",
  async ({ unread, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const res = await axios.get(
        "https://route-posts.routemisr.com/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ...(unread !== undefined && { unread: !unread }),
            page,
            limit,
          },
        },
      );

      const notifications: INotification[] = res.data.data.notifications;

      const pagination = res.data.meta.pagination;

      const currentPage = pagination.currentPage;

      const hasMore = pagination.currentPage < pagination.numberOfPages;

      return {
        notifications,
        currentPage,
        hasMore,
      };
    } catch (error: unknown) {
      return rejectWithValue(
        requestErrorMessage(error, "Could not load notifications."),
      );
    }
  },
  {
    condition: ({ page = 1 }, { getState }) => {
      if (page === 1) return true;

      const { notifications } = getState();
      return (
        notifications.hasMore &&
        !notifications.isLoading &&
        !notifications.isLoadingMore
      );
    },
  },
);

export const getUnreadCount = createAsyncThunk<
  number,
  void,
  {
    rejectValue: string;
  }
>("notifications/getUnreadCount", async (_, { rejectWithValue }) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const res = await axios.get(
      "https://route-posts.routemisr.com/notifications/unread-count",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.data.unreadCount;
  } catch (error: unknown) {
    return rejectWithValue(
      requestErrorMessage(error, "Could not load unread count."),
    );
  }
});

export const markAllNotificationsAsRead = createAsyncThunk<
  number,
  void,
  {
    rejectValue: string;
  }
>(
  "notifications/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const res = await axios.patch(
        "https://route-posts.routemisr.com/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.data.modifiedCount;
    } catch (error: unknown) {
      return rejectWithValue(
        requestErrorMessage(
          error,
          "Could not mark all notifications as read.",
        ),
      );
    }
  },
);

export const markNotificationAsRead = createAsyncThunk<
  INotification,
  { id: string },
  {
    rejectValue: string;
  }
>(
  "notifications/markNotificationAsRead",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const res = await axios.patch(
        `https://route-posts.routemisr.com/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.data.notification;
    } catch (error: unknown) {
      return rejectWithValue(
        requestErrorMessage(error, "Could not mark notification as read."),
      );
    }
  },
);

interface NotificationsState {
  notifications: INotification[];
  unreadCount: number;
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  notificationsRequestId: string | null;
  isLoadingMore: boolean;
  loadMoreError: string | null;
  unreadCountLoading: boolean;
  unreadCountError: string | null;
  markAllNotificationsLoading: boolean;
  markAllNotificationsError: string | null;
  pendingNotificationIds: string[];
  markNotificationErrors: Record<string, string>;
}
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  isError: false,
  error: null,
  notificationsRequestId: null,
  isLoadingMore: false,
  loadMoreError: null,
  unreadCountLoading: false,
  unreadCountError: null,
  markAllNotificationsLoading: false,
  markAllNotificationsError: null,
  pendingNotificationIds: [],
  markNotificationErrors: {},
};
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.pending, (state, action) => {
      state.notificationsRequestId = action.meta.requestId;

      if ((action.meta.arg.page ?? 1) === 1) {
        state.isLoading = true;
        state.isLoadingMore = false;
        state.currentPage = 1;
        state.hasMore = true;
        state.isError = false;
        state.error = null;
        state.loadMoreError = null;
      } else {
        state.isLoadingMore = true;
        state.loadMoreError = null;
      }
    });

    builder.addCase(getNotifications.fulfilled, (state, action) => {
      if (state.notificationsRequestId !== action.meta.requestId) return;

      const { notifications, currentPage, hasMore } = action.payload;
      if ((action.meta.arg.page ?? 1) === 1) {
        state.notifications = notifications;
      } else {
        const notificationIds = new Set(
          state.notifications.map((notification) => notification._id),
        );
        state.notifications.push(
          ...notifications.filter((notification) => {
            if (notificationIds.has(notification._id)) return false;
            notificationIds.add(notification._id);
            return true;
          }),
        );
      }
      state.currentPage = currentPage;
      state.hasMore = hasMore;
      state.isLoading = false;
      state.isLoadingMore = false;
      state.isError = false;
      state.error = null;
      state.loadMoreError = null;
      state.notificationsRequestId = null;
    });

    builder.addCase(getNotifications.rejected, (state, action) => {
      if (state.notificationsRequestId !== action.meta.requestId) return;

      if ((action.meta.arg.page ?? 1) === 1) {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload ?? "Could not load notifications.";
      } else {
        state.isLoadingMore = false;
        state.loadMoreError = action.payload ?? "Could not load notifications.";
      }
      state.notificationsRequestId = null;
    });

    builder.addCase(getUnreadCount.pending, (state) => {
      state.unreadCountLoading = true;
      state.unreadCountError = null;
    });

    builder.addCase(getUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
      state.unreadCountLoading = false;
      state.unreadCountError = null;
    });

    builder.addCase(getUnreadCount.rejected, (state, action) => {
      state.unreadCountLoading = false;
      state.unreadCountError = action.payload ?? "Could not load unread count.";
    });

    builder.addCase(markAllNotificationsAsRead.pending, (state) => {
      state.markAllNotificationsLoading = true;
      state.markAllNotificationsError = null;
    });

    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
      state.unreadCount = 0;
      state.markAllNotificationsLoading = false;
      state.markAllNotificationsError = null;
      state.markNotificationErrors = {};
    });

    builder.addCase(markAllNotificationsAsRead.rejected, (state, action) => {
      state.markAllNotificationsLoading = false;
      state.markAllNotificationsError =
        action.payload ?? "Could not mark all notifications as read.";
    });

    builder.addCase(markNotificationAsRead.pending, (state, action) => {
      state.pendingNotificationIds.push(action.meta.arg.id);
      delete state.markNotificationErrors[action.meta.arg.id];
    });

    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const pendingIndex = state.pendingNotificationIds.indexOf(
        action.meta.arg.id,
      );
      if (pendingIndex !== -1) state.pendingNotificationIds.splice(pendingIndex, 1);

      const existingNotification = state.notifications.find(
        (notification) => notification._id === action.payload._id,
      );

      if (existingNotification && !existingNotification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }

      state.notifications = state.notifications.map((notification) =>
        notification._id === action.payload._id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      );

      delete state.markNotificationErrors[action.meta.arg.id];
    });

    builder.addCase(markNotificationAsRead.rejected, (state, action) => {
      const pendingIndex = state.pendingNotificationIds.indexOf(
        action.meta.arg.id,
      );
      if (pendingIndex !== -1) state.pendingNotificationIds.splice(pendingIndex, 1);

      const notification = state.notifications.find(
        (item) => item._id === action.meta.arg.id,
      );

      if (notification?.isRead) {
        delete state.markNotificationErrors[action.meta.arg.id];
      } else {
        state.markNotificationErrors[action.meta.arg.id] =
          action.payload ?? "Could not mark notification as read.";
      }
    });
  },
});

export const notificationsReducer = notificationsSlice.reducer;
export const { resetNotifications } = notificationsSlice.actions;
