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

  const organizerId = tournamentChatById?.organizer?._id;

  // Scroll to last message whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keep messages in sync if tournamentChatById changes
  useEffect(() => {
    setMessages(tournamentChatById?.messages || []);
  }, [tournamentChatById?.messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // Create a temporary message object
    const tempMessage = {
      message: newMessage,
      sender: user,
      createdAt: new Date().toISOString(),
    };

    // Append the message immediately
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      await sendTournamentMessage({ tournamentId, message: newMessage });
      // Optionally update with server response for accuracy
      // await fetchTournamentChatsById(tournamentId);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally remove message on failure
      setMessages((prev) => prev.filter((m) => m !== tempMessage));
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-xl mx-auto h-[73vh] bg-gray-900 rounded-lg shadow-md border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700">
        <button onClick={() => router.back()} className="p-1 rounded hover:bg-gray-700 text-gray-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-white font-semibold text-sm">Tournament Chat</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-custom flex flex-col">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-sm text-center mt-10">No messages yet...</div>
        ) : (
          messages.map((msg, index) => {
            const isOrganizer = msg?.sender?._id === organizerId;
            const isCurrentUser = msg?.sender?._id === user?._id;

            return (
              <div
                key={index}
                className={`p-2 rounded-lg break-words w-fit max-w-[85%] ${
                  isCurrentUser
                    ? "bg-indigo-600 text-white self-end ml-auto"
                    : isOrganizer
                    ? "bg-red-600 text-white self-start"
                    : "bg-gray-800 text-gray-200 self-start"
                }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs font-semibold mb-1 flex flex-col">
                    <span className="text-gray-200">{isOrganizer ? "Organizer" : "Player"}</span>
                    <span>{msg?.sender?.name || "Unknown"}</span>
                  </div>
                )}
                <div>{msg?.message}</div>
                <div className="text-xs text-gray-300 mt-1 flex items-center justify-end gap-1">
                  {new Date(msg?.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex gap-2 items-center p-3 border-t border-gray-800 bg-gray-900">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 text-sm sm:text-base"
        />
         <button
      onClick={handleSend}
      disabled={loading || !newMessage.trim()}
      className={`p-2 sm:p-3 rounded-md text-white transition-all ${
        loading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      {loading ? <LoaderIcon className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
    </button>
      </div>
    </div>
  );
}
