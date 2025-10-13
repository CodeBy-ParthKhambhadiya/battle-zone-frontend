"use client";
import React, { useState } from "react";

const LoginPopup = ({ onClose, onShowSignup, onShowForgot }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "PLAYER",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login (replace with real API call)
        setMessage(`Logged in as ${formData.role} with email ${formData.email}`);
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
                    Login
                </h2>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
                    />

                    {/* Role */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#1E3A8A] focus:ring focus:ring-[#1E3A8A]/20"
                    >
                        <option value="PLAYER">Player</option>
                        <option value="ORGANIZER">Organizer</option>
                    </select>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-[#1E3A8A] text-white font-medium hover:bg-[#1B2E70] transition-colors duration-200"
                    >
                        Login
                    </button>
                </form>

                {/* Links */}
                <div className="mt-4 text-sm text-gray-600">
                    {/* Forgot Password */}
                    <p className="mb-2">
                        Forgot your password?{" "}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onShowForgot?.();
                            }}
                            className="text-[#1E3A8A] hover:underline font-medium"
                        >
                            Reset it here
                        </button>
                    </p>

                    {/* Sign Up */}
                    <p>
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onShowSignup?.();
                            }}
                            className="text-[#1E3A8A] hover:underline font-medium"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>

                {/* Message */}
                {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default LoginPopup;
