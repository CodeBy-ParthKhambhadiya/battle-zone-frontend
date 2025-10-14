// /src/app/player/layout.jsx
"use client";

import PlayerHeader from "@/components/player/PlayerHeader";
import PlayerFooter from "@/components/player/PlayerFooter";
import PlayerIcons from "@/components/player/PlayerIcons";
import "../../app/globals.css";

export default function PlayerLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <PlayerHeader />

            {/* Main content with fixed height and scroll */}
            <main className="flex-grow p-4 overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                {children}
            </main>

            <PlayerIcons />
            <PlayerFooter />
        </div>
    );
}
