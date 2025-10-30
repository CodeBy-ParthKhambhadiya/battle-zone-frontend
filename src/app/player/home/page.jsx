"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LoaderIcon from "@/components/LoadingButton";

export default function OrganizerDashboard() {
  const [loaded, setLoaded] = useState(false);

  // 🎨 Neon Theme Colors
  const colors = {
    bgColor: "#0D1117",   // dark background
    textColor: "#00E5FF", // glowing cyan text
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold">
        <LoaderIcon size={15} colorClass="text-blue-600" />
      </div>
    );
  }

  const cards = [
    {
      href: "/organizer/manage-tournament",
      title: "Manage Tournaments",
      desc: "Create, edit, or delete tournaments you’ve organized.",
    },
    {
      href: "/organizer/manage-players",
      title: "Manage Players",
      desc: "View and organize registered players for your tournaments.",
    },
    {
      href: "/organizer/chat",
      title: "Chat",
      desc: "Connect with players or co-organizers in real-time conversations.",
    },
    {
      href: "/organizer/profile",
      title: "Profile",
      desc: "View and update your organizer information and settings.",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-6 md:p-10"
      style={{
        background: "radial-gradient(circle at center, #0D1117 60%, #05070a 100%)",
        color: colors.textColor,
      }}
    >
      {/* ✨ Header */}
      <h2
        style={{
          background: `linear-gradient(90deg, ${colors.textColor}33, transparent, ${colors.textColor}33)`,
          color: colors.textColor,
          textShadow: `0 0 10px ${colors.textColor}, 0 0 20px ${colors.textColor}66`,
          border: `1px solid ${colors.textColor}55`,
          padding: "0.75rem 1.5rem",
          borderRadius: "1rem",
          boxShadow: `0 0 15px ${colors.textColor}33`,
        }}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-8 text-center leading-tight tracking-wide transition-all duration-300"
      >
        Welcome to BattleZone Organizer!
      </h2>

      {/* 💠 Dashboard Cards */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-8 max-w-6xl">
        {cards.map((card) => (
          <Link href={card.href} key={card.title}>
            <div
              className="rounded-2xl p-8 min-w-[250px] max-w-sm flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: colors.bgColor,
                color: colors.textColor,
                border: `1px solid ${colors.textColor}55`,
                boxShadow: `0 0 15px rgba(0, 229, 255, 0.3)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 25px ${colors.textColor}`;
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 15px rgba(0, 229, 255, 0.3)`;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <h3
                className="text-2xl font-semibold mb-3"
                style={{
                  textShadow: `0 0 10px ${colors.textColor}`,
                }}
              >
                {card.title}
              </h3>
              <p
                className="opacity-90"
                style={{
                  textShadow: `0 0 6px ${colors.textColor}`,
                }}
              >
                {card.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
