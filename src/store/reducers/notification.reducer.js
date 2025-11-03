import { createSlice } from "@reduxjs/toolkit";
import {
    fetchNotificationsAction,
    createNotificationAction,
    markNotificationAsReadAction,
    deleteNotificationAction,
    clearAllNotificationsAction,
} from "../actions/notification.action";

const initialState = {
    notifications: [],  // list of all notifications
    loading: false,     // general loading state
    error: null,        // general error message
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        clearNotificationState: (state) => {
            state.notifications = [];
            state.loading = false;
            state.error = null;
        },
        markAllAsReadLocal: (state) => {
            state.notifications = state.notifications.map((n) => ({
                ...n,
                isRead: true,
            }));
        },
    },
    extraReducers: (builder) => {
        // --- Fetch All Notifications ---
        builder
            .addCase(fetchNotificationsAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotificationsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotificationsAction.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to fetch notifications";
            });

        // --- Create Notification ---
        builder
            .addCase(createNotificationAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNotificationAction.fulfilled, (state, action) => {
                state.loading = false;
                // Add newly created notification at the top
                if (action.payload) {
                    state.notifications.unshift(action.payload);
                }
            })
            .addCase(createNotificationAction.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to create notification";
            });

        // --- Mark Notification As Read ---
        builder
            .addCase(markNotificationAsReadAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markNotificationAsReadAction.fulfilled, (state, action) => {
                console.log("🚀 ~ action:", action)
                state.loading = false;
                // Mark every notification as read
                state.notifications = state.notifications.map((n) => ({
                    ...n,
                    isRead: true,
                }));
            })
            .addCase(markNotificationAsReadAction.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to mark notification as read";
            });

        // --- Delete Single Notification ---
        builder
            .addCase(deleteNotificationAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNotificationAction.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload;
                state.notifications = state.notifications.filter((n) => n._id !== id);
            })
            .addCase(deleteNotificationAction.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to delete notification";
            });

        // --- Clear All Notifications ---
        builder
            .addCase(clearAllNotificationsAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearAllNotificationsAction.fulfilled, (state) => {
                state.loading = false;
                state.notifications = [];
            })
            .addCase(clearAllNotificationsAction.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to clear notifications";
            });
    },
});

export const { clearNotificationState, markAllAsReadLocal } =
    notificationSlice.actions;

export default notificationSlice.reducer;
