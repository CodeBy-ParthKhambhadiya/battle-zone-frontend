"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ✅ Allow all routes that start with /auth (public routes)
    if (pathname.startsWith("/auth")) {
      return; // Skip all checks for auth pages
    }

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Parse user safely
    let user = null;
    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
    }

    console.log("🚀 ~ AuthGuard ~ user:", user);

    // 🚫 If no token or user → redirect to login
    if (!token || !user || !user.role) {
      router.replace("/auth/login");
      return;
    }

    const role = user.role;

    // ✅ Role-based route access
    if (role === "ORGANIZER") {
      if (!pathname.startsWith("/organizer")) {
        router.replace("/organizer/dashboard");
        return;
      }
    } else if (role === "PLAYER") {
      if (!pathname.startsWith("/player")) {
        router.replace("/player/home");
        return;
      }
    } else {
      // 🚫 Unknown role → force logout
      localStorage.clear();
      router.replace("/auth/login");
      return;
    }

  }, [router, pathname]);

  return children || null;
}
