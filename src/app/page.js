"use client";

import Header from "@/components/Header";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 min-h-[70vh]">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-[var(--text-primary)]">
          Welcome to <span className="text-[var(--accent-primary)]">BattleZone</span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-8">
          Compete with players worldwide. Organize tournaments. Track your stats. All in one platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-green px-6 py-3 rounded-full font-semibold">
            Join the Battle
          </button>
          <button className="btn-indigo px-6 py-3 rounded-full font-semibold">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
