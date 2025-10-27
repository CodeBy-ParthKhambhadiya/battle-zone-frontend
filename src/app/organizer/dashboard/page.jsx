"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getRandomColor } from "@/components/getColor";

export default function OrganizerDashboard() {
  const [colors, setColors] = useState(null);

  useEffect(() => {
    setColors({
      create: getRandomColor(),
      manage: getRandomColor(),
      chat: getRandomColor(),
      profile: getRandomColor(),
      header: getRandomColor(),
    });
  }, []);

  if (!colors) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <h2
        className="text-3xl md:text-4xl font-bold mb-6 text-center rounded-2xl p-4"
        style={{
          backgroundColor: colors.header.bgColor,
          color: colors.header.textColor,
        }}
      >
        Welcome to BattleZone!
      </h2>

      {/* Dashboard Cards */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6">
        {/* Manage Tournaments */}
        <Link href="/organizer/manage-tournament">
          <div
            style={{
              backgroundColor: colors.create.bgColor,
              color: colors.create.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto 
                       flex flex-col justify-center items-center 
                       hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Manage Tournaments</h3>
            <p className="text-center">
              Create, edit, or delete tournaments you’ve organized.
            </p>
          </div>
        </Link>

        {/* Manage Players */}
        <Link href="/organizer/manage-players">
          <div
            style={{
              backgroundColor: colors.manage.bgColor,
              color: colors.manage.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto 
                       flex flex-col justify-center items-center 
                       hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Manage Players</h3>
            <p className="text-center">
              View and organize registered players for your tournaments.
            </p>
          </div>
        </Link>

        {/* Chat */}
        <Link href="/organizer/chat">
          <div
            style={{
              backgroundColor: colors.chat.bgColor,
              color: colors.chat.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto 
                       flex flex-col justify-center items-center 
                       hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Chat</h3>
            <p className="text-center">
              Connect with players or co-organizers in real-time conversations.
            </p>
          </div>
        </Link>

        {/* Profile */}
        <Link href="/organizer/profile">
          <div
            style={{
              backgroundColor: colors.profile.bgColor,
              color: colors.profile.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto 
                       flex flex-col justify-center items-center 
                       hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Profile</h3>
            <p className="text-center">
              View and update your organizer information and settings.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
