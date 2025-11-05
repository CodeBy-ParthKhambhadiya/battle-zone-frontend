"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "@/lib/socket";

import {
    fetchNotificationsAction,
    createNotificationAction,
    markNotificationAsReadAction,
    deleteNotificationAction,
    clearAllNotificationsAction,
} from "@/store/actions/notification.action";

export default function useNotifications(userId) {
    const dispatch = useDispatch();

    // Redux notifications state
    const { notifications: reduxNotifications, loading, error } = useSelector(
        (state) => state.notification
    );

    const [liveNotifications, setLiveNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        socket.connect();
        socket.emit("joinRoom", userId);

        socket.on("notification", (notif) => {
            setLiveNotifications((prev) => [notif, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // optional: play notification sound
            const audio = new Audio("/sounds/notify.mp3");
            audio.play().catch(() => { });
        });

        return () => {
            socket.off("notification");
            socket.disconnect();
        };
    }, [userId]);

    // 🔹 Merge Redux + Live notifications (avoid duplicates)
    const allNotifications = [
        ...liveNotifications,
        ...reduxNotifications.filter(
            (r) => !liveNotifications.some((l) => l._id === r._id)
        ),
    ];

    // 🔹 Fetch all notifications
    const fetchNotifications = async () => {
        const result = await dispatch(fetchNotificationsAction()).unwrap();
        return result;
    };

    // 🔹 Create a new notification
    const createNotification = async ({ userId, notificationData }) => {
        const result = await dispatch(
            createNotificationAction({ userId, notificationData })
        ).unwrap();
        return result;
    };

    // 🔹 Mark a notification as read
    const markAllAsRead = async () => {

        await dispatch(markNotificationAsReadAction()).unwrap();
    };

    // 🔹 Delete a notification
    const deleteNotification = async (notificationId) => {
        const result = await dispatch(
            deleteNotificationAction(notificationId)
        ).unwrap();
        return result;
    };

    // 🔹 Clear all notifications
    const clearAllNotifications = async () => {
        const result = await dispatch(clearAllNotificationsAction()).unwrap();
        return result;
    };

    // 🔹 Mark all as read (local only)
    //   const markAllAsRead = () => {
    //     setUnreadCount(0);
    //     setLiveNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    //   };

    return {
        notifications: allNotifications,
        unreadCount,
        loading,
        error,
        setUnreadCount,
        fetchNotifications,
        createNotification,
        deleteNotification,
        clearAllNotifications,
        markAllAsRead,
    };
}
