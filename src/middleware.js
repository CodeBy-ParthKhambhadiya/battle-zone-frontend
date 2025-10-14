// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value; // JWT or session token
  const role = req.cookies.get("role")?.value;   // "PLAYER" or "ORGANIZER"

  console.log("🚀 ~ middleware ~ token:", token, "role:", role);

  // If token exists, redirect based on role
  if (token && role) {
    if (role === "PLAYER") {
      url.pathname = "/player/home"; // redirect players to their dashboard
    } else if (role === "ORGANIZER") {
      url.pathname = "/organizer/dashboard"; // redirect organizers to their dashboard
    }
    return NextResponse.redirect(url);
  }

  // If no token, allow the request to proceed
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
