// src/components/AuthGuard.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth"; // make sure you import your auth hook

export default function AuthGuard() {
  const router = useRouter();
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Fetch user if not already loaded
      if (!user || (Array.isArray(user) && user.length === 0)) {
        await fetchUser();
      }

      // Redirect based on role
      if (role === "PLAYER") router.push("/player/home");
      else if (role === "ORGANIZER") router.push("/organizer/dashboard");
    };

    checkAuth();
  }, [user, fetchUser, router]);

  return null;
}
