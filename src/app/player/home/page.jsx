"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [colors, setColors] = useState({
    bgColor: "#0D1117",   // dark background
    textColor: "#00E5FF", // glowing cyan text
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-6 md:p-10"
      style={{
        background: "radial-gradient(circle at center, #0D1117 60%, #05070a 100%)",
      }}
    >
      {/* Page Header */}
      <h3
  style={{
    background: `linear-gradient(90deg, ${colors.textColor}33, transparent, ${colors.textColor}33)`,
    color: colors.textColor,
    textShadow: `0 0 10px ${colors.textColor}, 0 0 20px ${colors.textColor}66`,
    border: `1px solid ${colors.textColor}55`,
    padding: "0.75rem 1.5rem", // slightly smaller padding on mobile
    borderRadius: "1rem",
    boxShadow: `0 0 15px ${colors.textColor}33`,
  }}
  className="
    text-xl           /* mobile: smaller */
    sm:text-2xl       /* small screens */
    md:text-3xl       /* tablets */
    lg:text-4xl       /* desktops */
    font-extrabold 
    mb-8 
    text-center 
    leading-tight 
    tracking-wide
    transition-all duration-300
  "
>
  Welcome to BattleZone!
</h3>


      {/* Dashboard Cards */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-8 max-w-6xl">
        {[
          {
            title: "Tournaments",
            desc: "View all available tournaments and join the battle!",
            link: "/player/tournaments",
          },
          {
            title: "Joined Tournaments",
            desc: "Check the tournaments you have joined.",
            link: "/player/joined",
          },
          {
            title: "Chat",
            desc: "Join the chat and connect with other players.",
            link: "/player/chat",
          },
          {
            title: "Profile",
            desc: "View and edit your player profile.",
            link: "/player/profile",
          },
        ].map((card) => (
          <Link href={card.link} key={card.title}>
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 25px ${colors.textColor}`,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{
                backgroundColor: colors.bgColor,
                color: colors.textColor,
                border: `1px solid ${colors.textColor}55`,
                boxShadow: `0 0 15px rgba(0, 229, 255, 0.3)`,
              }}
              className="rounded-2xl p-8 min-w-[250px] max-w-sm flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300"
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
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
