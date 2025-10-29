"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LoaderIcon from "@/components/LoadingButton";

export default function OrganizerDashboard() {
  const [loaded, setLoaded] = useState(false);

  // Consistent dark + neon cyan theme
  const colors = {
    bgColor: "#0D1117",   // dark background
    textColor: "#00E5FF", // glowing cyan text
  };

  useEffect(() => {
    // Simulate loading delay (if needed)
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
      className="min-h-screen p-4 md:p-8"
      style={{
        backgroundColor: colors.bgColor,
        color: colors.textColor,
      }}
    >
      {/* Header */}
      <h2
        className="text-3xl md:text-4xl font-bold mb-6 text-center rounded-2xl p-4"
        style={{
          backgroundColor: colors.bgColor,
          color: colors.textColor,
          boxShadow: `0 0 25px ${colors.textColor}80`,
          textShadow: `0 0 10px ${colors.textColor}`,
        }}
      >
        Welcome to BattleZone!
      </h2>

      {/* Dashboard Cards */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6">
        {cards.map((card, index) => (
          <Link key={index} href={card.href}>
            <div
              className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto 
                         flex flex-col justify-center items-center 
                         hover:brightness-110 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: colors.bgColor,
                color: colors.textColor,
                boxShadow: `0 0 20px ${colors.textColor}80`,
              }}
            >
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ textShadow: `0 0 6px ${colors.textColor}` }}
              >
                {card.title}
              </h3>
              <p className="text-center opacity-90">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
