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

// Verify OTP action
export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/auth/verify-otp",
        data: otpData,
      });

      if (!response || response.error) {
        return thunkAPI.rejectWithValue(response?.message || "OTP verification failed");
      }

      Toast.success(response.message);

      if (response.data) {
        Cookie.set("user", JSON.stringify(response.data));
      }

      return response.data; // user data
    } catch (error) {
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.message || "Something went wrong during OTP verification");
    }
  }
);

export const resendOtpAction = createAsyncThunk(
  "auth/resendOtp",
  async (email, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/auth/resend-otp",
        data: { email },
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
      Toast.success(response.message );

      // Save token to cookie or localStorage
      if (response.data?.token) {
        Cookie.set("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Something went wrong";
      Toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);