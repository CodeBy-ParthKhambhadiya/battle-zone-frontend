"use client";

import PlayerHeader from "@/components/player/PlayerHeader";
import PlayerFooter from "@/components/player/PlayerFooter";
import PlayerIcons from "@/components/player/PlayerIcons";

export default function PlayerLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <PlayerHeader />

            <div className="flex-grow p-4 overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-custom">
                {children}
            </div>
            <PlayerIcons />
            {/* <PlayerFooter /> */}
        </div>
    );
}
