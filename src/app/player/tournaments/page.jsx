"use client";

import { useEffect, useState } from "react";
import useTournament from "@/hooks/useTournament";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import useAuth from "@/hooks/useAuth";
import ConfirmModal from "@/components/player/ConfirmModal";
import { Trophy, Gamepad, FileText, User, Users, Copy } from 'lucide-react';
import getTimeLeft from "@/utils/getTimeLeft.js";

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
    const [activeSection, setActiveSection] = useState("leaderboard");
    const [copied, setCopied] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());


    useEffect(() => {
        fetchTournaments();
        fetchJoinDetails();
    }, []);
    // console.log(joinDetails);


    const sortedTournaments = Array.isArray(tournaments)
        ? [...tournaments].sort(
            (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
        )
        : [];
    console.log(sortedTournaments);

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
        try {
            await cancelJoinTournament(joinId);
        } catch (err) {
            console.error("Failed to cancel join:", err);
        } finally {
            setCancellingJoinId(null); // reset
        }
    };

    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // revert back after 2 seconds
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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

                        const joinedRecord =
                            Array.isArray(joinDetails) &&
                            joinDetails.find(
                                (join) =>
                                    join?.tournament?._id === t?._id &&
                                    join?.player?._id === user?._id
                            );
                        const players = (joinDetails || [])
                            .filter(({ tournament }) => tournament?._id === t._id)
                            .map(({ player }) => player);

                        const isJoining = joiningTournamentId === t._id;
                        const isCancelling = joinedRecord && cancellingJoinId === joinedRecord._id;

                        const {
                            joinedPlayers = 0,
                            entry_fee = 0
                        } = t;

                        // Initialize all prizes and counts to 0
                        let totalPool = 0, prizePoolMoney = 0, winnerPlayers = 0, winnerBottomPlayers = 0;
                        let bottomPlayersReturn = 0, leftoverMoney = 0, firstPrize = 0, secondPrize = 0, thirdPrize = 0, returnedPerPlayer = 0;

                        if (joinedPlayers > 0) {
                            totalPool = entry_fee * joinedPlayers;
                            prizePoolMoney = totalPool * 0.8;

                            // Half of players are winners (round up if odd)
                            winnerPlayers = Math.ceil(joinedPlayers / 2);
                            winnerBottomPlayers = Math.max(winnerPlayers - 3, 0);

                            bottomPlayersReturn = winnerBottomPlayers * entry_fee;
                            leftoverMoney = prizePoolMoney - bottomPlayersReturn;

                            firstPrize = Math.floor(leftoverMoney * 0.5);
                            secondPrize = Math.floor(leftoverMoney * 0.3);
                            thirdPrize = Math.floor(leftoverMoney * 0.2);

                            // Add any remaining leftover to first prize
                            firstPrize += Math.floor(leftoverMoney - (firstPrize + secondPrize + thirdPrize));

                            returnedPerPlayer = winnerBottomPlayers > 0 ? Math.floor(bottomPlayersReturn / winnerBottomPlayers) : 0;
                        }
                        const now = new Date(); // Current local time
                        const startTime = new Date(t.start_datetime);
                        const endTime = new Date(t.end_datetime);

                        // Format both times as HH:MM (en-IN locale)
                        const formatTime = (date) =>
                            date.toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            });

                        // Clean console log
                        console.log(
                            `Start Time: ${formatTime(startTime)}, End Time: ${formatTime(endTime)}`
                        );

                        let statusLabel = "";
                        let statusColor = "";

                        if (t.status === "CANCELLED") {
                            statusLabel = "CANCELLED";
                            statusColor = "bg-red-700 text-white";
                        } else if (now < startTime) {
                            statusLabel = "UPCOMING";
                            statusColor = "bg-blue-700 text-white";
                        } else if (now >= startTime && now <= endTime) {
                            statusLabel = "ONGOING";
                            statusColor = "bg-green-700 text-white";
                        } else if (now > endTime) {
                            statusLabel = "COMPLETED";
                            statusColor = "bg-gray-700 text-white";
                        } else {
                            // Fallback
                            statusLabel = "UPCOMING";
                            statusColor = "bg-blue-700 text-white";
                        }


                        let buttonText = "";
                        let buttonDisabled = false;
                        let showExtraButton = false;
                        let showJoinButton = false; // 👈 new flag

                        // Only allow "Pre-Join" button when tournament is UPCOMING
                        if (statusLabel === "UPCOMING") {
                            showJoinButton = true;
                        }

                        // If user has already joined
                        if (joinedRecord) {
                            if (joinedRecord.status === "pending") {
                                buttonText = "Pending";
                                buttonDisabled = true;
                                showExtraButton = true;
                            } else if (joinedRecord.status === "confirmed") {
                                buttonText = "Joined";
                                buttonDisabled = true;
                            }
                        } else if (isJoining) {
                            buttonText = "Joining...";
                            buttonDisabled = true;
                        } else if (showJoinButton) {
                            // Only show join button in UPCOMING tournaments
                            buttonText = "Pre-Join";
                            buttonDisabled = false;
                        }


                        return (
                            <div
                                key={t._id}
                                className="rounded-lg p-3 sm:p-4 shadow hover:shadow-lg transition relative"
                                style={{ backgroundColor: bgColor, color: textColor }}
                            >
                                <div className="p-4 rounded-lg shadow-md w-full">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
                                        <h2 className="font-bold text-lg sm:text-xl">{t.name}</h2>

                                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                                            {/* Joined Players */}
                                            <div className="flex flex-col items-end sm:items-center gap-0.5">
                                                {statusLabel === "UPCOMING" && (
                                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                                                        ⏳ Starts in {getTimeLeft(t.start_datetime) || "00:00:00"}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 font-medium">
                                                {t.joinedPlayers}/{t.max_players} joined
                                            </p>

                                            {/* Status */}
                                            <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusColor}`}>
                                                {statusLabel}
                                            </span>
                                        </div>
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
                                            {/* Button rendering */}
                                            {statusLabel === "UPCOMING" || (joinedRecord && joinedRecord.status === "confirmed") || (joinedRecord && joinedRecord.status === "pending") ? (
                                                <div className="flex gap-2">

                                                    {/* Main button: Pre-Join / Joining / Joined / Pending */}
                                                    <button
                                                        onClick={() => {
                                                            if (joinedRecord?.status === "pending") {
                                                                // Do nothing, waiting for approval
                                                                return;
                                                            } else if (joinedRecord?.status !== "confirmed") {
                                                                // Only allow Pre-Join if not already joined
                                                                setSelectedTournamentToJoin(t);
                                                                setShowConfirmModal(true);
                                                            }
                                                        }}
                                                        disabled={
                                                            joinedRecord?.status === "confirmed" ||
                                                            joinedRecord?.status === "pending" ||
                                                            isJoining ||
                                                            buttonDisabled
                                                        }
                                                        className={`bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700 transition ${joinedRecord?.status === "confirmed" ||
                                                            joinedRecord?.status === "pending" ||
                                                            isJoining ||
                                                            buttonDisabled
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                            }`}
                                                    >
                                                        {joinedRecord?.status === "pending"
                                                            ? "Pending"
                                                            : joinedRecord?.status === "confirmed"
                                                                ? "Joined"
                                                                : isJoining
                                                                    ? <LoaderIcon className="w-4 h-4 inline-block animate-spin" />
                                                                    : "Pre-Join"}
                                                    </button>

                                                    {/* Extra Cancel button if pending */}
                                                    {joinedRecord?.status === "pending" && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTournamentToJoin(t);
                                                                setSelectedJoinToCancel(joinedRecord);
                                                                setShowCancelModal(true);
                                                            }}
                                                            disabled={isCancelling}
                                                            className={`px-3 py-1 rounded cursor-pointer text-xs sm:text-sm transition ${isCancelling
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-red-500 hover:bg-red-600 text-white"
                                                                }`}
                                                        >
                                                            {isCancelling ? "Cancelling..." : "Cancel"}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : null}



                                            <button
                                                onClick={() => toggleExpand(t._id)}
                                                className="p-1 rounded transition btn-dark-shadow cursor-pointer "
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>

                                        </div>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                <>
                                    {isExpanded && (
                                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm space-y-6 w-full">

                                            {/* Description */}
                                            <p>{t.description}</p>

                                            {/* Tabs Row */}
                                            <div className="flex flex-wrap gap-2 sm:gap-4">
                                                {[
                                                    { key: "leaderboard", label: <><Trophy className="inline w-4 h-4 mr-1" />Leaderboard</> },
                                                    { key: "game", label: <><Gamepad className="inline w-4 h-4 mr-1" />Game Info</> },
                                                    { key: "rules", label: <><FileText className="inline w-4 h-4 mr-1" />Rules</> },
                                                    { key: "organizer", label: <><User className="inline w-4 h-4 mr-1" />Organizer Info</> },
                                                    { key: "players", label: <><Users className="inline w-4 h-4 mr-1" />Players</> },
                                                ].map((tab) => (
                                                    <button
                                                        key={tab.key}
                                                        onClick={() => setActiveSection(tab.key)}
                                                        className={`px-3 py-1.5 rounded-md font-semibold transition-all duration-200 cursor-pointer tab-dark-shadow
                                                            ${activeSection === tab.key
                                                                ? "shadow-md border border-gray-600"
                                                                : "bg-transparent"
                                                            }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>


                                            {/* Leaderboard / Prize Distribution */}
                                            {activeSection === "leaderboard" && t.joinedPlayers > 3 && (
                                                <div
                                                    className="mt-4 w-full p-4 rounded-lg overflow-x-auto"
                                                    style={{
                                                        backgroundColor: bgColor,
                                                        color: textColor,
                                                        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                                                    }}
                                                >
                                                    <h3 className="font-semibold text-lg sm:text-xl mb-3 border-b border-gray-500 pb-1 flex items-center gap-2">
                                                        <Trophy className="w-5 h-5" /> Leaderboard / Prize Distribution
                                                    </h3>

                                                    <table className="min-w-full border rounded-lg overflow-hidden w-full">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-4 py-2 text-left">Position</th>
                                                                <th className="px-4 py-2 text-left">Prize</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="px-4 py-2">1st Place</td>
                                                                <td className="px-4 py-2">₹{firstPrize}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-4 py-2">2nd Place</td>
                                                                <td className="px-4 py-2">₹{secondPrize}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-4 py-2">3rd Place</td>
                                                                <td className="px-4 py-2">₹{thirdPrize}</td>
                                                            </tr>
                                                            {winnerBottomPlayers > 0 && (
                                                                <tr>
                                                                    <td className="px-4 py-2">4th – {winnerPlayers}th Place</td>
                                                                    <td className="px-4 py-2">₹{returnedPerPlayer}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}


                                            {/* Game Info */}
                                            {activeSection === "game" && (
                                                <div>
                                                    <h3 className="font-semibold text-lg sm:text-xl mb-2 border-b border-gray-500 pb-1 flex items-center gap-2">
                                                        <Gamepad className="w-5 h-5" /> Game Info
                                                    </h3>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                        <div>
                                                            <p><span className="font-semibold">Game Type:</span> {t.game_type}</p>
                                                            <p><span className="font-semibold">Max Players:</span> {t.max_players}</p>
                                                            <p><span className="font-semibold">Prize Pool (Entry × Joined × 0.9):</span> ₹{prizePoolMoney}</p>
                                                        </div>
                                                        <div>
                                                            <p><span className="font-semibold">Start:</span> {new Date(t.start_datetime).toLocaleString()}</p>
                                                            <p><span className="font-semibold">End:</span> {new Date(t.end_datetime).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rules */}
                                            {activeSection === "rules" && t.rules?.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-lg sm:text-xl mb-2 border-b border-gray-500 pb-1 flex items-center gap-2">
                                                        <FileText className="w-5 h-5" /> Rules
                                                    </h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {t.rules.map((rule, idx) => (
                                                            <li key={idx}>{rule}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Organizer Info */}
                                            {activeSection === "organizer" && t.organizer_id && (
                                                <div>
                                                    <h3 className="font-semibold text-lg sm:text-xl mb-2 border-b border-gray-500 pb-1 flex items-center gap-2">
                                                        <User className="w-5 h-5" /> Organizer Info
                                                    </h3>

                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                                                        <img
                                                            src={t.organizer_id?.avatar || "/default-avatar.png"}
                                                            alt={`${t.organizer_id?.firstName || "Unknown"} ${t.organizer_id?.lastName || ""}`}
                                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-500 shadow-md"
                                                        />
                                                        <div>
                                                            <p className="text-base font-semibold">{t.organizer_id?.firstName} {t.organizer_id?.lastName}</p>
                                                            <p className="text-sm">Role: {t.organizer_id?.role} {t.organizer_id?.isVerified && "✅"}</p>
                                                            <p className="text-sm">Organizer ID: {t.organizer_id?._id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                        <div className="space-y-1">
                                                            <p><span className="font-semibold">Email:</span> {t.organizer_id?.email}</p>
                                                            <p><span className="font-semibold">Mobile:</span> {t.organizer_id?.mobile}</p>
                                                            <p><span className="font-semibold">Gender:</span> {t.organizer_id?.gender}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p><span className="font-semibold">Account Holder Name:</span> {t.organizer_id?.accountHolderName}</p>
                                                            <div className="flex items-center gap-2">
                                                                <p><span className="font-semibold">UPI ID:</span> {t.organizer_id?.upiId || "N/A"}</p>
                                                                {t.organizer_id?.upiId && (
                                                                    <button
                                                                        onClick={() => handleCopy(t.organizer_id.upiId)}
                                                                        className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-sm font-medium cursor-pointer"
                                                                        title={copied ? "Copied!" : "Copy UPI ID"}
                                                                    >
                                                                        <Copy size={16} />
                                                                        {copied ? "Copied" : "Copy"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Players */}
                                            {activeSection === "players" && players?.length > 0 && (
                                                <div
                                                    className="overflow-x-auto p-4 rounded-lg"
                                                    style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}
                                                >
                                                    <h3 className="text-lg sm:text-xl font-semibold border-b pb-1 mb-2 flex items-center gap-2">
                                                        <Users className="w-5 h-5" /> Joined Players ({players.length})
                                                    </h3>
                                                    <table
                                                        className="min-w-full border-collapse"
                                                        style={{ backgroundColor: bgColor, color: textColor, border: `1px solid ${textColor}` }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>#</th>
                                                                <th className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>Avatar</th>
                                                                <th className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>Name</th>
                                                                <th className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>Game Username</th>
                                                                <th className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>Game ID</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {players.map((p, index) => (
                                                                <tr key={p._id}>
                                                                    <td className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>{index + 1}</td>
                                                                    <td className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>
                                                                        <img
                                                                            src={p.avatar || "/default-avatar.png"}
                                                                            alt={`${p.firstName} ${p.lastName}`}
                                                                            className="w-10 h-10 rounded-full object-cover mx-auto"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2 text-center break-words" style={{ border: `1px solid ${textColor}` }}>{p.firstName} {p.lastName}</td>
                                                                    <td className="px-4 py-2 text-center break-words" style={{ border: `1px solid ${textColor}` }}>{p.gameUserName}</td>
                                                                    <td className="px-4 py-2 text-center break-words" style={{ border: `1px solid ${textColor}` }}>{p.gameId}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </>



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
                            colorKey={selectedTournamentToJoin?._id}
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
