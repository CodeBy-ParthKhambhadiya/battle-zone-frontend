"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import { useTheme } from "@/context/ThemeContext"; // 🎨 Theme hook

export default function GamePage() {
  const { updateUser, loading } = useAuth();
  const { bgColor, textColor } = useTheme() || {};

  const [userData, setUserData] = useState({});
  const [gameId, setGameId] = useState("");
  const [gameUserName, setGameUserName] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData(storedUser);
    setGameId(storedUser.gameId || "");
    setGameUserName(storedUser.gameUserName || "");
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userData._id, { gameId, gameUserName });
    } catch (err) {
      console.error(err);
    }
  };

  // 🎨 Themed styles
  const inputStyle = {
    // backgroundColor: textColor || "#1e1e1e",
    color: textColor || "#fff",
    border: `1px solid ${textColor || "#444"}`,
  };
  const labelStyle = {
    color: textColor || "#aaa",
  };

  const buttonStyle = {
    backgroundColor: textColor || "#444",
    color: "#000000ff",
  };

  return (
    <div
      className="rounded-xl p-6 shadow-md transition-all duration-500"
      style={{
        backgroundColor: bgColor || "#121212",
        color: textColor || "#fff",
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
        Game Details
      </h3>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Game ID */}
        <div>
          <label className="block mb-1 text-sm" style={labelStyle}>
            Game ID
          </label>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full p-2 rounded-md focus:outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = textColor || "#00bcd4")}
            onBlur={(e) => (e.target.style.borderColor = textColor || "#555")}
          />
        </div>

        {/* Game Username */}
        <div>
          <label className="block mb-1 text-sm" style={labelStyle}>
            Game Username
          </label>
          <input
            type="text"
            value={gameUserName}
            onChange={(e) => setGameUserName(e.target.value)}
            className="w-full p-2 rounded-md focus:outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = textColor || "#00bcd4")}
            onBlur={(e) => (e.target.style.borderColor = textColor || "#555")}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-2 rounded-md shadow-md transition-all duration-300"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
             {loading ? (
                         <LoaderIcon
                           size={24} // or 20 / 32 depending on your button size
                           colorClass="text-[]" // glowing cyan
                           className="animate-spin mx-auto" // center if needed
                         />
                       ) : (
                         "Update Changes"
                       )}
          </button>
        </div>
      </form>
    </div>
  );
}
