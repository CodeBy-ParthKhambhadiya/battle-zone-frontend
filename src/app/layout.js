"use client";

import "./globals.css";
import Header from "@/components/Header";
import { Nunito } from "next/font/google";
import { Provider } from "react-redux";
import store from "@/store";
import { Toaster } from "react-hot-toast"; // ✅ import Toaster

// Load the Nunito font
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunito.className} bg-[var(--background)] text-[var(--text-primary)]`}
    >
      <body className="min-h-screen flex flex-col">
        <Provider store={store}>
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="flex-grow w-full px-6 py-10">{children}</main>

          {/* Toast notifications */}
          <Toaster position="top-right" reverseOrder={false} />
        </Provider>
      </body>
    </html>
  );
}
