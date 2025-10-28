"use client";

import { useState, useRef, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const { bgColor, textColor } = useTheme() || {};
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("PLAYER");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const { forgotPassword, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

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
    if (!email || !mobile || !newPassword) {
      alert("Please fill all fields");
      return;
    }
    await forgotPassword({ email, mobile, role, newPassword });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div
        className="w-full max-w-md p-8 rounded-lg shadow-lg transition-all duration-500"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

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

          {/* Mobile */}
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200"
            style={{
              borderColor: textColor,
              color: textColor,
              caretColor: textColor,
              backgroundColor: "transparent",
            }}
          />

          {/* New Password */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all duration-200 pr-10"
              style={{
                borderColor: textColor,
                color: textColor,
                caretColor: textColor,
                backgroundColor: "transparent",
              }}
            />

            {/* 👁️ Toggle icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: textColor }}
            >
              {showPassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          </div>
          {/* Role Dropdown */}
          <div className="relative w-full" ref={dropdownRef}>
            <button
              type="button"
              className="w-full p-3 rounded-md border text-left flex justify-between items-center focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                borderColor: textColor,
                color: textColor,
                backgroundColor: "transparent",
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
              className={`absolute w-full mt-1 rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top`}
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${textColor}`,
                transform: dropdownOpen ? "scaleY(1)" : "scaleY(0)",
                opacity: dropdownOpen ? 1 : 0,
                transformOrigin: "top",
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-medium transition-all duration-200 flex justify-center items-center"
            style={{
              backgroundColor: textColor,
              color: bgColor,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? <LoaderIcon className="animate-spin" /> : "Update Password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center font-semibold">
          Remembered your password?{" "}
          <Link href="/auth/login" className="font-bold hover:underline" style={{ color: textColor }}>
            Login
          </Link>
        </p>

        <p className="mt-2 text-sm text-center font-semibold">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="font-bold hover:underline" style={{ color: textColor }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
