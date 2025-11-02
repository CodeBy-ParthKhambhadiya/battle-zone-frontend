"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUser } = useAuth();

  // 🧩 Fetch user if token exists but user not yet loaded
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && (!user || Object.keys(user).length === 0)) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    // Allow public & auth pages without restriction
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

    // 🚫 No token → redirect to home
    if (!token) {
      router.replace("/");
      return;
    }

    // ✅ Fetch user if token exists but user not yet loaded
    if (!parsedUser && token) {
      fetchUser();
      return;
    }

    const role = parsedUser?.role;

    // 🚫 Invalid or missing role
    if (!role) {
      localStorage.clear();
      router.replace("/");
      return;
    }

    // 🛡️ Role-based route guards
    if (role === "ADMIN" && !pathname.startsWith("/admin")) {
      router.replace("/admin/dashboard");
      return;
    }

    if (role === "ORGANIZER" && !pathname.startsWith("/organizer")) {
      router.replace("/organizer/dashboard");
      return;
    }

    if (role === "PLAYER" && !pathname.startsWith("/player")) {
      router.replace("/player/home");
      return;
    }
  }, [pathname]);

  return children || null;
}
