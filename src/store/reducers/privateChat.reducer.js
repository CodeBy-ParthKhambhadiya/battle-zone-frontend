import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllUsersAction,
  createPrivateChatAction,
  sendMessageAction,
  fetchMessagesAction,
  fetchUserPrivateChatsAction,
} from "../actions/privateChat.action";

const initialState = {
  allUsers: [],       // list of users for private chat
  chatUserList: [],   // list of users involved in chats
  chat: null,         // currently active chat
  messages: [],       // messages in the current chat
  loading: false,     // general loading state
  error: null,        // general error state
};

const privateChatSlice = createSlice({
  name: "privateChat",
  initialState,
  reducers: {
    clearPrivateChatState: (state) => {
      state.allUsers = [];
      state.chatUserList = [];
      state.chat = null;
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
    clearChat: (state) => {
      state.chat = null;
      state.messages = [];
    },
    setChatUserList: (state, action) => {
      state.chatUserList = action.payload; // set or update chat users list
    },
  },
  extraReducers: (builder) => {
    // --- Fetch All Users ---
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

    // --- Create Private Chat ---
    builder
      .addCase(createPrivateChatAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrivateChatAction.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
        // Optional: add chat user to chatUserList if not already there
        const otherUserId =
          action.payload.senderId !== undefined
            ? action.payload.receiverId
            : null;
        if (
          otherUserId &&
          !state.chatUserList.find((u) => u._id === otherUserId)
        ) {
          const userFromAllUsers = state.allUsers.find(
            (u) => u._id === otherUserId
          );
          if (userFromAllUsers) state.chatUserList.push(userFromAllUsers);
        }
      })
      .addCase(createPrivateChatAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create chat";
      });

    // --- Send Message ---
    builder
      .addCase(sendMessageAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageAction.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessageAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send message";
      });

    // --- Fetch Messages ---
    builder
      .addCase(fetchMessagesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload; // full chat object
        state.messages = action.payload.messages || []; // messages array
      })
      .addCase(fetchMessagesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch messages";
      });

    builder
      // --- Fetch User Private Chats ---
      .addCase(fetchUserPrivateChatsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPrivateChatsAction.fulfilled, (state, action) => {
        state.loading = false;
        // replace current chats with fetched chats
        state.chatUserList = action.payload; // store chats with users
      })
      .addCase(fetchUserPrivateChatsAction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch user private chats";
      });
  },
});

export const { clearPrivateChatState, clearChat, setChatUserList } =
  privateChatSlice.actions;
export default privateChatSlice.reducer;
