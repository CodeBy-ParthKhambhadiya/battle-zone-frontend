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
      router.push(`/player/chat/${chatRoomId}`);
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
  console.log("🚀 ~ ChatIndexPage ~ newChatUserList:", newChatUserList)

  const displayedUsers = searchQuery ? filteredUsers : newChatUserList;

  return (
    <div className="flex flex-col items-center justify-start p-6 text-gray-200 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Start a Chat</h2>

      <div className="mb-6 w-full">
        <div className="flex items-center bg-gray-800 rounded-full shadow-md overflow-hidden border border-gray-700 focus-within:ring-2 focus-within:ring-accent-primary transition-shadow hover:shadow-lg">
          {/* Search icon inside a circle */}


          {/* Input field */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-gray-800 text-gray-200 p-3 rounded-r-full focus:outline-none placeholder-gray-500"
          />
          <div className="flex items-center justify-center w-12 h-12 text-gray-400 bg-gray-900">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>


      {loading ? (
        <div className="flex items-center justify-center w-full mt-4">
          <LoaderIcon className="animate-spin w-8 h-8 text-accent-primary" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : displayedUsers.length > 0 ? (
        <div className="flex flex-col w-full gap-2">
          {displayedUsers.map((user) => {
            const { bgColor, textColor } = getRandomColor();
            return (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                style={{ backgroundColor: bgColor, color: textColor }}
                className="p-4 rounded-md shadow hover:shadow-md cursor-pointer flex items-center gap-4 transition-shadow"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                )}

                <div className="flex flex-col">
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm">{user.username}</p>
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
