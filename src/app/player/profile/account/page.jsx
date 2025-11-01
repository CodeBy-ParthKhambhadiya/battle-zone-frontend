"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import { useTheme } from "@/context/ThemeContext"; // 🎨 Import theme context

export default function AccountPage() {
  const { updateUser, loading } = useAuth();
  const { bgColor, textColor } = useTheme() || {}; // 🩵 Use theme colors

  const [userData, setUserData] = useState({});
  const [accountHolderName, setAccountHolderName] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData(storedUser);
    setAccountHolderName(storedUser.accountHolderName || "");
    setUpiId(storedUser.upiId || "");
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userData._id, { accountHolderName, upiId });
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

  const infoTextStyle = {
    color: textColor || "#bbb",
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
        Account Details
      </h3>

      <p style={infoTextStyle}>Role: {userData.role || "PLAYER"}</p>
      <p style={infoTextStyle}>
        Verified: {userData.isVerified ? "Yes" : "No"}
      </p>
      <p style={infoTextStyle}>
        Joined:{" "}
        {userData?.createdAt
          ? new Date(userData.createdAt).toLocaleDateString()
          : "N/A"}
      </p>

      <form onSubmit={handleSave} className="space-y-4 mt-4">
        {/* Account Holder Name */}
        <div>
          <label className="block mb-1 text-sm" style={labelStyle}>
            Account Holder Name
          </label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="w-full p-2 rounded-md focus:outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = textColor || "#00bcd4")}
            onBlur={(e) => (e.target.style.borderColor = textColor || "#555")}
          />
        </div>

        {/* UPI ID */}
        <div>
          <label className="block mb-1 text-sm" style={labelStyle}>
            UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
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
