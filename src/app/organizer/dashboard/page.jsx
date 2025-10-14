"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function OrganizerDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 bg-[var(--surface)] shadow-lg ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 font-bold text-xl text-[var(--text-primary)] border-b border-[var(--border)]">
            {sidebarOpen ? "Organizer" : "O"}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-2 space-y-2 text-[var(--text-primary)]">
            <Link
              href="/organizer/dashboard"
              className="block p-3 rounded-md hover:bg-[var(--accent-primary)] hover:text-[var(--signup-text)] transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/organizer/events"
              className="block p-3 rounded-md hover:bg-[var(--accent-primary)] hover:text-[var(--signup-text)] transition-colors duration-200"
            >
              My Events
            </Link>
            <Link
              href="/organizer/settings"
              className="block p-3 rounded-md hover:bg-[var(--accent-primary)] hover:text-[var(--signup-text)] transition-colors duration-200"
            >
              Settings
            </Link>
          </nav>

          {/* Toggle Sidebar Button */}
          <button
            className="p-3 m-2 rounded-md bg-[var(--accent-primary)] text-[var(--signup-text)] font-bold transition-all duration-200 hover:bg-[var(--signup-bg)]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Welcome, Organizer!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg shadow-md bg-[var(--surface)] text-[var(--text-primary)]">
            <h2 className="font-bold text-xl mb-2">Upcoming Events</h2>
            <p className="text-[var(--text-secondary)]">
              You have 5 upcoming events. Manage them quickly.
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-[var(--surface)] text-[var(--text-primary)]">
            <h2 className="font-bold text-xl mb-2">Registrations</h2>
            <p className="text-[var(--text-secondary)]">
              120 participants have registered this month.
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-md bg-[var(--surface)] text-[var(--text-primary)]">
            <h2 className="font-bold text-xl mb-2">Notifications</h2>
            <p className="text-[var(--text-secondary)]">
              3 new messages from participants or admins.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
