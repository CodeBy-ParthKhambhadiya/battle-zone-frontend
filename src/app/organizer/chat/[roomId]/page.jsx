"use client";

import ChatArea from "@/components/ChatArea";
import usePrivateChat from "@/hooks/usePrivateChat";
import useAuth from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function ChatRoomPage() {
  const router = useRouter();
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();

  const { allUsers, fetchAllUsers, chat } = usePrivateChat();
  const { user } = useAuth();
  const [chatUser, setChatUser] = useState(null);

  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (!user || !chat || !allUsers) return;
    const otherUserId =
      chat.senderId === user._id ? chat.receiverId : chat.senderId;
    const matchedUser = allUsers.find((u) => u._id === otherUserId);
    setChatUser(matchedUser || null);
  }, [user, chat, allUsers]);

  return (
    <div
      className="flex flex-col p-4 rounded-2xl overflow-hidden h-[675px] w-full max-w-[900px] mx-auto transition-all duration-300"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: `0 0 20px ${textColor}22`,
        border: `1px solid ${textColor}44`,
      }}
    >
      {/* Chat Header */}
      <div
        className="flex items-center gap-4 mb-4 py-3 px-2 rounded-xl"
        style={{
          borderBottom: `1px solid ${textColor}55`,
          boxShadow: `0 1px 12px ${textColor}22`,
        }}
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: `${textColor}15`,
            color: textColor,
            boxShadow: `0 0 6px ${textColor}33`,
          }}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Avatar */}
        {chatUser?.avatar ? (
          <img
            src={chatUser.avatar}
            alt={`${chatUser.firstName} ${chatUser.lastName}`}
            className="w-10 h-10 rounded-full object-cover border"
            style={{
              borderColor: `${textColor}55`,
              boxShadow: `0 0 8px ${textColor}33`,
            }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold"
            style={{
              backgroundColor: `${textColor}33`,
              color: textColor,
              boxShadow: `0 0 8px ${textColor}33`,
            }}
          >
            {chatUser?.firstName?.[0] || "U"}
          </div>
        )}

        {/* Name & username */}
        <div>
          <span
            className="font-semibold text-base sm:text-lg block"
            style={{
              color: textColor,
              textShadow: `0 0 8px ${textColor}55`,
            }}
          >
            {chatUser ? `${chatUser.firstName} ${chatUser.lastName}` : ""}
          </span>
          {chatUser?.username && (
            <span
              className="text-sm"
              style={{ color: `${textColor}99` }}
            >
              @{chatUser.username}
            </span>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ChatArea roomId={roomId} sendMessageUserId={chatUser?._id || null} />
      </div>
    </div>
  );
}
