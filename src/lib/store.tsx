import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { postReducer } from "./postSlice";
import { commentsReducer } from "./commentsSlice";
import { profileReducer } from "./profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    comments: commentsReducer,
    profile: profileReducer,
  },
});

export type stateType = ReturnType<typeof store.getState>;
export type dispatchType = typeof store.dispatch;
