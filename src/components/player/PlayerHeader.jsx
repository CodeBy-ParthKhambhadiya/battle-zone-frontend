"use client";

import { useState } from "react";
import { HiShieldCheck, HiCurrencyRupee } from "react-icons/hi";
import useAuth from "@/hooks/useAuth";
import useNotifications from "@/hooks/useNotifications";
import NotificationBell from "@/components/NotificationBell";
import Link from "next/link";

const PlayerHeader = () => {
  const { user } = useAuth();
  const { unreadCount, setUnreadCount, markAllAsRead } = useNotifications(user?._id);
  const [colors] = useState({
    bgColor: "#0D1117",
    textColor: "#00E5FF",
  });

  const handleBellClick = async () => {
    await markAllAsRead();
    setUnreadCount(0);

  };

  const walletBalance =
    typeof user?.walletBalance === "number" ? user.walletBalance : "0.00";

  return (
    <header
      className="p-3 flex flex-wrap justify-between items-center"
      style={{
        backgroundColor: colors.bgColor,
        color: colors.textColor,
        boxShadow: "0 0 15px rgba(0, 229, 255, 0.2)",
      }}
    >
      <div className=" text-left">
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

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Link
          href="/player/profile/account"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#00E5FF66]"
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
        </Link>


        {/* 🔔 Notification */}
        <div className="relative" onClick={handleBellClick}>
          <NotificationBell unreadCount={unreadCount} />
        </div>
      </div>
    </header>
  );
};

export default PlayerHeader;
