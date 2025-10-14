// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Get token and role from cookies
  const token = req.cookies.get("token"); // JWT or session token
  const role = req.cookies.get("role");   // "PLAYER" or "ORGANIZER"

  // Redirect logged-in users away from auth pages
  if ((url.pathname === "/auth/login" || url.pathname === "/auth/signup") && token) {
    if (role === "ORGANIZER") {
      return NextResponse.redirect(new URL("/organizer/dashboard", req.url));
    } else if (role === "PLAYER") {
      return NextResponse.redirect(new URL("/player/home", req.url));
    }
  }

  // Protect organizer routes
  if (url.pathname.startsWith("/organizer") && role !== "ORGANIZER") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect player routes
  if (url.pathname.startsWith("/player") && role !== "PLAYER") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Allow all other requests
  return NextResponse.next();
}

// Apply middleware to these paths
export const config = {
  matcher: [
    "/auth/login",
    "/auth/signup",
    "/organizer/:path*",
    "/player/:path*"
  ],
};
