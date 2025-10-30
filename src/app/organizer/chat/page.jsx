"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import usePrivateChat from "@/hooks/usePrivateChat";
import { useRouter } from "next/navigation";
import LoaderIcon from "@/components/LoadingButton";
import { getRandomColor } from "@/components/getColor";

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

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllUsers();
    fetchUserPrivateChats();
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const chatRoom = await createPrivateChat(userId);
      const chatRoomId = chatRoom?._id;
      router.push(`/organizer/chat/${chatRoomId}`);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const newChatUserList = chatUserList
    .map((chat) => chat.otherUser)
    .filter((user) => user) // remove undefined/null
    .filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

  const displayedUsers = searchQuery ? filteredUsers : newChatUserList;
  const bgColor = "#0D1117";   // dark card background
  const textColor = "#00E5FF"; // glowing cyan text

  return (
    <div className="flex flex-col items-center justify-start p-6 text-gray-200 w-full max-w-md mx-auto">
      <h2
        className="text-2xl font-semibold mb-6 text-center"
        style={{
          color: "#00E5FF",
        }}
      >
        Start a Chat
      </h2>
      <div className="mb-6 w-full">
        <div
          className="flex items-center rounded-full overflow-hidden transition-all"
          style={{
            backgroundColor: "#0D1117",
            border: "1px solid #00E5FF",
            boxShadow: "0 0 10px #00E5FF, 0 0 20px #00E5FF33",
          }}
        >
          {/* Input field */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#00E5FF] placeholder-[#00E5FF99] p-3 rounded-l-full focus:outline-none"
          />

          {/* Search icon */}
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



      {loading ? (
        <div className="flex items-center justify-center w-full mt-20">
          <LoaderIcon size={15} colorClass="text-blue-600" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : displayedUsers.length > 0 ? (
        <div className="flex flex-col w-full gap-2">
          {displayedUsers.map((user) => {

            return (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${textColor}`,
                  boxShadow: `0 0 10px ${textColor}, 0 0 20px ${textColor}33`, // subtle glow
                }}
                className="p-4 rounded-md cursor-pointer flex items-center gap-4 transition-all hover:scale-[1.02]"
              >
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

                <div className="flex flex-col">
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-sm opacity-80">{user.username}</p>
                </div>
              </div>
            );
          })}

        </div>
      ) : (
        <p className="text-gray-400 mt-4">No users found.</p>
      )}
    </div>
  );
}
