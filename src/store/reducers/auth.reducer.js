// reducers/auth.reducer.js
import { createSlice } from "@reduxjs/toolkit";
import { resendOtpAction, signUpAction, verifyOtpAction } from "@/store/actions/auth.action";

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  requestStatus: null, // optional
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.success = false;
      state.requestStatus = null;
      Cookie.remove("user");
    },
    resetError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signUpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.requestStatus = "pending";
      })
      .addCase(signUpAction.fulfilled, (state, action) => {
        console.log("🚀 ~ action:", action)
        state.loading = false;
        state.user = action.payload?.data; // already the user data
        state.success = true;
        state.requestStatus = "fulfilled";
      })
      .addCase(signUpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
        state.requestStatus = "rejected";
      });

    // Verify OTP
    builder
      .addCase(verifyOtpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyOtpAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      .addCase(resendOtpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtpAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to resend OTP";
      });

  },
});

export const { logout, resetError, resetSuccess } = authReducer.actions;
export default authReducer.reducer;
