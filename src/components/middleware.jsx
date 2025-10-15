// src/components/AuthGuard.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/auth/login"); // redirect if not logged in
    } else {
      // redirect based on role
      if (role === "PLAYER") router.push("/player/home");
      else if (role === "ORGANIZER") router.push("/organizer/dashboard");
    }
  }, []);

  return null; // nothing is rendered
}
