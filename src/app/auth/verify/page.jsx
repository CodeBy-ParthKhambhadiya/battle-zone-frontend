"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";

export default function VerifyPage() {
  const router = useRouter();
  const { user, verifyOtp, reSendOtp } = useAuth(); // include resendOtp from your hook
  console.log("🚀 ~ VerifyPage ~ user:", user)
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  if (!user?.email) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-red-500">User email not found. Please sign up first.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const result = await verifyOtp({ email: user.email, otp: code });
      if (result.meta?.requestStatus === "fulfilled") {
        router.push("/auth/login");
      } 
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
        const email = user.email;
      const result = await reSendOtp(email);
      if (result.meta?.requestStatus === "fulfilled") {
      } 
    } catch (err) {
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-[var(--background)]">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ backgroundColor: "var(--surface)" }}>
        <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)] text-center">
          Verify Your Account
        </h1>

        <p className="mb-4 text-center text-[var(--text-secondary)]">
          OTP sent to: <span className="font-semibold text-[var(--text-primary)]">{user.email}</span>
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />

         <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-full text-[var(--signup-text)] font-medium transition-all duration-200 flex justify-center items-center
              ${loading ? "cursor-not-allowed opacity-70" : "hover:brightness-90"}`}
  style={{ backgroundColor: "var(--signup-bg)" }}
>
  {loading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : "Verify"}
</button>

        </form>

        <div className="mt-4 text-center">
          <p className="text-[var(--text-secondary)] text-sm font-semibold">
            Didn't receive a code?{" "}
            <button
              type="button"
              disabled={resendLoading}
              className="text-[var(--accent-primary)] hover:underline font-bold"
              onClick={handleResend}
            >
             {loading ? <LoaderIcon />  : "Resend Code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
