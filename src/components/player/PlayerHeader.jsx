"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiDocumentText, HiOutlineFlag, HiShieldCheck } from "react-icons/hi";

const PlayerHeader = () => {
  const pathname = usePathname();

  // Global color theme
  const [colors, setColors] = useState({
    bgColor: "#0D1117",   // dark background
    textColor: "#00E5FF", // glowing cyan text
  });

  const links = [
    { href: "/player/terms-and-conditions", label: "Terms", icon: HiDocumentText },
    { href: "/player/tournament-rules", label: "Rules", icon: HiOutlineFlag },
    { href: "/player/trust-safety", label: "Trust", icon: HiShieldCheck },
  ];

  return (
    <header
      className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0"
      style={{
        backgroundColor: colors.bgColor,
        color: colors.textColor,
        boxShadow: `0 0 15px rgba(0, 229, 255, 0.2)`,
      }}
    >
      {/* Header Title */}
      <h1
        className="text-2xl font-bold text-center md:text-left"
        style={{
          color: colors.textColor,
          textShadow: `0 0 8px ${colors.textColor}`,
        }}
      >
        BattleZone Player
      </h1>

      {/* Navigation */}
      <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm md:text-base transition-all duration-300`}
              style={{
                color: colors.textColor,
                border: isActive ? `1.5px solid ${colors.textColor}` : "1.5px solid transparent",
                boxShadow: isActive ? `0 0 10px ${colors.textColor}` : "none",
                backgroundColor: isActive
                  ? "rgba(0, 229, 255, 0.1)"
                  : "transparent",
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: colors.textColor,
                  filter: isActive ? `drop-shadow(0 0 5px ${colors.textColor})` : "none",
                }}
              />
              <span
                style={{
                  textShadow: isActive ? `0 0 6px ${colors.textColor}` : "none",
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default PlayerHeader;
