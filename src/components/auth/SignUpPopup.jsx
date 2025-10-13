"use client";
import React, { useState } from "react";

const SignUpPopup = ({ onClose, onShowLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    gender: "MALE",
    bio: "",
    role: "PLAYER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("Sign Up data:", formData);
    setMessage("Sign up successful! You can now log in.");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-[#1E3A8A] mb-6">
          Sign Up
        </h2>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name Fields */}
          <div className="flex space-x-2">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-1/2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-1/2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
              required
            />
          </div>

          {/* Other Fields */}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
            required
          />
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile"
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
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

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#1E3A8A] text-white font-medium hover:bg-[#1B2E70] transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

     <div className="mt-4 text-sm text-gray-600 text-center">
  Already have an account?{" "}
  <button
    type="button"
    onClick={() => {
      if (onClose) onClose();
      if (onShowLogin) onShowLogin();
    }}
    className="text-[#1E3A8A] hover:underline font-medium"
  >
    Login
  </button>
</div>

        {/* Success Message */}
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default SignUpPopup;
