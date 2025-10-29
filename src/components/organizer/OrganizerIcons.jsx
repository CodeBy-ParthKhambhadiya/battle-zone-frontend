"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Trophy, Users, MessageSquareText, User } from "lucide-react";

export default function OrganizerIcons() {
  const router = useRouter();
  const pathname = usePathname();
  const [avatar, setAvatar] = useState(null);

  // Custom color theme
  const bgColor = "#0D1117";   // dark background
  const textColor = "#00E5FF"; // glowing cyan

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
    { name: "Dashboard", icon: LayoutDashboard, path: "/organizer/dashboard" },
    { name: "Tournaments", icon: Trophy, path: "/organizer/manage-tournament" },
    { name: "Players", icon: Users, path: "/organizer/manage-players" },
    { name: "Chat", icon: MessageSquareText, path: "/organizer/chat" },
    { name: "Profile", icon: User, path: "/organizer/profile" },
  ];

  return (
    <footer
      className="w-full shadow-t py-3 md:py-4  left-0"
      style={{
        backgroundColor: bgColor,
        boxShadow: `0 -2px 15px rgba(0, 229, 255, 0.15)`, // top cyan glow
        zIndex: 50,
      }}
    >
      <div className="flex justify-center items-center space-x-6 md:space-x-10">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          if (tab.name === "Profile") {
            // Profile Avatar Button
            return (
              <button
                key={tab.name}
                onClick={() => router.push(tab.path)}
                className="p-1 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center"
                style={{
                  backgroundColor: bgColor,
                  boxShadow: isActive ? `0 0 10px ${textColor}` : "none",
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Organizer Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                    style={{
                      border: isActive ? `2px solid ${textColor}` : "2px solid transparent",
                      boxShadow: isActive ? `0 0 8px ${textColor}` : "none",
                    }}
                  />
                ) : (
                  <User
                    className="w-10 h-10 transition-colors duration-200"
                    style={{
                      color: textColor,
                      filter: isActive ? `drop-shadow(0 0 5px ${textColor})` : "none",
                    }}
                  />
                )}
              </button>
            );
          }

          // Other icons
          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className="p-2 rounded-full transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: bgColor,
                boxShadow: isActive ? `0 0 10px ${textColor}` : "none",
              }}
            >
              <Icon
                className="w-8 h-8 transition-colors duration-200"
                style={{
                  color: textColor,
                  filter: isActive ? `drop-shadow(0 0 5px ${textColor})` : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
