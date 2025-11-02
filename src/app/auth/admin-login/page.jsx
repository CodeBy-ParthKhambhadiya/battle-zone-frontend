"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Loader, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext"; // 🩵 Theme colors

export default function AdminLoginPage() {
    const { bgColor, textColor } = useTheme() || {};
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login({ email, password, role: "ADMIN" });
            if (result.meta?.requestStatus === "fulfilled") {
                router.push("/admin/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 transition-all duration-500">
            <div
                className="w-full max-w-md p-8 rounded-lg shadow-lg transition-all duration-500"
                style={{
                    backgroundColor: bgColor || "#fff",
                    color: textColor || "#000",
                }}
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{
                            borderColor: textColor,
                            color: textColor,
                            caretColor: textColor,
                            backgroundColor: "transparent",
                        }}
                    />

                    {/* Password */}
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200 pr-10"
                            style={{
                                borderColor: textColor,
                                color: textColor,
                                caretColor: textColor,
                                backgroundColor: "transparent",
                            }}
                        />

                        {/* 👁️ Toggle visibility */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-all"
                        >
                            {showPassword ? (
                                <Eye size={20} style={{ color: textColor || "#000" }} />
                            ) : (
                                <EyeOff size={20} style={{ color: textColor || "#000" }} />
                            )}
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full font-medium transition-all duration-300 flex justify-center items-center cursor-pointer"
                        style={{
                            backgroundColor: textColor,
                            color: bgColor,
                            border: `2px solid ${textColor}`,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? <Loader className="animate-spin w-5 h-5" /> : "Login"}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-4 text-center text-sm font-semibold">
                    <p>
                        Forgot your password?{" "}
                        <Link
                            href="/auth/forgot-password"
                            className="font-bold hover:underline"
                            style={{ color: textColor }}
                        >
                            Reset it here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
