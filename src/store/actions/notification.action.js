import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "@/lib/axios";
import Toast from "@/utils/toast";

/**
 * Fetch all notifications for the logged-in user
 */
export const fetchNotificationsAction = createAsyncThunk(
  "notification/fetchAll",
  async (_, thunkAPI) => {
    try {
        
      const response = await apiRequest.get("/notifications/notifi");
      return response.data?.data || []; // assuming backend returns { data: [...] }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch notifications!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

/**
 * Create a new notification for a specific user
 * (Usually called by admin or system events, not directly from frontend)
 */
export const createNotificationAction = createAsyncThunk(
  "notification/create",
  async ({ userId, notificationData }, thunkAPI) => {
    try {
      const response = await apiRequest.post(
        `/notifications/${userId}`,
        notificationData
      );
      Toast.success("Notification sent successfully!");
      return response.data?.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create notification!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

/**
 * Mark a notification as read
 */
export const markNotificationAsReadAction = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest.post("/notifications/me/read-all");
      return response.data; // no need for ?.data?.data unless nested
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to mark all as read!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);
/**
 * Delete a single notification
 */
export const deleteNotificationAction = createAsyncThunk(
  "notification/deleteOne",
  async (notificationId, thunkAPI) => {
    try {
      const response = await apiRequest.delete(`/notifications/${notificationId}`);
      Toast.success("Notification deleted!");
      return notificationId; // just return ID so reducer can filter it out
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete notification!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);

/**
 * Clear all notifications for the current user
 */
export const clearAllNotificationsAction = createAsyncThunk(
  "notification/clearAll",
  async (_, thunkAPI) => {
    try {
      await apiRequest.delete("/notifications/");
      Toast.success("All notifications cleared!");
      return [];
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to clear notifications!";
      Toast.error(message);
      return thunkAPI.rejectWithValue(error.response?.data || { message });
    }
  }
);
