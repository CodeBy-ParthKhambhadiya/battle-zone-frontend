import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "@/lib/axios"; // your axios wrapper
import Toast from "react-hot-toast";

// Fetch all users (except current user)
export const fetchAllUsersAction = createAsyncThunk(
  "privateChat/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.get("/private-chat/all-users");
      console.log("🚀 ~ response:", response);
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
    console.log("🚀 ~ receiverId:", receiverId);

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
