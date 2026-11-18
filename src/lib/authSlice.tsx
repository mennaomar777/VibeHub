import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_API_URL = "https://route-posts.routemisr.com/users";

type AuthUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string;
};

type AuthApiResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: string;
    user: AuthUser;
  };
};

type LoginValues =
  | { email: string; password: string }
  | { username: string; password: string };

type RegisterValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  gender: string;
};

type AuthState = {
  token: string | null;
  userData: AuthUser | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || "Something went wrong";
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

const saveToken = (token?: string) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem("token", token);
    document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  } else {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  }
};

export const handleLogin = createAsyncThunk<
  AuthApiResponse,
  LoginValues,
  { rejectValue: string }
>("auth/login", async (values, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthApiResponse>(
      `${AUTH_API_URL}/signin`,
      values,
    );
    saveToken(response.data.data?.token);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  if (typeof window !== "undefined") {
    saveToken();
  }
});

export const handleRegister = createAsyncThunk<
  AuthApiResponse,
  RegisterValues,
  { rejectValue: string }
>("auth/register", async (values, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthApiResponse>(
      `${AUTH_API_URL}/signup`,
      values,
    );
    saveToken(response.data.data?.token);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const initialState: AuthState = {
  token: null,
  userData: null,
  isLoading: false,
  isError: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.token = action.payload.data?.token ?? null;
        state.userData = action.payload.data?.user ?? null;
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload ?? action.error.message ?? "Something went wrong";
      })
      .addCase(handleRegister.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(handleRegister.fulfilled, (state, action) => {
        state.token = action.payload.data?.token ?? null;
        state.userData = action.payload.data?.user ?? null;
        state.isLoading = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload ?? action.error.message ?? "Something went wrong";
      })
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const authReducer = authSlice.reducer;
