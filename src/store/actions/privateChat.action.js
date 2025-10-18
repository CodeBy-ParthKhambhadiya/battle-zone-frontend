import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "@/lib/axios"; // your axios wrapper
import Toast from "react-hot-toast";

// Fetch all users (except current user)
export const fetchAllUsersAction = createAsyncThunk(
  "privateChat/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/private-chat/all-users");
      return response.data; // array of user objects
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Create a new private chat
export const createPrivateChatAction = createAsyncThunk(
  "privateChat/create",
  async (receiverId, thunkAPI) => {

    try {
      // Wrap receiverId in an object so it becomes valid JSON
      const response = await apiRequest.post("/private-chat/create", { receiverId });

      Toast.success("Chat created successfully!");
      return response.data; // Assuming API returns the created chat object
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

export const sendMessageAction = createAsyncThunk(
  "privateChat/sendMessage",
  async ({ chatId, message }, thunkAPI) => {
    try {
      const response = await apiRequest.post("/private-chat/message", {
        chatId,
        message,
      });

      Toast.success("Message sent!");
      return response.data; // assuming API returns the created message object
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send message!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchMessagesAction = createAsyncThunk(
  "privateChat/fetchMessages",
  async (chatId, thunkAPI) => {
    try {
      const response = await apiRequest.get(`/private-chat/${chatId}`);
      return response.data; // assuming API returns an array of messages
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch messages!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);


export const fetchUserPrivateChatsAction = createAsyncThunk(
  "privateChat/fetchUserChats",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/private-chat/user");
      return response.data; // array of chat objects for the current user
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch user chats!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);