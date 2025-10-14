// /src/components/player/PlayerHeader.jsx
"use client";

import Link from "next/link";

const PlayerHeader = () => {
  return (
    <header
      className="p-4 flex justify-between items-center"
      style={{ backgroundColor: "var(--header-bg)", color: "var(--header-text)" }}
    >
      <h1 className="text-xl font-bold">BattleZone Player</h1>
      <nav className="space-x-4">
        <Link href="/player/home" className="hover:underline">Home</Link>
        <Link href="/player/profile" className="hover:underline">Profile</Link>
        <Link href="/auth/login" className="hover:underline">Logout</Link>
      </nav>
    </header>
  );
};

export default PlayerHeader;
