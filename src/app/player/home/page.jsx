"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [colors, setColors] = useState({
    bgColor: "#0D1117",   // dark background
    textColor: "#00E5FF", // glowing cyan text
  });

  return (
    <div className="p-4 md:p-8">
      {/* Page Header */}
    <h3
  style={{
    backgroundColor: colors.bgColor,
    color: colors.textColor,
    textShadow: `0 0 8px ${colors.textColor}`,
    padding: "1rem",
    borderRadius: "1rem",
  }}
  className="
    text-2xl        /* smaller phones */
    sm:text-3xl     /* small screens */
    md:text-4xl     /* tablets and up */
    font-bold 
    mb-6 
    text-center 
    leading-tight
  "
>
  Welcome to BattleZone!
</h3>


      {/* Dashboard Cards */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6">
        {[
          { title: "Tournaments", desc: "View all available tournaments and join the battle!", link: "/player/tournaments" },
          { title: "Joined Tournaments", desc: "Check the tournaments you have joined.", link: "/player/joined" },
          { title: "Chat", desc: "Join the chat and connect with other players.", link: "/player/chat" },
          { title: "Profile", desc: "View and edit your player profile.", link: "/player/profile" },
        ].map((card) => (
          <Link href={card.link} key={card.title}>
            <div
              style={{
                backgroundColor: colors.bgColor,
                color: colors.textColor,
                boxShadow: `0 0 15px rgba(0, 229, 255, 0.3)`, // soft glow
              }}
              className="rounded-2xl p-6 flex-1 min-w-[250px] max-w-sm h-auto flex flex-col justify-center items-center hover:brightness-110 cursor-pointer transition"
            >
              <h3
                className="text-2xl font-semibold mb-2"
                style={{
                  textShadow: `0 0 10px ${colors.textColor}`,
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-center"
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
