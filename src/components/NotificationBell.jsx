"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Trash2, XCircle, ArrowLeft } from "lucide-react";
import useNotifications from "@/hooks/useNotifications";
import useAuth from "@/hooks/useAuth";

export default function NotificationBell() {
  const { user } = useAuth();
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications(user?._id);

  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);
  const unreadCountAll = notifications.filter((n) => !n.isRead).length;
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSelectedNotification(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const fetchData = async () => {
      try {
        await fetchNotifications();
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (open && unreadCountAll > 0) {
      const markAll = async () => {
        try {
          await markAllAsRead();
        } catch (error) {
        }
      };
      markAll();
    }
  }, [open]);

  const handleClearAll = async () => {
    await clearAllNotifications();
  };

  const handleDelete = async (notifId) => {
    await deleteNotification(notifId);
  };

  const handleViewNotification = (notif) => {
    if (!notif.isRead) markAsRead(notif._id);
    setSelectedNotification(notif);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition relative"
      >
        <Bell className="text-cyan-400" />
        {unreadCountAll > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {unreadCountAll}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 z-50 overflow-hidden animate-fadeIn sm:w-96">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            {selectedNotification ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-cyan-400 hover:text-cyan-300 transition"
                >
                  <ArrowLeft size={18} />
                </button>
                <p className="text-cyan-300 font-semibold text-sm">
                  Notification Detail
                </p>
              </div>
            ) : (
              <>
                <p className="text-cyan-300 font-semibold text-sm">
                  Notification Center
                </p>
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-gray-400 hover:text-red-400 transition flex items-center gap-1"
                    >
                      <XCircle size={14} /> Clear
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* List or Detail */}
          <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {selectedNotification ? (
              <div className="p-4 space-y-3">
                <h3 className="text-cyan-300 font-semibold text-base">
                  {selectedNotification.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedNotification.message}
                </p>
                <p className="text-[11px] text-gray-500">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </p>

                <button
                  onClick={() => handleDelete(selectedNotification._id)}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 transition text-sm py-2 rounded-lg border border-red-400/20 hover:border-red-400/40"
                >
                  <Trash2 size={14} /> Delete Notification
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-gray-400 text-center py-10">
                <p>No notifications yet</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    onClick={() => handleViewNotification(notif)}
                    className={`px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition-all cursor-pointer ${
                      notif.isRead
                        ? "opacity-70"
                        : "opacity-100 bg-gray-900/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-3">
                        <p className="text-sm font-semibold text-cyan-300">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif._id);
                          }}
                          className="text-xs text-red-400 hover:text-red-300 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
