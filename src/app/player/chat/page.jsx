"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import usePrivateChat from "@/hooks/usePrivateChat";
import  useAuth  from "@/hooks/useAuth"; // ✅ added import
import LoaderIcon from "@/components/LoadingButton";

export default function ChatIndexPage() {
  const router = useRouter();
  const {
    allUsers,
    fetchAllUsers,
    createPrivateChat,
    chatUserList,
    fetchUserPrivateChats,
    loading,
    error,
  } = usePrivateChat();

  const { user } = useAuth(); // ✅ get logged-in user
  const currentUserId = user?._id;

  const [searchQuery, setSearchQuery] = useState("");

  // fetch data on mount
  useEffect(() => {
    fetchAllUsers();
    fetchUserPrivateChats();
  }, []);

  // handle opening or creating chat
  const handleUserClick = async (userId) => {
    try {
      const chatRoom = await createPrivateChat(userId);
      const chatRoomId = chatRoom?._id;
      router.push(`/player/chat/${chatRoomId}`);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  // search filter for all users (new chat)
  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // build chat list with unread count
  const newChatUserList = chatUserList
    .map((chat) => {
      const otherUser = chat.otherUser;
      if (!otherUser) return null;

      // count unread messages for current user
      const unreadCount =
        chat.messages?.filter(
          (msg) =>
            msg.sender !== currentUserId &&
            !msg.readBy?.includes(currentUserId)
        ).length || 0;

      return { ...otherUser, unreadCount };
    })
    .filter(Boolean)
    .filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

  // display users: if searching → all users, else → chat list
  const displayedUsers = searchQuery ? filteredUsers : newChatUserList;

  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  return (
    <div className="flex flex-col justify-start p-6 text-gray-200 w-full max-w-md mx-auto">
      {/* 🔍 Search Bar */}
      <div className="mb-6 w-full">
        <div
          className="flex items-center rounded-full overflow-hidden transition-all"
          style={{
            backgroundColor: "#0D1117",
            border: "1px solid #00E5FF",
            boxShadow: "0 0 10px #00E5FF, 0 0 20px #00E5FF33",
          }}
        >
          <input
            type="text"
            placeholder="Search user to chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#00E5FF] placeholder-[#00E5FF99] p-3 rounded-l-full focus:outline-none"
          />

          <div
            className="flex items-center justify-center w-12 h-12 cursor-pointer transition-all"
            style={{
              backgroundColor: "#0D1117",
              color: "#00E5FF",
              boxShadow: "inset 0 0 10px #00E5FF55",
            }}
          >
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 💬 Chat List */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : displayedUsers.length > 0 ? (
        <div className="flex flex-col w-full gap-2">
          {displayedUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                border: `1px solid ${textColor}`,
                boxShadow: `0 0 10px ${textColor}, 0 0 20px ${textColor}33`,
              }}
              className="p-4 rounded-md cursor-pointer flex items-center gap-4 transition-all hover:scale-[1.02]"
            >
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} avatar`}
                  className="w-12 h-12 rounded-full object-cover border border-cyan-400 shadow-[0_0_10px_#00E5FF]"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 font-semibold"
                  style={{
                    backgroundColor: "#1A1F25",
                    border: `1px solid ${textColor}`,
                    boxShadow: `0 0 8px ${textColor}55`,
                    color: textColor,
                  }}
                >
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
              )}

              {/* Name + Username + Unread Badge */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>

                  {/* 🔔 Unread Count Badge */}
                  {user.unreadCount > 0 && (
                    <span
                      className="ml-2 text-xs bg-[#00E5FF] text-black font-bold rounded-full px-2 py-0.5 shadow-[0_0_8px_#00E5FF]"
                    >
                      {user.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-80">{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mt-4">No users found.</p>
      )}
    </div>
  );
}
