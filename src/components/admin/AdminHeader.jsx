"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiDocumentText, HiOutlineFlag, HiShieldCheck, HiBell } from "react-icons/hi";
import useAuth from "@/hooks/useAuth";

const PlayerHeader = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const [colors] = useState({
    bgColor: "#0D1117",
    textColor: "#00E5FF",
  });

  const links = [
    // { href: "/player/terms-and-conditions", label: "Terms", icon: HiDocumentText },
    // { href: "/player/tournament-rules", label: "Rules", icon: HiOutlineFlag },
    { href: "/player/trust-safety", label: "Trust", icon: HiShieldCheck },
  ];

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <header
      className="p-4 flex flex-row flex-wrap justify-between items-center gap-3"
      style={{
        backgroundColor: colors.bgColor,
        color: colors.textColor,
        boxShadow: "0 0 15px rgba(0, 229, 255, 0.2)",
      }}
    >
      {/* Left Side: Welcome Message */}
        <div className="flex-1 min-w-[180px] text-left">
        <h1 className="text-3xl font-extrabold uppercase"
          style={{
            color: "#AFFFFF",
            textShadow: "0 0 15px #00FFFF, 0 0 25px #00E5FF, 0 0 40px #0055FF",
          }}>
          Battle Zone
        </h1>

      </div>


      {/* Right Side: Navigation + Notification */}
      <nav
        className="flex items-center justify-end gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar flex-wrap"
        style={{ scrollBehavior: "smooth" }}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm sm:text-xs md:text-sm lg:text-base transition-all duration-300 flex-shrink-0"
              style={{
                color: colors.textColor,
                border: isActive ? `1px solid ${colors.textColor}` : "1px solid transparent",
                boxShadow: isActive ? `0 0 8px ${colors.textColor}` : "none",
                backgroundColor: isActive ? "rgba(0,229,255,0.1)" : "transparent",
              }}
            >
              <Icon
                className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                style={{
                  color: colors.textColor,
                  filter: isActive ? `drop-shadow(0 0 4px ${colors.textColor})` : "none",
                }}
              />
              <span
                className="hidden sm:inline"
                style={{
                  textShadow: isActive ? `0 0 6px ${colors.textColor}` : "none",
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}

        {/* Notification Bell */}
        <button
          className="ml-2 flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full transition-all duration-300 flex-shrink-0"
          style={{
            color: colors.textColor,
            border: `1px solid ${colors.textColor}55`,
            backgroundColor: "rgba(0, 229, 255, 0.05)",
            boxShadow: `0 0 6px ${colors.textColor}33`,
          }}
          onClick={() => alert("Notifications clicked!")}
        >
          <HiBell
            className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
            style={{
              filter: `drop-shadow(0 0 4px ${colors.textColor})`,
            }}
          />
        </button>
      </nav>
    </header>
  );
};

export default PlayerHeader;
