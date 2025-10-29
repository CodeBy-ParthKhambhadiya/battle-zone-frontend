"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUser } = useAuth();
useEffect(() => {
  if (!user || Object.keys(user).length === 0) {
    fetchUser();
  }
}, []);
  useEffect(() => {

    // Allow all /auth routes (login, signup, forgot-password)
    if (pathname.startsWith("/auth")) return;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Parse user safely
    let parsedUser = null;
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
    }

    // 🚫 If no token, redirect to login
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // ✅ Fetch user if not already loaded
    if (!parsedUser && token) {
      return;
    }

    // ✅ Role-based route access
    const role = parsedUser?.role;

    if (role === "ORGANIZER" && !pathname.startsWith("/organizer")) {
      router.replace("/organizer/dashboard");
      return;
    }

    if (role === "PLAYER" && !pathname.startsWith("/player")) {
      router.replace("/player/home");
      return;
    }

    // 🚫 Unknown role → logout
    if (!role) {
      localStorage.clear();
      router.replace("/auth/login");
      return;
    }

  }, [pathname]);

  return children || null;
}
