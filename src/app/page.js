"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer"; // ✅ import the new footer
import Link from "next/link";

export default function HomePage() {
  const bgColor = "#0D1117";   // Dark background
  const textColor = "#00E5FF"; // Glowing cyan text

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 min-h-[70vh]">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 animate-gradient bg-[length:200%_200%]">
            BattleZone
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          Compete with players worldwide. Organize tournaments. Track your stats.
          All in one epic platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-row flex-wrap justify-center gap-4">
          <Link href="/auth/login">
            <button className="px-6 py-3 rounded-full font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-all duration-300 shadow-lg shadow-cyan-500/30">
              Log In
            </button>
          </Link>

          <Link href="/auth/signup">
            <button className="px-6 py-3 rounded-full font-semibold border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-lg shadow-cyan-500/20">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* ✅ Beautiful new footer */}
      <Footer />
    </div>
  );
}
