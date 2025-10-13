"use client";
import React, { useState } from "react";

const ForgotPasswordPopup = ({
  onClose,         // remove default here to force the parent to pass it
  onShowLogin,
  onShowSignup,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    role: "PLAYER",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = (e) => {
    e.preventDefault();
    setMessage(`Password reset link sent to ${formData.email} for ${formData.role}`);
  };

  // Safe close handler
  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClose}  // click on overlay closes
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // clicks inside popup do NOT close
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={handleClose} // click on ✕ closes
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-[#1E3A8A] mb-6">
          Forgot Password
        </h2>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
          >
            <option value="PLAYER">Player</option>
            <option value="ORGANIZER">Organizer</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#1E3A8A] text-white font-medium hover:bg-[#1B2E70] transition-colors duration-200"
          >
            Send Reset Link
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => {
                handleClose();
                onShowLogin?.();
              }}
              className="text-[#1E3A8A] hover:underline font-medium"
            >
              Login
            </button>
          </p>

          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                handleClose();
                onShowSignup?.();
              }}
              className="text-[#1E3A8A] hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>

        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
