"use client";

import ChatArea from "@/components/ChatArea";
import usePrivateChat from "@/hooks/usePrivateChat";
import useAuth from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react"; // Lucide icon for back button

export default function ChatRoomPage() {
  const router = useRouter();
  const pathname = usePathname();
  const roomId = pathname.split("/").pop(); // Extract roomId from URL
  const { allUsers, fetchAllUsers, chat } = usePrivateChat();
  const { user } = useAuth();

  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (!user || !chat || !allUsers) return;

    const otherUserId =
      chat.senderId === user._id ? chat.receiverId : chat.senderId;

    const matchedUser = allUsers.find(u => u._id === otherUserId);
    setChatUser(matchedUser || null);
  }, [user, chat, allUsers]);

  return (
    <div className="flex flex-col bg-gray-900 text-gray-200 p-4 
                    rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl 
                    overflow-hidden h-[675px] w-full max-w-[900px] mx-auto">

      {/* Chat Header */}
      <div className="flex items-center gap-4 mb-4">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-700 transition"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        {/* Avatar */}
        {chatUser?.avatar ? (
          <img
            src={chatUser.avatar}
            alt={`${chatUser.firstName} ${chatUser.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            {chatUser?.firstName?.[0] || "U"}
          </div>
        )}

        {/* Name & optional bio */}
        <div className="flex flex-col">
          <span className="font-semibold text-white">
            {chatUser ? `${chatUser.firstName} ${chatUser.lastName}` : ""}

          </span>
          {chatUser?.username && (
            <span className="text-gray-400 text-sm truncate">{chatUser.username}</span>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ChatArea
          roomId={roomId}
          sendMessageUserId={chatUser?._id || null}
        />
      </div>
    </div>
  );
}
