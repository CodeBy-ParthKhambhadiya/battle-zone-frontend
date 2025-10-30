"use client";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import useTournament from "@/hooks/useTournament";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import LoaderIcon from "./LoadingButton";

export default function TournamentChatPage({ tournamentId }) {
  const router = useRouter();
  const { tournamentChatById, sendTournamentMessage, loading } = useTournament();
  const { user } = useAuth();

  const [messages, setMessages] = useState(tournamentChatById?.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 💎 Theme colors
  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  const organizerId = tournamentChatById?.organizer?._id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(tournamentChatById?.messages || []);
  }, [tournamentChatById?.messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      message: newMessage,
      sender: user,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      await sendTournamentMessage({ tournamentId, message: newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((m) => m !== tempMessage));
    }
  };

  return (
    <div
      className="flex flex-col flex-1 w-full max-w-xl mx-auto h-[73vh] rounded-lg overflow-hidden border"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${textColor}33`,
        boxShadow: `0 0 12px ${textColor}22`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 p-3 border-b"
        style={{
          backgroundColor: "#0F1620",
          borderColor: `${textColor}55`,
          boxShadow: `0 2px 8px ${textColor}22`,
        }}
      >
        <button
          onClick={() => router.back()}
          className="p-1 rounded transition-all"
          style={{ color: textColor }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3
          className="font-semibold text-sm"
          style={{ color: textColor }}
        >
          Tournament Chat
        </h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col scrollbar-custom">
        {messages.length === 0 ? (
          <div
            className="text-sm text-center mt-10"
            style={{ color: `${textColor}AA` }}
          >
            No messages yet...
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOrganizer = msg?.sender?._id === organizerId;
            const isCurrentUser = msg?.sender?._id === user?._id;

            return (
              <div
                key={index}
                className={`p-2 rounded-lg break-words w-fit max-w-[85%]`}
                style={{
                  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                  backgroundColor: isCurrentUser
                    ? `${textColor}22`
                    : isOrganizer
                    ? "rgba(255, 80, 80, 0.2)"
                    : "#1A1F29",
                  color: isCurrentUser
                    ? textColor
                    : isOrganizer
                    ? "#FF6666"
                    : "#C9D1D9",
                  border: `1px solid ${
                    isCurrentUser
                      ? `${textColor}55`
                      : isOrganizer
                      ? "#FF666655"
                      : "#30363D"
                  }`,
                  boxShadow: isCurrentUser
                    ? `0 0 8px ${textColor}44`
                    : "none",
                }}
              >
                {!isCurrentUser && (
                  <div className="text-xs font-semibold mb-1">
                    <span
                      style={{
                        color: isOrganizer ? "#FF7B7B" : `${textColor}AA`,
                      }}
                    >
                      {isOrganizer ? "Organizer" : "Player"} —{" "}
                      {msg?.sender?.name || "Unknown"}
                    </span>
                  </div>
                )}
                <div>{msg?.message}</div>
                <div
                  className="text-xs mt-1 flex items-center justify-end gap-1"
                  style={{ color: `${textColor}88` }}
                >
                  {new Date(msg?.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div
        className="flex gap-2 items-center p-3 border-t"
        style={{
          backgroundColor: "#0F1620",
          borderColor: `${textColor}33`,
          boxShadow: `0 -2px 8px ${textColor}22`,
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 rounded-md text-sm sm:text-base outline-none"
          style={{
            backgroundColor: "#1A1F29",
            border: `1px solid ${textColor}33`,
            color: textColor,
            boxShadow: `inset 0 0 6px ${textColor}11`,
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !newMessage.trim()}
          className="p-2 sm:p-3 rounded-md transition-all"
          style={{
            backgroundColor: loading ? "#444" : textColor,
            color: bgColor,
            boxShadow: `0 0 10px ${textColor}66`,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <LoaderIcon className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
