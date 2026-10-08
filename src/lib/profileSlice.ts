import { UserData } from "@/app/interfaces/postData";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
