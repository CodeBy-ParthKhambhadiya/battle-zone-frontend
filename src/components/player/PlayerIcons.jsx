// src/components/player/PlayerIcons.jsx
"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  Swords,
  Home,
  Trophy,
  MessageSquareText,
  User
} from "lucide-react"
export default function PlayerIcons() {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    { name: "Home", icon: Home, path: "/player/home" },
    { name: "Tournaments", icon: Trophy, path: "/player/tournaments" },
    { name: "Joined", icon: Swords, path: "/player/joined" },
    { name: "Chat", icon: MessageSquareText, path: "/player/chat" },
    { name: "Profile", icon: User, path: "/player/profile" },
  ];

  return (
    <footer className="w-full shadow-t py-2 ">
      <div className="flex justify-center space-x-6 ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;

          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className={`
                p-2 rounded-full transition-colors duration-200 cursor-pointer
                ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-200 hover:text-blue-600"}
              `}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
