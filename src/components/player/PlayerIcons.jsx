"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Swords, Home, Trophy, MessageSquareText, User } from "lucide-react";

export default function PlayerIcons() {
  const router = useRouter();
  const pathname = usePathname();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAvatar(parsedUser.avatar);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  const tabs = [
    { name: "Home", icon: Home, path: "/player/home" },
    { name: "Tournaments", icon: Trophy, path: "/player/tournaments" },
    { name: "Joined", icon: Swords, path: "/player/joined" },
    { name: "Chat", icon: MessageSquareText, path: "/player/chat" },
    { name: "Profile", icon: User, path: "/player/profile" },
  ];

  return (
    <footer className="w-full shadow-t pt-2 ">
      <div className="flex justify-center space-x-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;

          if (tab.name === "Profile") {
            // Special styling for Profile button
            return (
              <button
                key={tab.name}
                onClick={() => router.push(tab.path)}
                className="p-1 rounded-full transition-all duration-200 cursor-pointer
                  flex items-center justify-center
                 
                  "
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className={`w-10 h-10 rounded-full object-cover transition-all duration-200
                     `}
                  />
                ) : (
                  <User className={`w-10 h-10 text-gray-600 ${isActive ? "text-blue-600" : ""}`} />
                )}
              </button>
            );
          }

          // Default button for other tabs
          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className={`p-2 rounded-full transition-colors duration-200 cursor-pointer
                ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              <tab.icon
                className={`w-8 h-8 ${isActive ? "text-blue-600" : "text-gray-600"} transition-colors duration-200`}
              />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
