// reducers/auth.reducer.js
import { createSlice } from "@reduxjs/toolkit";
import { deleteUserAction, fetchUserAction, forgotPasswordAction, getAdminDetailsAction, getUnverifiedUsersAction, loginAction, resendOtpAction, signUpAction, updateUserAction, verifyOtpAction, verifyUserAction } from "@/store/actions/auth.action";

const initialState = {
  user: null,
  admin: null,
  userList: [],
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
      })

      .addCase(forgotPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(loginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      .addCase(fetchUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    builder
      .addCase(updateUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user || action.payload; // handle both response shapes

        const updatedUser = action.payload.user || action.payload;

        // ✅ Update that user in userList if it exists
        if (state.userList && Array.isArray(state.userList)) {
          state.userList = state.userList.map((u) =>
            u._id === updatedUser._id ? updatedUser : u
          );
        }
      })
      .addCase(updateUserAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  // 🟦 1️⃣ Get Unverified Users
  builder
      .addCase(getUnverifiedUsersAction.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.requestStatus = "fetching";
  })
    .addCase(getUnverifiedUsersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.requestStatus = "fetch-success";
      // Assuming backend returns { users: [...] } or array directly
      state.userList = action.payload.users || action.payload || [];
    })
    .addCase(getUnverifiedUsersAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.requestStatus = "fetch-failed";
    });

  // 🟩 2️⃣ Verify / Disable User
  builder
      .addCase(verifyUserAction.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.requestStatus = "verifying";
  })
    .addCase(verifyUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.requestStatus = "verify-success";

      const updatedUser = action.payload.user;

      // ✅ Update userList item directly
      state.userList = state.userList.map((u) =>
        u._id === updatedUser._id ? updatedUser : u
      );
    })
    .addCase(verifyUserAction.rejected, (state, action) => {

      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.requestStatus = "verify-failed";
    });

  // 🟥 3️⃣ Delete User
  builder
      .addCase(deleteUserAction.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.requestStatus = "deleting";
  })
    .addCase(deleteUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;

      const deletedUser = action.payload;
      // ✅ Filter userList
      state.userList = state.userList.filter(
        (u) => u._id !== deletedUser._id
      );
    })
    .addCase(deleteUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.requestStatus = "delete-failed";
    });
  builder
      .addCase(getAdminDetailsAction.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
    .addCase(getAdminDetailsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.admin = action.payload; // 👈 store admin details
    })
    .addCase(getAdminDetailsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.admin = null; // reset admin on error
    });
},
});

export const { logout, resetError, resetSuccess } = authReducer.actions;
export default authReducer.reducer;
