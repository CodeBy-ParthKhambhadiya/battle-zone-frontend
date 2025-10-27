"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Toast from "@/utils/toast";
import LoaderIcon from "@/components/LoadingButton";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        mobile: "",
        gender: "MALE",
        role: "PLAYER",
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const roles = ["PLAYER", "ORGANIZER"];

    const { createUser, loading, user } = useAuth();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGender = (g) => setForm((prev) => ({ ...prev, gender: g }));

    const handleRole = (r) => {
        setForm((prev) => ({ ...prev, role: r }));
        setDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.firstName || !form.lastName || !form.email || !form.password || !form.mobile) {
            return Toast.error("Please fill in all required fields");
        }

        try {
            const result = await createUser(form);
            if (result.meta?.requestStatus === "fulfilled") {
                // Toast.success("Account created! Check email for verification.");
                // router.push("/auth/verify");
                router.push("/auth/login");
            }
        } catch (err) {
            console.error(err);
            Toast.error("Something went wrong during registration");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-10 bg-[var(--background)]">
            <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ backgroundColor: "var(--surface)" }}>
                <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">Sign Up</h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            className="w-1/2 p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            className="w-1/2 p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />

                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={form.mobile}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />

                    {/* Gender Buttons */}
                    <div className="flex justify-between mt-4 gap-4 ">
                        {["MALE", "FEMALE"].map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => handleGender(g)}
                                className={`flex-1 py-3 rounded-lg text-[var(--text-primary)] font-semibold transition-all duration-300 relative overflow-hidden border border-[var(--border)] ${form.gender === g
                                    ? "bg-[var(--accent-primary)] text-[var(--signup-text)] shadow-lg cursor-pointer"
                                    : "bg-[var(--background)] hover:bg-[var(--accent-primary)/10] cursor-pointer"
                                    }`}
                            >
                                {g}
                                <span
                                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${form.gender === g ? "bg-[var(--accent-primary)/20]" : "bg-transparent"
                                        }`}
                                ></span>
                            </button>
                        ))}
                    </div>

                    {/* Role Dropdown */}
                    <div className="relative w-full" ref={dropdownRef}>
                        <button
                            type="button"
                            className="w-full p-3 cursor-pointer rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all duration-200 flex justify-between items-center"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {form.role}
                            <span className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>▼</span>
                        </button>

                        <ul
                            className={`absolute w-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                                }`}
                            style={{ transformOrigin: "top" }}
                        >
                            {roles.map((r) => (
                                <li
                                    key={r}
                                    className="p-3 hover:bg-[var(--accent-primary)] hover:text-[var(--signup-text)] cursor-pointer transition-colors duration-200"
                                    onClick={() => handleRole(r)}
                                >
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-full font-medium text-[var(--signup-text)] 
              transition-all duration-200 flex justify-center items-center 
              cursor-pointer ${loading ? "cursor-not-allowed opacity-70" : "hover:opacity-90"
                            }`}
                        style={{ backgroundColor: "var(--signup-bg)" }}
                    >
                        {loading ? <LoaderIcon className="animate-spin" /> : "Sign Up"}
                    </button>

                </form>

                <div className="mt-4 text-center">
                    <p className="text-[var(--text-secondary)] text-sm font-semibold">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-[var(--accent-primary)] hover:underline font-bold">
                            Login
                        </a>
                    </p>
                    <p className="text-[var(--text-secondary)] text-sm font-semibold mt-2">
                        Forgot your password?{" "}
                        <a href="/auth/forgot-password" className="text-[var(--accent-primary)] hover:underline font-bold">
                            Reset it
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
