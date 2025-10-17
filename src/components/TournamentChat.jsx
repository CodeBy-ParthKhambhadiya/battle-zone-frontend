"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import useTournament from "@/hooks/useTournament";
import useAuth from "@/hooks/useAuth";

export default function TournamentChatPage({ tournamentId }) {
  const { fetchTournamentChatsById, tournamentChatById, sendTournamentMessage } = useTournament();
  const { user } = useAuth();
  const currentUserId = user?._id;
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const messages = tournamentChatById?.messages || [];
  const organizerId = tournamentChatById?.organizer?._id;

  // Fetch messages initially
  useEffect(() => {
    fetchTournamentChatsById(tournamentId);
  }, [tournamentId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    try {
      await sendTournamentMessage({ tournamentId, message: trimmedMessage });
      await fetchTournamentChatsById(tournamentId);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-xl mx-auto h-[75vh] bg-gray-900 rounded-lg shadow-md border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700">
        <button onClick={() => router.back()} className="p-1 rounded hover:bg-gray-700 text-gray-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-white font-semibold text-sm">Tournament Chat</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 flex flex-col">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender._id === currentUserId;
          const isOrganizer = msg.sender._id === organizerId;

          const messageBg = isCurrentUser
            ? "bg-indigo-600 text-white self-end ml-auto"
            : isOrganizer
            ? "bg-red-600 text-white self-start"
            : "bg-gray-800 text-gray-200 self-start";

          return (
            <div key={msg._id} className={`p-2 rounded-lg break-words w-fit max-w-[85%] ${messageBg}`}>
              {!isCurrentUser && (
                <div className="text-xs font-semibold mb-1 flex flex-col">
                  <span className="text-gray-200">{isOrganizer ? "Organizer" : "Player"}</span>
                  <span>{msg.sender.firstName} {msg.sender.lastName}</span>
                </div>
              )}
              <div>{msg.message}</div>
              <div className="text-xs text-gray-300 mt-1 flex items-center justify-end gap-1">
                {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex gap-2 items-center p-3 border-t border-gray-800 bg-gray-900">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 text-sm sm:text-base"
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
