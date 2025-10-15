// actions/auth.action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/axios";
import Toast from "@/utils/toast";
import Cookie from "js-cookie";

// Signup action
export const signUpAction = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/auth/register",
        data: userData,
      });
      Toast.success(response.message);
      return response; // just the user data
    } catch (error) {
      Toast.error(error.message);

      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/auth/verify-otp",
        data: otpData,
      });
      // Success
      Toast.success(response.message);

      return response.data; // return user data
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Something went wrong during OTP verification";
      Toast.error(message);

      return thunkAPI.rejectWithValue({
        message,
        code: error?.response?.data?.code || "OTP_ERROR",
        otpExpiresAt: error?.response?.data?.otpExpiresAt || null,
      });
    }
  }
);


export const resendOtpAction = createAsyncThunk(
  "auth/resendOtp",
  async ({ email, role }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/auth/resend-otp",
        data: { email, role }, // send role along with email
      });

      Toast.success(response.message);

      return response;
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.error(errorMessage);

      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const forgotPasswordAction = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email, role }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/auth/forgot-password",
        data: { email, role },
      });

      if (!response || !response.success) {
        return thunkAPI.rejectWithValue(response?.message);
      }

      Toast.success(response.message || "Reset link sent to your email");
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Something went wrong";
      if (errorMessage) Toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const loginAction = createAsyncThunk(
  "auth/login",
  async (loginData, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/auth/login",
        data: loginData,
      });
      Toast.success(response.message);

      // Save token to cookie or localStorage
      if (response) {
        localStorage.setItem("token", response.data.token); // token
      }
      if (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("🚀 ~ response.data:", response.data)
      }

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      Toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserAction = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "GET",
        url: "/user/me",
      });

      if (!response || response.error) {
        return thunkAPI.rejectWithValue(response?.message || "Failed to fetch user");
      }

      return response.data; // return user object
    } catch (error) {
      Toast.error(error.message || "Something went wrong while fetching user");
      return thunkAPI.rejectWithValue(error.message || "Fetch user failed");
    }
  }
);
export const updateUserAction = createAsyncThunk(
  "user/updateUser",
  async ({ userId, data, avatarFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me/${userId}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const responseData = await response.json();

      if (!response.ok || responseData.error) {
        throw new Error(responseData.message || "Failed to update user");
      }

      localStorage.setItem("user", JSON.stringify(responseData.data));
      Toast.success("Profile updated successfully!");
      return responseData.data;
    } catch (error) {
      Toast.error(error.message || "Failed to update user");
      return thunkAPI.rejectWithValue(error.message || "Failed to update user");
    }
  }
);