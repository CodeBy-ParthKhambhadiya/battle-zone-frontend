"use client";

import { useState, useRef, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("PLAYER");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const { forgotPassword, loading } = useAuth();

    const roles = ["PLAYER", "ORGANIZER"];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return; // optionally show toast
        await forgotPassword({ email, role });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ backgroundColor: "var(--surface)" }}>
                <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">Forgot Password</h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />

                    {/* Role Dropdown */}
                    <div className="relative w-full" ref={dropdownRef}>
                        <button
                            type="button"
                            className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] flex justify-between items-center"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {role} <span className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
                        </button>

                        <ul
                            className={`absolute w-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
                            style={{ transformOrigin: "top" }}
                        >
                            {roles.map((r) => (
                                <li
                                    key={r}
                                    className="p-3 hover:bg-[var(--accent-primary)] hover:text-[var(--signup-text)] cursor-pointer transition-colors duration-200"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-full font-medium text-[var(--signup-text)] transition-all duration-200 flex justify-center items-center ${loading ? "cursor-not-allowed opacity-70" : "hover:opacity-90"
                            }`}
                        style={{ backgroundColor: "var(--signup-bg)" }}
                    >
                        {loading ? <LoaderIcon className="animate-spin" /> : "Send Reset Link"}
                    </button>

                </form>

                <p className="mt-4 text-[var(--text-secondary)] text-sm text-center font-semibold">
                    Remembered your password? <a href="/auth/login" className="text-[var(--accent-primary)] hover:underline font-bold">Login</a>
                </p>
                <p className="mt-2 text-[var(--text-secondary)] text-sm text-center font-semibold">
                    Don't have an account? <a href="/auth/signup" className="text-[var(--accent-primary)] hover:underline font-bold">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
