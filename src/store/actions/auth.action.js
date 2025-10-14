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
      Toast.error(message);

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
