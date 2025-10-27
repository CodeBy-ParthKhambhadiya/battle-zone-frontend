"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, Swords } from "lucide-react";
import { Wallet } from 'lucide-react';

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: "update-user", label: "Profile", icon: User },
    { id: "game", label: "Game", icon: Swords },
    { id: "account", label: "Account", icon: Wallet },
  ];

  const currentTab = pathname.split("/").pop();

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-6 bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="flex md:flex-col md:w-64 mb-4 md:mb-0 bg-surface rounded-xl p-2 md:p-4 shadow-md">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => router.push(`/player/profile/${id}`)}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-4 py-2 md:mb-2 rounded-md transition-all duration-300 hover:scale-105 cursor-pointer ${
              currentTab === id
                ? "bg-accent-primary text-white shadow-md"
                : "hover:bg-black hover:text-accent-primary"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </aside>

      {/* Page content */}
      <main className="flex-1 space-y-6 ml-2">{children}</main>
    </div>
  );
}
