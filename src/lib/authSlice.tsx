import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const handleLogin = createAsyncThunk(
  "auth/login",
  async (values: { email: string; password: string }) => {
    try {
      const res = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        values
      );
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const handleRegister = createAsyncThunk(
  "auth/register",
  async (values: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }) => {
    try {
      const res = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

const initialState: {
  token: null;
  userData: any;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
} = {
  token: null,
  userData: null,
  isLoading: false,
  isError: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearData: (state) => {
      state.token = null;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleLogin.fulfilled, (state, action: any) => {
      const token = action.payload?.token;
      state.token = token;
      state.isLoading = false;
      state.isError = false;
      state.error = "";

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    });

    builder.addCase(handleLogin.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.error = "Error!!!";
    });
    builder.addCase(handleLogin.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(handleRegister.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.isError = false;
      state.error = "";
    });
    builder.addCase(handleRegister.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.error = "Error!!!";
    });
    builder.addCase(handleRegister.pending, (state) => {
      state.isLoading = true;
    });
  },
});
export const authReducer = authSlice.reducer;
export const { clearData } = authSlice.actions;
