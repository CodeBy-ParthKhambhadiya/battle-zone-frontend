"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swords, Home, Trophy, MessageSquareText, User } from "lucide-react";

export default function PlayerIcons() {
  const router = useRouter();
  const pathname = usePathname();
  const [avatar, setAvatar] = useState(null);

  // Custom colors
  const bgColor = "#0D1117";   // dark card background
  const textColor = "#00E5FF"; // glowing cyan text

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
    <footer
        className="w-full shadow-t py-3 md:py-4"
          style={{
          backgroundColor: bgColor,
          boxShadow: `0 0 15px rgba(0, 229, 255, 0.2)`,
          borderTop: `1px solid ${textColor}55`,
          borderBottom: `1px solid ${textColor}`, // 💎 Added glowing bottom border
        }}
    >
      <div className="flex justify-center space-x-6 pb-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          if (tab.name === "Profile") {
            return (
              <button
                key={tab.name}
                onClick={() => router.push(tab.path)}
                className="p-1 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center"
                style={{ backgroundColor: bgColor }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User
                    className="w-10 h-10 transition-colors duration-200"
                    style={{ color: textColor }}
                  />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className="p-2 rounded-full transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: bgColor,
                boxShadow: isActive ? `0 0 8px ${textColor}` : "none",
              }}
            >
              <Icon
                className="w-8 h-8 transition-colors duration-200"
                style={{ color: textColor }}
              />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
