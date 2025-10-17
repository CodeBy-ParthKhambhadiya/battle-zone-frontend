"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import TournamentChatPage from "@/components/TournamentChat";
import useTournament from "@/hooks/useTournament";

export default function JoinedTournamentPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId;
  const { fetchTournamentChatsById, tournamentChatById } = useTournament();

  useEffect(() => {
    if (tournamentId) {
    //   fetchTournamentChatsById(tournamentId);
    }
  }, [tournamentId]);

  const organizer = tournamentChatById?.organizer;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4 mt-2">
      {/* Organizer Details */}
      {organizer && (
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
          {organizer.avatarFile ? (
            <img
              src={organizer.avatarFile}
              alt="Organizer Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
              {organizer.firstName.charAt(0)}
            </div>
          )}
          <div>
            <div className="text-white font-semibold">
              {organizer.firstName} {organizer.lastName}
            </div>
            <div className="text-gray-300 text-sm">{organizer.email}</div>
            <div className="text-gray-400 text-xs">Organizer</div>
          </div>
        </div>
      )}

      {/* Tournament Chat */}
      <TournamentChatPage tournamentId={tournamentId} />
    </div>
  );
}
