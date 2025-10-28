"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext"; // 🩵 Import ThemeContext hook
import { Eye, EyeOff, ChevronDown } from "lucide-react"; // 👁️ Import icons

export default function LoginPage() {
    const { bgColor, textColor } = useTheme() || {}; // ✅ Colors from context
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("PLAYER");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👁️ Control visibility

    const dropdownRef = useRef();
    const roles = ["PLAYER", "ORGANIZER"];
    const { login, loading } = useAuth();
    const router = useRouter();

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Debug: see what colors are coming in
    useEffect(() => {
        console.log("🚀 ~ LoginPage ~ colors:", { bgColor, textColor });
    }, [bgColor, textColor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login({ email, password, role });
            if (result.meta?.requestStatus === "fulfilled") {
                const userRole = result.payload?.role;
                if (userRole === "PLAYER") router.push("/player/home");
                else if (userRole === "ORGANIZER") router.push("/organizer/dashboard");
                else if (userRole === "ADMIN") router.push("/admin/dashboard");
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
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
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

                        {/* 👁️ Eye icon toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-all"
                        >
                            {showPassword ? (
                                <Eye
                                    size={20}
                                    style={{ color: textColor || "#000" }}
                                />
                            ) : (
                                <EyeOff
                                    size={20}
                                    style={{ color: textColor || "#000" }}
                                />
                            )}
                        </button>
                    </div>


                    {/* Role Dropdown */}
                    <div className="relative w-full" ref={dropdownRef}>
                        <button
                            type="button"
                            className="w-full p-3 rounded-md border text-left focus:outline-none focus:ring-2 flex justify-between items-center cursor-pointer transition-all duration-200"
                            style={{
                                borderColor: textColor,
                                color: textColor,
                            }}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {role}
                            <span
                                className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
                                    }`}
                            >
                                <ChevronDown size={20} style={{ color: textColor || "#000" }} />
                            </span>
                        </button>

                        <ul
                            className={`absolute w-full mt-1 rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                                }`}
                            style={{
                                backgroundColor: bgColor,
                                border: `1px solid ${textColor}`,
                            }}
                        >
                            {roles.map((r) => (
                                <li
                                    key={r}
                                    className="p-3 cursor-pointer transition-all duration-200"
                                    style={{
                                        color: textColor,
                                        border: `1px solid transparent`, // start with transparent border
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.border = `1px solid ${textColor}`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.border = `1px solid transparent`;
                                    }}
                                    onClick={() => {
                                        setRole(r);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {r}
                                </li>
                            ))}

                        </ul>
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
                        {loading ? <Loader className="animate-spin w-5 h-5 bgColor" /> : "Login"}
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

                    <p className="mt-2">
                        Don’t have an account?{" "}
                        <Link
                            href="/auth/signup"
                            className="font-bold hover:underline"
                            style={{ color: textColor }}
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
