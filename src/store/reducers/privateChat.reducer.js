import { createSlice } from "@reduxjs/toolkit";
import { fetchAllUsersAction, createPrivateChatAction } from "../actions/privateChat.action";

const initialState = {
  allUsers: [],       // list of users for private chat
  chat: null,         // newly created chat
  loading: false,     // general loading state
  error: null,        // general error state
};

const privateChatSlice = createSlice({
  name: "privateChat",
  initialState,
  reducers: {
    clearPrivateChatState: (state) => {
      state.allUsers = [];
      state.chat = null;
      state.loading = false;
      state.error = null;
    },
    clearChat: (state) => {
      state.chat = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Users
    builder
      .addCase(fetchAllUsersAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      });

    // Create Private Chat
    builder
      .addCase(createPrivateChatAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrivateChatAction.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
      })
      .addCase(createPrivateChatAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create chat";
      });
  },
});

export const { clearPrivateChatState, clearChat } = privateChatSlice.actions;
export default privateChatSlice.reducer;
