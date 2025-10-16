import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import usePrivateChat from "@/hooks/usePrivateChat";
import useAuth from "@/hooks/useAuth";
import { Check } from "lucide-react";

export default function ChatArea({ roomId }) {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null); // input ref
  const messagesEndRef = useRef(null); // ref to scroll to bottom

  const { chat, messages, sendMessage, fetchMessages } = usePrivateChat();

  let currentUserId = null;

  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        currentUserId = parsedUser._id;
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }
    }
  }

  const messageList = Array.isArray(chat?.messages) ? chat?.messages : [];
  console.log("🚀 ~ ChatArea ~ messageList:", messageList)

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Fetch messages initially
  useEffect(() => {
    if (roomId && messageList.length === 0) {
      fetchMessages(roomId);
    }
  }, [roomId, messageList.length]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  const handleSend = async () => {
    if (!newMessage.trim() || !chat?._id) return;

    try {
      await sendMessage({ chatId: chat._id, message: newMessage });
      await fetchMessages(roomId);
      setNewMessage("");
      if (inputRef.current) inputRef.current.focus(); // refocus input
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messageList.map((msg) => {
          const isCurrentUser = msg.sender === currentUserId;
          return (
            <div
              key={msg._id}
              className={`p-2 rounded-lg break-words w-fit max-w-[85%] sm:max-w-[75%] ${msg.sender === currentUserId
                  ? "bg-indigo-600 text-white self-end ml-auto"
                  : "bg-gray-700 text-gray-100 self-start"
                }`}
            >
              <div>{msg.message}</div>
              <div className="text-xs text-gray-300 mt-1 text-right flex items-center justify-end gap-1">
                {formatTime(msg.sentAt)}

                {/* Only show ticks for messages sent by current user */}
                {msg.readBy.length > 1 ? (
                  <>
                    <Check className="w-3 h-3 text-blue-500" />
                    <Check className="w-3 h-3 text-blue-500 -ml-1" />
                  </>
                ) : (
                  <Check className="w-3 h-3 text-gray-200" />
                )}
              </div>
            </div>

          );
        })}
        {/* Dummy div to scroll into view */}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center p-3 border-t border-gray-800 bg-gray-900">
        <input
          type="text"
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
        />
        <button
          onClick={handleSend}
          className="p-2 sm:p-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
