import React from "react";
import Link from "next/link";
import { getRandomColor } from "@/components/getColor";

export default function HomePage() {
  const tournamentsColor = getRandomColor();
  const joinedColor = getRandomColor();
  const chatColor = getRandomColor();
  const profileColor = getRandomColor(); // New color for Profile card
  const headerColor = getRandomColor();

  return (
    <div className="p-4 md:p-8">
      {/* Page Header */}
      <h2
        style={{
          backgroundColor: headerColor.bgColor,
          color: headerColor.textColor,
          padding: "1rem",
          borderRadius: "1rem",
        }}
        className="text-3xl md:text-4xl font-bold mb-6 text-center"
      >
        Welcome to BattleZone!
      </h2>

      {/* Dashboard Cards */}
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6">
        {/* Tournaments Section */}
        <Link href="/player/tournaments">
          <div
            style={{
              backgroundColor: tournamentsColor.bgColor,
              color: tournamentsColor.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto flex flex-col justify-center items-center hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Tournaments</h3>
            <p className="text-center">
              View all available tournaments and join the battle!
            </p>
          </div>
        </Link>

        {/* Joined Tournaments Section */}
        <Link href="/player/joined">
          <div
            style={{
              backgroundColor: joinedColor.bgColor,
              color: joinedColor.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto flex flex-col justify-center items-center hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Joined Tournaments</h3>
            <p className="text-center">
              Check the tournaments you have joined.
            </p>
          </div>
        </Link>

        {/* Chat Section */}
        <Link href="/player/chat">
          <div
            style={{
              backgroundColor: chatColor.bgColor,
              color: chatColor.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto flex flex-col justify-center items-center hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Chat</h3>
            <p className="text-center">
              Join the chat and connect with other players.
            </p>
          </div>
        </Link>

        {/* Profile Section */}
        <Link href="/player/profile">
          <div
            style={{
              backgroundColor: profileColor.bgColor,
              color: profileColor.textColor,
            }}
            className="rounded-2xl shadow-lg p-6 flex-1 min-w-[250px] max-w-sm h-auto flex flex-col justify-center items-center hover:brightness-95 cursor-pointer transition"
          >
            <h3 className="text-2xl font-semibold mb-2">Profile</h3>
            <p className="text-center">
              View and edit your player profile.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
