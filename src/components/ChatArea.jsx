"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function ChatArea({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Dummy initial messages
  const dummyMessages = [
    { id: 1, sender: "system", text: "Welcome to the chat!" },
    { id: 2, sender: "user", text: "Hi there, how are you?" },
    { id: 3, sender: "player", text: "I'm good! How about you?" },
    { id: 4, sender: "user", text: "Doing great, thanks!" },
  ];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages for the room from localStorage or dummy content
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`chat-${roomId}`));
    if (stored && stored.length > 0) {
      setMessages(stored);
    } else {
      setMessages(dummyMessages); // load dummy messages if nothing stored
    }
  }, [roomId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = { id: Date.now(), sender: "player", text: newMessage };
    const updatedMessages = [...messages, newMsg];

    setMessages(updatedMessages);
    localStorage.setItem(`chat-${roomId}`, JSON.stringify(updatedMessages));
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-xs ${
              msg.sender === "player"
                ? "bg-accent-primary text-white self-end"
                : msg.sender === "system"
                ? "bg-gray-500 text-white self-center"
                : "bg-gray-700 text-gray-200 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-primary"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-md bg-accent-primary text-white hover:bg-indigo-700 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
