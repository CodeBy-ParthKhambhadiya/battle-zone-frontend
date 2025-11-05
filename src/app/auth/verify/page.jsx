"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";

export default function VerifyPage() {
  const router = useRouter();
  const { user, verifyOtp, reSendOtp } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputsRef = useRef([]);

  // 🎨 Theme colors
  const bgColor = "#0D1117";
  const textColor = "#00E5FF";
  const secondaryText = "#9CA3AF"; // subtle gray for secondary info

  // 🚨 Redirect safety
  if (!user?.email) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4" style={{ backgroundColor: bgColor }}>
        <p className="text-red-400 text-center">User email not found. Please sign up first.</p>
      </div>
    );
  }

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    try {
      const result = await verifyOtp({
        email: user.email,
        otp: code,
        role: user.role || "PLAYER",
      });

      if (result.meta?.requestStatus === "fulfilled") {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const result = await reSendOtp({
        email: user.email,
        role: user.role || "PLAYER",
      });
      if (result.meta?.requestStatus === "fulfilled") {
        console.log("OTP resent successfully");
      }
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[100vh] px-4 transition-all duration-500"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl transition-all duration-500 border border-[#00E5FF33]"
        style={{
          backgroundColor: "#0B0F14",
          boxShadow: `0 0 25px ${textColor}22`,
        }}
      >
        <h1
          className="text-2xl sm:text-3xl font-bold mb-4 text-center"
          style={{ color: textColor }}
        >
          Verify Your Account
        </h1>

        <p
          className="mb-6 text-center text-sm sm:text-base"
          style={{ color: secondaryText }}
        >
          We’ve sent a 6-digit code to{" "}
          <span className="font-semibold break-all" style={{ color: textColor }}>
            {user.email}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 🔢 OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-md border focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  backgroundColor: "#161B22",
                  color: textColor,
                  borderColor: "#00E5FF33",
                  boxShadow: "0 0 5px transparent",
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow = `0 0 8px ${textColor}`)
                }
                onBlur={(e) => (e.target.style.boxShadow = "0 0 5px transparent")}
              />
            ))}
          </div>

          {/* ✅ Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-3.5 rounded-full font-medium text-base sm:text-lg flex justify-center items-center transition-all duration-200"
            style={{
              color: bgColor,
              backgroundColor: textColor,
              boxShadow: `0 0 15px ${textColor}66`,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : (
              "Verify"
            )}
          </button>
        </form>

        {/* 🔁 Resend OTP */}
        <div className="mt-6 text-center">
          <p
            className="text-sm font-semibold"
            style={{ color: secondaryText }}
          >
            Didn’t receive a code?{" "}
            <button
              type="button"
              disabled={resendLoading}
              onClick={handleResend}
              className="font-bold ml-1 hover:underline transition-all duration-200"
              style={{ color: textColor }}
            >
              {resendLoading ? (
                <LoaderIcon className="w-4 h-4 animate-spin inline" />
              ) : (
                "Resend Code"
              )}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
