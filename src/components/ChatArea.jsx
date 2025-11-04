import { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { socket } from "@/lib/socket";
import {
  fetchMessagesAction,
  sendMessageAction,
} from "@/store/actions/privateChat.action";
import LoaderIcon from "./LoadingButton";

import { useDispatch, useSelector } from "react-redux";

export default function ChatArea({ roomId }) {
  const [newMessage, setNewMessage] = useState("");
  const [incomingMessage, setIncomingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [displayedMessages, setDisplayedMessages] = useState([]); // <-- fixed: state for messages shown in UI

  const { messages, chat, loading } = useSelector(
    (state) => state.privateChat
  );

  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  // ✅ Socket message handler
  const handleNewMessage = useCallback((data) => {
    setIncomingMessage(data);
  }, []);

  // ✅ Setup socket connection + join room
  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", user._id);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveRoom", user._id);
      socket.off("newMessage", handleNewMessage);
      console.log("🚪 Left socket room:", user._id);
    };
  }, [user?._id, handleNewMessage]);

  // ✅ Fetch chat messages
  const fetchMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;
      try {
        await dispatch(fetchMessagesAction(chatId)).unwrap();
      } catch (err) {
      }
    },
    [dispatch]
  );

  // Fetch messages whenever roomId changes
  useEffect(() => {
    if (roomId) fetchMessages(roomId);
  }, [roomId, fetchMessages]);

  // ✅ Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages]);
  // ✅ Send a message
  const handleSend = async () => {
    if (!newMessage.trim() || !roomId) return;

    const messageToSend = newMessage.trim();
    setNewMessage("");

    try {
      const result = await dispatch(
        sendMessageAction({ chatId: roomId, message: messageToSend })
      ).unwrap();

      // Emit socket event
      socket.emit("sendMessage", { chatId: roomId, message: result });

      // Re-fetch updated messages so last one displays
      await fetchMessages(roomId);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Press Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ Show new incoming message instantly
  useEffect(() => {
    if (Array.isArray(messages)) {
      setDisplayedMessages(messages);
    }
  }, [messages]);

  // when a new incoming message arrives
  useEffect(() => {
    if (incomingMessage?.chatId === roomId) {
      setDisplayedMessages((prev) => {
        const prevMessages = Array.isArray(prev) ? [...prev] : [];
        const updated = [...prevMessages, incomingMessage.message];
        return updated;
      });
    }
  }, [incomingMessage, roomId]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="flex flex-col flex-1 rounded-2xl shadow-md overflow-hidden border bg-white/5 backdrop-blur-md"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${textColor}22`,
      }}
    >
      {/* Message Area */}
  <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth no-scrollbar">
  {displayedMessages.length === 0 ? (
    <div
      className="text-center text-sm mt-10"
      style={{ color: `${textColor}99` }}
    >
      No messages yet...
    </div>
  ) : (
    displayedMessages.map((msg) => {
      const isUser = msg.sender === user?._id;

      // Skip rendering if neither message nor time is available
      if (!msg.message && !msg.sentAt) return null;

      return (
        <div
          key={msg._id || Math.random()}
          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] sm:max-w-[70%] md:max-w-[60%] shadow-sm transition-all duration-200 break-words whitespace-pre-wrap`}
            style={{
              backgroundColor: isUser ? `${textColor}22` : `${textColor}12`,
              color: textColor,
              borderTopRightRadius: isUser ? "0.5rem" : "1rem",
              borderTopLeftRadius: isUser ? "1rem" : "0.5rem",
              wordWrap: "break-word",
            }}
          >
            {/* ✅ Render message only if it exists */}
            {msg.message && <div>{msg.message}</div>}

            {/* ✅ Render time only if it exists */}
            {msg.sentAt && (
              <div
                className="text-[10px] text-right mt-1 opacity-60"
                style={{ color: `${textColor}88` }}
              >
                {formatTime(msg.sentAt)}
              </div>
            )}
          </div>
        </div>
      );
    })
  )}
  <div ref={messagesEndRef}></div>
</div>


      {/* Input Section */}
      <div
        className="flex items-center gap-2 p-3 border-t bg-white/10 backdrop-blur-md"
        style={{ borderTop: `1px solid ${textColor}22` }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Message..."
          className="flex-1 p-2 rounded-full focus:outline-none text-sm placeholder:text-gray-400"
          style={{
            backgroundColor: `${textColor}08`,
            color: textColor,
            border: `1px solid ${textColor}22`,
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !newMessage.trim()}
          className="p-2 rounded-full transition hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${textColor}22`,
            border: `1px solid ${textColor}44`,
            color: textColor,
          }}
        >
          {loading ? (
            <LoaderIcon className="animate-spin w-5 h-5" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );

}
