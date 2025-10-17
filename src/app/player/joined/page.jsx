"use client";

import { useEffect, useState } from "react";
import useTournament from "@/hooks/useTournament";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import useAuth from "@/hooks/useAuth";
import ConfirmModal from "@/components/player/ConfirmModal";

export default function JoinedPage() {
    const { tournaments, joinDetails, fetchJoinDetails, fetchTournaments, loading } = useTournament();
    console.log("🚀 ~ TournamentsPage ~ joinDetails:", joinDetails)
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(null);
    const [tournamentColors, setTournamentColors] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchTournaments();
                await fetchJoinDetails();
            } catch (err) {
                console.error("Failed to fetch tournaments or join details:", err);
            }
        };

        fetchData();
    }, []);


    const sortedTournaments = Array.isArray(tournaments)
        ? [...tournaments].sort(
            (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
        )
        : [];

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    useEffect(() => {
        if (Array.isArray(tournaments) && tournaments.length) {
            const colors = {};
            tournaments.forEach((t) => {
                const color = getRandomColor();
                colors[t._id] = color || { bgColor: "bg-blue-500", textColor: "text-white" };
            });
            setTournamentColors(colors);
        }
    }, [tournaments]);

    // Filter only confirmed joined tournaments
    const confirmedTournaments = sortedTournaments.filter((t) =>
        Array.isArray(joinDetails) && joinDetails.some((join) => {
            // make sure join.tournament and join.player exist
            if (!join.tournament || !join.player) return false;

            // compare as strings (in case of ObjectId)
            return (
                String(join.tournament._id) === String(t._id) &&
                String(join.player._id) === String(user._id) &&
                join.status === "confirmed"
            );
        })
    );
    console.log("🚀 ~ TournamentsPage ~ confirmedTournaments:", confirmedTournaments)


    return (
        <div className="p-4 sm:p-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Trophy className="text-yellow-500" size={24} />
                <h1 className="text-xl sm:text-2xl font-bold">Joined Tournaments</h1>
            </div>

            {loading && confirmedTournaments.length === 0 ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoaderIcon size={16} colorClass="text-blue-600" />
                </div>
            ) : (
                <div className="flex flex-col gap-3 sm:gap-4">
                    {confirmedTournaments.map((t) => {
                        const isExpanded = expanded === t._id;
                        const { bgColor, textColor } = tournamentColors[t._id] || { bgColor: "bg-blue-500", textColor: "text-white" };
                        const totalPool = t.entry_fee * t.joinedPlayers;
                        const prizePoolMoney = totalPool * 0.8;
                        let winnerPlayers = Math.floor(t.joinedPlayers / 2);
                        if (t.joinedPlayers % 2 !== 0) {
                            winnerPlayers += 1;
                        }
                        const winnerBottomPlayers = winnerPlayers - 3;
                        const bottomPlayersReturn = winnerBottomPlayers * t.entry_fee;
                        const leftoverMoney = prizePoolMoney - bottomPlayersReturn;
                        let firstPrize = Math.floor(leftoverMoney * 0.5);
                        let secondPrize = Math.floor(leftoverMoney * 0.3);
                        let thirdPrize = Math.floor(leftoverMoney * 0.2);

                        const distributed = firstPrize + secondPrize + thirdPrize;
                        const remaining = Math.floor(leftoverMoney - distributed);
                        firstPrize += remaining; // add leftover to first prize

                        const returnedPerPlayer = winnerBottomPlayers > 0 ? Math.floor(bottomPlayersReturn / winnerBottomPlayers) : 0;

                        return (
                            <div
                                key={t._id}
                                className="rounded-lg p-3 sm:p-4 shadow hover:shadow-lg transition relative"
                                style={{ backgroundColor: bgColor, color: textColor }}
                            >
                                <div className="p-4 rounded-lg shadow-md w-full">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                                        <h2 className="font-bold text-lg sm:text-xl">{t.name}</h2>
                                        <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 sm:mt-0">
                                            {t.joinedPlayers}/{t.max_players} joined
                                        </p>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${(t.joinedPlayers / t.max_players) * 100}%` }}
                                        ></div>
                                    </div>

                                    {/* Entry Fee & Prize Pool */}
                                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                                        <p className="text-xs sm:text-sm">
                                            <span className="font-semibold">Entry Fee:</span> ₹{t.entry_fee}
                                        </p>

                                        <p className="text-xs sm:text-sm">
                                            <span className="font-semibold">Prize Pool:</span> ₹{firstPrize} / ₹{secondPrize} / ₹{thirdPrize} (1st / 2nd / 3rd)
                                        </p>

                                        {/* Joined button & Expand toggle */}
                                        <div className="flex gap-2">
                                            <button
                                                disabled
                                                className="bg-blue-600 text-white px-3 py-1 cursor-not-allowed rounded text-xs sm:text-sm"
                                            >
                                                Joined
                                            </button>

                                            <button
                                                onClick={() => toggleExpand(t._id)}
                                                className="p-1 rounded hover:bg-gray-100 transition"
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="mt-2 sm:mt-3 text-xs sm:text-sm space-y-2">
                                        <p>{t.description}</p>

                                        <div>
                                            <p><span className="font-semibold">Game Type:</span> {t.game_type}</p>
                                            <p><span className="font-semibold">Max Players:</span> {t.max_players}</p>
                                            <p><span className="font-semibold">Prize Pool (Entry × Joined × 0.9):</span> ₹{prizePoolMoney}</p>
                                        </div>

                                        <div>
                                            <p><span className="font-semibold">Start:</span> {new Date(t.start_datetime).toLocaleString()}</p>
                                            <p><span className="font-semibold">End:</span> {new Date(t.end_datetime).toLocaleString()}</p>
                                        </div>

                                        {t.rules?.length > 0 && (
                                            <div>
                                                <span className="font-semibold">Rules:</span>
                                                <ul className="list-disc list-inside">
                                                    {t.rules.map((rule, idx) => (
                                                        <li key={idx}>{rule}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Leaderboard */}
                                        <div className="mt-2">
                                            <h3 className="font-semibold text-sm mb-1">Leaderboard / Prize Distribution</h3>
                                            <ul className="list-disc list-inside text-gray-800">
                                                <li>1st Place: ₹{firstPrize}</li>
                                                <li>2nd Place: ₹{secondPrize}</li>
                                                <li>3rd Place: ₹{thirdPrize}</li>
                                                {winnerBottomPlayers > 0 && (
                                                    <li>Returned to each of the remaining {winnerBottomPlayers} player(s): ₹{returnedPerPlayer}</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>


            )}
        </div>
    );
}
