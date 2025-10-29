"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, Swords, Wallet } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { getRandomColor } from "@/components/getColor";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
const [colors, setColors] = useState({
  bgColor: "#0D1117",   // dark card background
  textColor: "#00E5FF", // glowing cyan text
});
  // useEffect(() => {
  //   // Generate and set colors when component mounts
  //   const generatedColors = getRandomColor();
  //   setColors(generatedColors);
  // }, []);

  const tabs = [
    { id: "update-user", label: "Profile", icon: User },
    { id: "game", label: "Game", icon: Swords },
    { id: "account", label: "Account", icon: Wallet },
  ];

  const currentTab = pathname.split("/").pop();

  // 🌀 Wait for colors to load before rendering UI
  if (!colors) {
      return null; // don't render until client-side ready

  }

  return (
    <ThemeContext.Provider value={colors}>
      <div
        className="flex flex-col md:flex-row p-4 md:p-6 transition-all duration-500"

      >
        {/* Sidebar */}
        <div
          className="flex md:flex-col md:w-64 mb-4 md:mb-0 bg-surface rounded-xl p-2 md:p-4 shadow-md"
          style={{
            backgroundColor: colors.bgColor,
            color: colors.textColor,
          }}
        >
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                onClick={() => router.push(`/player/profile/${id}`)}
                className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-4 py-2 md:mb-2 rounded-md font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: isActive ? colors.bgColor : "transparent", // 🌈 Use theme bg color on active
                  color: isActive ? colors.textColor : colors.textColor, // keep text color consistent or change if needed
                  border: isActive ? `2px solid ${colors.textColor}` : "2px solid transparent",
                  boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline">{label}</span>
              </button>

            );
          })}
        </div>

        {/* Page content */}
        <main
          className="flex-1 ml-0 md:ml-4 space-y-6 rounded-xl transition-all duration-500"
          style={{
            backgroundColor: colors.surfaceColor || "transparent",
          }}
        >
          {children}
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
