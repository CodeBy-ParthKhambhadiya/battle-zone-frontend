
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Trophy, Users, MessageSquareText, User } from "lucide-react";

export default function OrganizerIcons() {
  const router = useRouter();
  const pathname = usePathname();
  const [avatar, setAvatar] = useState(null);

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
    { name: "Dashboard", icon: LayoutDashboard, path: "/organizer/dashboard" },
    { name: "Tournaments", icon: Trophy, path: "/organizer/manage-tournament" },
    { name: "Players", icon: Users, path: "/organizer/manage-players" },
    { name: "Chat", icon: MessageSquareText, path: "/organizer/chat" },
    { name: "Profile", icon: User, path: "/organizer/profile" },
  ];
  return (
    <footer
      className="w-full shadow-t py-3 md:py-4"
      style={{
        backgroundColor: bgColor,
        boxShadow: `0 0 15px rgba(0, 229, 255, 0.2)`,
        borderTop: `1px solid ${textColor}55`,
        borderBottom: `1px solid ${textColor}`,
      }}
    >
      <div className="flex justify-center space-x-6 pb-1">
        {tabs.map((tab) => {
          // ✅ This logic ensures Profile stays active for all its subpages
          const isActive =
            tab.name === "Profile"
              ? pathname.startsWith("/organizer/profile")
              : pathname === tab.path;

          const Icon = tab.icon;

          if (tab.name === "Profile") {
            return (
              <button
                key={tab.name}
                onClick={() => router.push(tab.path)}
                className="p-1 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center relative"
                style={{
                  backgroundColor: bgColor,
                  border: isActive ? `1px solid ${textColor}` : "1px solid transparent",
                  boxShadow: isActive ? `0 0 12px ${textColor}` : "none",
                }}
              >
                <div
                  className="rounded-full overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: isActive
                      ? `0 0 20px ${textColor}, 0 0 8px ${textColor} inset`
                      : "none",
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User
                      className="w-10 h-10 transition-all duration-200"
                      style={{
                        color: textColor,
                        filter: `drop-shadow(0 0 5px ${textColor})`,
                      }}
                    />
                  )}
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className="p-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: bgColor,
                border: isActive ? `1px solid ${textColor}` : "1px solid transparent",
                boxShadow: isActive ? `0 0 10px ${textColor}` : "none",
              }}
            >
              <Icon
                className="w-8 h-8 transition-all duration-200"
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

