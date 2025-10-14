"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ import useRouter for client-side redirect
import useAuth from "@/hooks/useAuth";
import { Loader } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("PLAYER");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const roles = ["PLAYER", "ORGANIZER"];

    const { login, loading, user } = useAuth();
    const router = useRouter(); // ✅ use router for client-side navigation

    // Close dropdown when clicking outside
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

        try {
            const result = await login({ email, password, role });

            if (result.meta?.requestStatus === "fulfilled") {
                const userRole = result.payload?.role;

                // ✅ Client-side redirect based on role
                if (userRole === "PLAYER") {
                    router.push("/player/home");
                } else if (userRole === "ORGANIZER") {
                    router.push("/organizer/dashboard");
                } else if (userRole === "ADMIN") {
                    router.push("/admin/dashboard"); // optional
                }

                // Toast.success("Login successful!");
            } else if (result.meta?.requestStatus === "rejected") {
                // Toast.error(result.payload || "Login failed. Check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            Toast.error("Something went wrong during login.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div
                className="w-full max-w-md p-8 rounded-lg shadow-lg"
                style={{ backgroundColor: "var(--surface)" }}
            >
                <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">
                    Login
                </h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />

                    {/* Role Dropdown */}
                    <div className="relative w-full" ref={dropdownRef}>
                        <button
                            type="button"
                            className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all duration-200 flex justify-between items-center cursor-pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {role}
                            <span className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
                        </button>

                        <ul
                            className={`absolute w-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
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
                        className="w-full py-3 rounded-full text-[var(--signup-text)] font-medium transition-all duration-200 flex justify-center items-center cursor-pointer"
                        style={{ backgroundColor: "var(--signup-bg)" }}
                    >
                        {loading ? <Loader className="animate-spin w-5 h-5" /> : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-[var(--text-secondary)] text-sm text-center font-semibold">
                    Forgot your password?{" "}
                    <a
                        href="/auth/forgot-password"
                        className="text-[var(--accent-primary)] hover:underline font-bold"
                    >
                        Reset it here
                    </a>
                </p>

                <p className="mt-2 text-[var(--text-secondary)] text-sm text-center font-semibold">
                    Don't have an account?{" "}
                    <a
                        href="/auth/signup"
                        className="text-[var(--accent-primary)] hover:underline font-bold"
                    >
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
