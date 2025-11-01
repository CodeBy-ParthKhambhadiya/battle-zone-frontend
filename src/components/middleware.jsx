"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token exists but user not fetched yet → fetch it
    if (token && (!user || Object.keys(user).length === 0)) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    // Allow access to auth pages
    if (pathname.startsWith("/auth")) return;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    let parsedUser = null;
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
    }

    // 🚫 No token → login
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // ✅ Fetch user if not loaded yet (after login)
    if (!parsedUser && token) {
      fetchUser();
      return;
    }

    const role = parsedUser?.role;

    // Role-based redirects
    if (role === "ORGANIZER" && !pathname.startsWith("/organizer")) {
      router.replace("/organizer/dashboard");
      return;
    }

    if (role === "PLAYER" && !pathname.startsWith("/player")) {
      router.replace("/player/home");
      return;
    }

    // 🚫 Invalid or missing role
    if (!role) {
      localStorage.clear();
      router.replace("/auth/login");
      return;
    }

  }, [pathname]);

  return children || null;
}
