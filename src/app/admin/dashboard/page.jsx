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
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
      </div>
    );
  }
const cards = [
  {
    href: "/admin/verification",
    title: "Verification",
    desc: "Review and approve player or organizer verification requests.",
  },
  {
    href: "/admin/add-balance",
    title: "Add balance",
    desc: "View, edit, or remove users from the system.",
  },
  {
    href: "/admin/transaction-requests",
    title: "Transaction Requests",
    desc: "Handle user deposit and withdrawal requests securely.",
  },
  {
    href: "/admin/profile",
    title: "Profile",
    desc: "View and update your admin profile and settings.",
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
              <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
              <p className="text-center opacity-90">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
