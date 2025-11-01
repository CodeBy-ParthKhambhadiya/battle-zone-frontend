import { useState, useEffect, useRef } from "react";
import { Send, Check } from "lucide-react";
import usePrivateChat from "@/hooks/usePrivateChat";
import useAuth from "@/hooks/useAuth";

export default function ChatArea({ roomId }) {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { chat, sendMessage, fetchMessages } = usePrivateChat();
  const { user } = useAuth();

  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  const messageList = Array.isArray(chat?.messages) ? chat.messages : [];

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch messages initially
  useEffect(() => {
    if (roomId && messageList.length === 0) {
      fetchMessages(roomId);
    }
  }, [roomId, messageList.length]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

const handleSend = async () => {
  if (!newMessage.trim() || !chat?._id) return;

  const messageToSend = newMessage;
  setNewMessage(""); // Clear immediately before async call (keeps keyboard open)

  // Keep focus with a short delay — lets React finish re-render
  setTimeout(() => {
    inputRef.current?.focus();
  }, 100);

  try {
    await sendMessage({ chatId: chat._id, message: messageToSend });

    // Delay fetching slightly to avoid immediate DOM update that steals focus
    setTimeout(() => {
      fetchMessages(roomId);
    }, 200);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};


const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // stop blur
    handleSend();
  }
};
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="flex flex-col flex-1 rounded-lg shadow-md overflow-hidden border"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${textColor}33`,
        boxShadow: `0 0 15px ${textColor}11`,
      }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 scrollbar-thin">
        {messageList.length === 0 ? (
          <div
            className="text-center text-sm mt-10"
            style={{ color: `${textColor}99` }}
          >
            No messages yet...
          </div>
        ) : (
          messageList.map((msg) => {
            const isCurrentUser = msg.sender === user?._id;

            return (
              <div
                key={msg._id}
                className={`p-2 rounded-lg break-words w-fit max-w-[85%] sm:max-w-[75%] ${
                  isCurrentUser ? "self-end ml-auto" : "self-start"
                }`}
                style={{
                  backgroundColor: isCurrentUser
                    ? `${textColor}22`
                    : `${textColor}0A`,
                  color: isCurrentUser ? textColor : `${textColor}CC`,
                  border: `1px solid ${textColor}44`,
                  boxShadow: isCurrentUser
                    ? `0 0 10px ${textColor}33`
                    : `0 0 6px ${textColor}11`,
                }}
              >
                <div>{msg.message}</div>
                <div
                  className="text-xs mt-1 text-right flex items-center justify-end gap-1"
                  style={{ color: `${textColor}88` }}
                >
                  {formatTime(msg.sentAt)}
                  {msg.sender === user?._id &&
                    (msg.readBy?.length > 1 ? (
                      <>
                        <Check
                          className="w-3 h-3"
                          style={{ color: textColor }}
                        />
                        <Check
                          className="w-3 h-3 -ml-1"
                          style={{ color: textColor }}
                        />
                      </>
                    ) : (
                      <Check
                        className="w-3 h-3"
                        style={{ color: `${textColor}88` }}
                      />
                    ))}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div
        className="flex gap-2 items-center p-3 border-t"
        style={{
          borderTop: `1px solid ${textColor}44`,
          backgroundColor: `${bgColor}`,
        }}
      >
        <input
          type="text"
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-md text-sm sm:text-base focus:outline-none"
          style={{
            backgroundColor: `${bgColor}`,
            color: textColor,
            border: `1px solid ${textColor}33`,
            boxShadow: `0 0 8px ${textColor}11 inset`,
            caretColor: textColor,
          }}
        />
        <button
          onClick={handleSend}
          className="p-2 sm:p-3 rounded-md transition-all"
          style={{
            backgroundColor: `${textColor}22`,
            border: `1px solid ${textColor}66`,
            color: textColor,
            boxShadow: `0 0 10px ${textColor}33`,
          }}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
