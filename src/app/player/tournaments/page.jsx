"use client";

import { useEffect, useState } from "react";
import useTournament from "@/hooks/useTournament";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import useAuth from "@/hooks/useAuth";
import ConfirmModal from "@/components/player/ConfirmModal";

export default function TournamentsPage() {
    const { tournaments, joinDetails, fetchJoinDetails, fetchTournaments, joinTournament, cancelJoinTournament, loading } = useTournament();
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(null);
    const [tournamentColors, setTournamentColors] = useState({});
    const [joiningTournamentId, setJoiningTournamentId] = useState(null); // ✅ Track only the tournament being joined
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTournamentToJoin, setSelectedTournamentToJoin] = useState(null);
    const [cancellingJoinId, setCancellingJoinId] = useState(null);
    const [selectedJoinToCancel, setSelectedJoinToCancel] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    useEffect(() => {
        fetchTournaments();
        fetchJoinDetails();
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

    const handleJoin = async (tournamentId, playerId) => {
        setJoiningTournamentId(tournamentId); // ✅ mark this tournament as joining
        try {
            await joinTournament({ tournamentId, playerId });
            await fetchJoinDetails();
        } catch (err) {
            console.error(err);
        } finally {
            setJoiningTournamentId(null); // ✅ reset after join completes
        }
    };
    const handleCancel = async (joinId) => {
        setCancellingJoinId(joinId);
        console.log("🚀 ~ handleCancel ~ joinId:", joinId)
        try {
            await cancelJoinTournament(joinId);
        } catch (err) {
            console.error("Failed to cancel join:", err);
        } finally {
            setCancellingJoinId(null); // reset
        }
    };

    return (
        <div className="p-4 sm:p-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Trophy className="text-yellow-500" size={24} />
                <h1 className="text-xl sm:text-2xl font-bold">All Tournaments</h1>
            </div>

            {loading && sortedTournaments.length === 0 ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <LoaderIcon size={16} colorClass="text-blue-600" />
                </div>
            ) : (
                <div className="flex flex-col gap-3 sm:gap-4">
                    {sortedTournaments.map((t) => {
                        const isExpanded = expanded === t._id;
                        const { bgColor, textColor } = tournamentColors[t._id] || { bgColor: "bg-blue-500", textColor: "text-white" };

                        const joinedRecord = Array.isArray(joinDetails) && joinDetails.find(
                            (join) => join.tournament._id === t._id && join.player._id === user._id
                        );

                        const isJoining = joiningTournamentId === t._id;
                        const isCancelling = joinedRecord && cancellingJoinId === joinedRecord._id;

                        let buttonText = "Pre-Join";
                        let buttonDisabled = false;
                        let showExtraButton = false;

                        if (joinedRecord) {
                            if (joinedRecord.status === "pending") {
                                buttonText = "Pending";
                                buttonDisabled = true;
                                showExtraButton = true; // Show extra button for pending
                            } else if (joinedRecord.status === "confirmed") {
                                buttonText = "Joined";
                                buttonDisabled = true;
                            }
                        } else if (isJoining) {
                            buttonText = "Joining...";
                            buttonDisabled = true;
                        }

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

                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${(t.joinedPlayers / t.max_players) * 100}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                                        <p className="text-xs sm:text-sm">
                                            <span className="font-semibold">Entry Fee:</span> ₹{t.entry_fee}
                                        </p>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedTournamentToJoin(t);
                                                    setShowConfirmModal(true);
                                                }}
                                                disabled={buttonDisabled}
                                                className={`bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 transition ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
                                                    }`}
                                            >
                                                {isJoining ? <LoaderIcon className="w-4 h-4 inline-block animate-spin" /> : buttonText}
                                            </button>

                                            {/* Extra Button when pending */}
                                            {showExtraButton && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedTournamentToJoin(t);
                                                        setSelectedJoinToCancel(joinedRecord); // store the join record
                                                        setShowCancelModal(true); // show confirm modal
                                                    }}
                                                    disabled={isCancelling}
                                                    className={`px-3 py-1 rounded text-xs sm:text-sm transition ${isCancelling
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-red-500 hover:bg-red-600 text-white"
                                                        }`}
                                                >
                                                    {isCancelling ? "Cancelling..." : "Cancel"}
                                                </button>
                                            )}


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
                                    <div className="mt-2 sm:mt-3 text-xs sm:text-sm">
                                        <p className="mb-1 sm:mb-2">{t.description}</p>
                                        <div className="mb-1 sm:mb-2">
                                            <p><span className="font-semibold">Game Type:</span> {t.game_type}</p>
                                            <p><span className="font-semibold">Max Players:</span> {t.max_players}</p>
                                            <p><span className="font-semibold">Prize Pool:</span> ₹{t.prize_pool}</p>
                                        </div>
                                        <div className="mb-1 sm:mb-2">
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
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {showConfirmModal && selectedTournamentToJoin && (
                        <ConfirmModal
                            title="Confirm Pre-Join"
                            message={`Are you sure you want to pre-join "${selectedTournamentToJoin.name}"?`}
                            onCancel={() => setShowConfirmModal(false)}
                            onConfirm={async () => {
                                setShowConfirmModal(false);
                                await handleJoin(selectedTournamentToJoin._id, user._id);
                                setSelectedTournamentToJoin(null);
                            }}
                            confirmText="Confirm"
                            cancelText="Cancel"
                            colorKey={selectedTournamentToJoin?._id} // optional: color per tournament
                        />

                    )}
                    {showCancelModal && selectedJoinToCancel && (
                        <ConfirmModal
                            title="Cancel Join Request"
                            message={`Are you sure you want to cancel your join request for "${selectedTournamentToJoin.name}"?`}
                            confirmText="Yes, Cancel"
                            cancelText="No"
                            colorKey="red"
                            onConfirm={() => {
                                handleCancel(selectedJoinToCancel._id);
                                setShowCancelModal(false);
                            }}
                            onCancel={() => setShowCancelModal(false)}
                        />
                    )}
                </div>
            )}


        </div>
    );
}
