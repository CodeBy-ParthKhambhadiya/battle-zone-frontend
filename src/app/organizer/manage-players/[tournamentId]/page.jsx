"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import TournamentChatPage from "@/components/TournamentChat";
import useTournament from "@/hooks/useTournament";

export default function JoinedTournamentPage() {
  const params = useParams();
  const tournamentId = params?.tournamentId;
  const { fetchTournamentChatsById, tournamentChatById } = useTournament();

  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentChatsById(tournamentId);
    }
  }, [tournamentId]);

  const organizer = tournamentChatById?.organizer;

  return (
    <div
      className="max-w-md mx-auto flex flex-col gap-4 min-h-[80vh] rounded-lg"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${textColor}22`,
        boxShadow: `0 0 15px ${textColor}11`,
        padding: "1rem",
      }}
    >
      {/* Organizer Details */}
      {organizer && (
        <div
          className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${bgColor} 0%, #111A22 100%)`,
            border: `1px solid ${textColor}33`,
            boxShadow: `0 0 12px ${textColor}22`,
          }}
        >
          {organizer.avatarFile ? (
            <img
              src={organizer.avatarFile}
              alt="Organizer Avatar"
              className="w-12 h-12 rounded-full object-cover border"
              style={{
                borderColor: `${textColor}55`,
                boxShadow: `0 0 10px ${textColor}33`,
              }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
              style={{
                backgroundColor: `${textColor}22`,
                color: textColor,
                border: `1px solid ${textColor}55`,
                boxShadow: `0 0 10px ${textColor}33`,
              }}
            >
              {organizer.firstName.charAt(0)}
            </div>
          )}

          <div className="flex flex-col">
            <div
              className="font-semibold text-base"
              style={{ color: textColor }}
            >
              {organizer.firstName} {organizer.lastName}
            </div>
            <div
              className="text-sm"
              style={{ color: `${textColor}AA` }}
            >
              {organizer.email}
            </div>
            <div
              className="text-xs italic"
              style={{ color: `${textColor}77` }}
            >
              Organizer
            </div>
          </div>
        </div>
      )}

      {/* Tournament Chat Section with Scroll */}
      <div
        className="flex-1 overflow-y-auto rounded-lg scrollbar-custom"
        style={{
          border: `1px solid ${textColor}33`,
          boxShadow: `0 0 10px ${textColor}11`,
          backgroundColor: `${bgColor}`,
        }}
      >
        <TournamentChatPage tournamentId={tournamentId} />
      </div>
    </div>
  );
}
