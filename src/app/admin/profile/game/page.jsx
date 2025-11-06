"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import { useTheme } from "@/context/ThemeContext";
import { Gamepad2, User2, AlertCircle } from "lucide-react";

export default function GamePage() {
  const { updateUser, loading } = useAuth();
  const { bgColor, textColor } = useTheme() || {};

  const [userData, setUserData] = useState({});
  const [gameId, setGameId] = useState("");
  const [gameUserName, setGameUserName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData(storedUser);
    setGameId(String(storedUser.gameId || "")); // ✅ Ensure string
    setGameUserName(storedUser.gameUserName || "");
  }, []);

  const validate = () => {
    const newErrors = {};

    // 🎯 BGMI ID validation (must be 11 digits)
    if (!String(gameId).trim()) {
      newErrors.gameId = "BGMI ID is required";
    } else if (!/^\d+$/.test(gameId)) {
      newErrors.gameId = "BGMI ID must contain only numbers";
    } else if (String(gameId).length !== 11) {
      newErrors.gameId = "BGMI ID must be exactly 11 digits";
    }

    // 🧍‍♂️ Username validation
    if (!gameUserName.trim())
      newErrors.gameUserName = "BGMI username is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await updateUser(userData._id, { gameId, gameUserName });
    } catch (err) {
      console.error(err);
    }
  };

  const inputBaseStyle = {
    color: textColor || "#fff",
    border: `1px solid ${textColor || "#444"}`,
    backgroundColor: "transparent",
  };

  const labelStyle = {
    color: textColor || "#aaa",
  };

  const buttonStyle = {
    backgroundColor: textColor || "#444",
    color: "#000",
  };

  return (
    <div
      className="rounded-xl p-6 shadow-md transition-all duration-500"
      style={{
        backgroundColor: bgColor || "#121212",
        color: textColor || "#fff",
      }}
    >
      <h3
        className="text-lg font-semibold mb-4 flex items-center gap-2"
        style={{ color: textColor }}
      >
        <Gamepad2 className="w-5 h-5" />
        Game Details
      </h3>

      <form onSubmit={handleSave} className="space-y-5">
        {/* BGMI ID */}
        <div>
          <label
            className="block mb-1 text-sm flex items-center gap-2"
            style={labelStyle}
          >
            <Gamepad2 size={16} />
            Battlegrounds Mobile India ID (BGMI ID)
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength="11"
            placeholder="Enter your 11-digit BGMI ID"
            value={gameId}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, ""); // allow digits only
              setGameId(val);
            }}
            className={`w-full p-2 rounded-md focus:outline-none transition-all ${
              errors.gameId ? "border-red-500" : ""
            }`}
            style={{
              ...inputBaseStyle,
              borderColor: errors.gameId
                ? "#ef4444"
                : textColor || "#555",
            }}
          />
          {errors.gameId && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.gameId}
            </p>
          )}
        </div>

        {/* BGMI Username */}
        <div>
          <label
            className="block mb-1 text-sm flex items-center gap-2"
            style={labelStyle}
          >
            <User2 size={16} />
            Game Username (same as your BGMI username)
          </label>
          <input
            type="text"
            placeholder="Enter your BGMI username"
            value={gameUserName}
            onChange={(e) => setGameUserName(e.target.value)}
            className={`w-full p-2 rounded-md focus:outline-none transition-all ${
              errors.gameUserName ? "border-red-500" : ""
            }`}
            style={{
              ...inputBaseStyle,
              borderColor: errors.gameUserName
                ? "#ef4444"
                : textColor || "#555",
            }}
          />
          {errors.gameUserName && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.gameUserName}
            </p>
          )}
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
                size={24}
                colorClass="text-cyan-400"
                className="animate-spin mx-auto"
              />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
