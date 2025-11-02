"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HiDocumentText,
  HiOutlineFlag,
  HiShieldCheck,
  HiBell,
  HiCurrencyRupee,
} from "react-icons/hi";
import useAuth from "@/hooks/useAuth";

const PlayerHeader = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const [colors] = useState({
    bgColor: "#0D1117",
    textColor: "#00E5FF",
  });

  const links = [
    // Uncomment if needed later:
    // { href: "/player/terms-and-conditions", label: "Terms", icon: HiDocumentText },
    // { href: "/player/tournament-rules", label: "Rules", icon: HiOutlineFlag },
    { href: "/player/trust-safety", label: "Trust", icon: HiShieldCheck },
  ];

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const walletBalance =
    typeof user?.walletBalance === "number" ? user.walletBalance : "0.00";

  return (
    <header
      className="p-3 flex flex-wrap justify-between items-center gap-3"
      style={{
        backgroundColor: colors.bgColor,
        color: colors.textColor,
        boxShadow: "0 0 15px rgba(0, 229, 255, 0.2)",
      }}
    >
      {/* Left Side: Title */}
      <div className="flex-1 min-w-[160px] text-left">
        <h1
          className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide"
          style={{
            color: "#AFFFFF",
            textShadow:
              "0 0 15px #00FFFF, 0 0 25px #00E5FF, 0 0 40px #0055FF",
          }}
        >
          Battle Zone
        </h1>
      </div>

      {/* Right Side: Wallet + Bell */}
      <div className="flex items-center gap-3 flex-wrap justify-end">
        {/* Wallet */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300"
          style={{
            border: `1px solid ${colors.textColor}`,
            color: colors.textColor,
            backgroundColor: "rgba(0,229,255,0.1)",
            boxShadow: `0 0 10px ${colors.textColor}66`,
          }}
        >
          <HiCurrencyRupee
            className="w-5 h-5 sm:w-6 sm:h-6"
            style={{
              color: colors.textColor,
              filter: `drop-shadow(0 0 6px ${colors.textColor})`,
            }}
          />
          <span className="font-bold">{walletBalance}</span>
        </div>

        {/* Notification */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-105"
          style={{
            color: colors.textColor,
            border: `1px solid ${colors.textColor}55`,
            backgroundColor: "rgba(0, 229, 255, 0.05)",
            boxShadow: `0 0 8px ${colors.textColor}33`,
          }}
          onClick={() => alert("Notifications clicked!")}
        >
          <HiBell
            className="w-6 h-6"
            style={{
              filter: `drop-shadow(0 0 4px ${colors.textColor})`,
            }}
          />
        </button>
      </div>
    </header>
  );

};

export default PlayerHeader;
