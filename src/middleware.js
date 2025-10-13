// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Example: get the user token from cookies
  const token = req.cookies.get("token"); // store JWT on login
  const role = req.cookies.get("role"); // store role on login

  // If user is logged in, redirect from login/signup pages
  if ((url.pathname === "/login" || url.pathname === "/signup") && token) {
    if (role === "ORGANIZER") {
      return NextResponse.redirect(new URL("/organizer/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/player/home", req.url));
    }
  }

  // Protect organizer pages
  if (url.pathname.startsWith("/organizer") && role !== "ORGANIZER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect player pages
  if (url.pathname.startsWith("/player") && role !== "PLAYER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow all other requests
  return NextResponse.next();
}

// Apply middleware to these paths
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/organizer/:path*",
    "/player/:path*"
  ],
};
