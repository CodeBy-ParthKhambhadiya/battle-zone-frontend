"use client";

import { useEffect, useState } from "react";
import useTournament from "@/hooks/useTournament";
import { ChevronDown, ChevronUp, CreditCard } from "lucide-react";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import useAuth from "@/hooks/useAuth";
import ConfirmModal from "@/components/player/ConfirmModal";
import { Trophy, Gamepad, FileText, User, Users, Copy } from 'lucide-react';
import getTimeLeft from "@/utils/getTimeLeft.js";
import Toast from "@/utils/toast";
import { useRouter } from "next/navigation";

export default function TournamentsPage() {
    const { tournaments, joinDetails, fetchJoinDetails, fetchTournaments, joinTournament, cancelJoinTournament, loading } = useTournament();
    const { user, fetchUser } = useAuth();
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
    const router = useRouter();

    useEffect(() => {
        fetchTournaments();
        fetchJoinDetails();
    }, []);


    const sortedTournaments = Array.isArray(tournaments)
        ? [...tournaments]
            // ✅ Filter only upcoming and ongoing tournaments
            .filter((t) => {
                const now = new Date();
                const start = new Date(t.start_datetime);
                const end = new Date(t.end_datetime);
                return t.status !== "CANCELLED" && (now < start || (now >= start && now <= end));
            })
            // ✅ Sort by start date
            .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
        : [];


    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    // useEffect(() => {
    //     if (Array.isArray(tournaments) && tournaments.length) {
    //         const colors = {};
    //         tournaments.forEach((t) => {
    //             const color = getRandomColor();
    //             colors[t._id] = color || { bgColor: "bg-blue-500", textColor: "text-white" };
    //         });
    //         setTournamentColors(colors);
    //     }
    // }, [tournaments]);
    useEffect(() => {
        if (Array.isArray(tournaments) && tournaments.length) {
            const colors = {};
            tournaments.forEach((t) => {
                colors[t._id] = {
                    bgColor: "#0D1117",  // dark background
                    textColor: "#00E5FF" // glowing cyan text
                };
            });
            setTournamentColors(colors);
        }
    }, [tournaments]);

    const handleJoin = async (tournamentId, playerId) => {
        const requiredFields = [
            "firstName",
            "lastName",
            "username",
            "email",
            "mobile",
            "address",
            "gameId",
            "gameUserName",
            "accountHolderName",
            "upiId",
        ];

        // ✅ Check if user details are complete
        const isIncomplete = requiredFields.some((field) => {
            const value = user?.[field];

            if (value === undefined || value === null) return true;
            if (typeof value === "string" && value.trim() === "") return true;

            return false;
        });

        // 🎯 If game fields specifically are incomplete, redirect to /player/profile/game
        const isGameIncomplete =
            !user?.gameId || (typeof user.gameId === "string" && user.gameId.trim() === "") ||
            !user?.gameUserName || (typeof user.gameUserName === "string" && user.gameUserName.trim() === "");

        if (isGameIncomplete) {
            Toast.error("Please add your Game ID and Game Username before joining a tournament.");
            router.push("/player/profile/game");
            return;
        }

        if (isIncomplete) {
            Toast.error("Please complete your profile before joining a tournament.");
            router.push("/player/profile/update-user");
            return;
        }

        // 🌀 Proceed if user info is complete
        setJoiningTournamentId(tournamentId);
        try {
            await joinTournament({ tournamentId, playerId });
            await fetchJoinDetails();
            await fetchUser();
        } catch (err) {
            console.error(err);
        } finally {
            setJoiningTournamentId(null);
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
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1.5 h-8 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]" />
                <h1 className="text-2xl sm:text-xl md:text-3xl font-extrabold text-[#00E5FF] tracking-wide drop-shadow-[0_0_10px_#00E5FF]">
                    All Tournaments
                </h1>
            </div>


            {loading && sortedTournaments.length === 0 ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
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


                        let statusLabel = "";
                        let statusColor = "";

                        if (t.status === "CANCELLED") {
                            statusLabel = "CANCELLED";
                            statusColor = "border border-red-500 text-red-400 bg-[#0D1117]";
                        } else if (now < startTime) {
                            statusLabel = "UPCOMING";
                            statusColor = "border border-[#00E5FF] text-[#00E5FF] bg-[#0D1117]";
                        } else if (now >= startTime && now <= endTime) {
                            statusLabel = "ONGOING";
                            statusColor = "border border-green-400 text-green-400 bg-[#0D1117]";
                        } else if (now > endTime) {
                            statusLabel = "COMPLETED";
                            statusColor = "border border-gray-500 text-gray-400 bg-[#0D1117] ";
                        } else {
                            // Fallback
                            statusLabel = "UPCOMING";
                            statusColor = "border border-[#00E5FF] text-[#00E5FF] bg-[#0D1117]";
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
                                style={{
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    borderColor: textColor,
                                    boxShadow: `0 0 5px ${textColor}`,
                                }}
                            >
                                <div className="p-4 rounded-lg shadow-md w-full">
                                    <div
                                        className="flex flex-row justify-between items-center mb-3 gap-2 flex-wrap sm:flex-nowrap"
                                        style={{
                                            borderBottom: "1px solid #00E5FF22",
                                            paddingBottom: "4px",
                                        }}
                                    >
                                        {/* Prize Pool */}
                                        <div className="flex items-center gap-2">
                                            <Trophy
                                                className="w-5 h-5"
                                                style={{
                                                    color: "#00E5FF",
                                                    textShadow: "0 0 6px #00E5FF55",
                                                }}
                                            />
                                            <h2
                                                className="font-bold text-base sm:text-lg tracking-wide"
                                                style={{
                                                    color: "#00E5FF",
                                                    textShadow: "0 0 6px #00E5FF55",
                                                }}
                                            >
                                                {t.prize_pool ? `₹${t.prize_pool}` : "Prize TBA"}
                                            </h2>
                                        </div>

                                        {/* Right Side Info */}
                                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                                            {/* Starts In (for upcoming tournaments) */}
                                            {statusLabel === "UPCOMING" && (
                                                <span
                                                    className="text-[10px] sm:text-xs font-medium"
                                                    style={{ color: "#00E5FF" }}
                                                >
                                                    Starts in {getTimeLeft(t.start_datetime) || "00:00:00"}
                                                </span>
                                            )}


                                            {/* Status */}
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusColor}`}
                                                style={{
                                                    border: "1px solid #00E5FF33",
                                                    boxShadow: "0 0 8px #00E5FF22",
                                                }}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>
                                    </div>


                                    <div
                                        className="w-full rounded-lg p-3 mt-2 bg-black/20 flex flex-col gap-1"
                                        style={{ color: textColor }}
                                    >
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span>
                                                Joined: {t.joinedPlayers ?? 0} / {t.max_players ?? 0}
                                            </span>
                                            <span>
                                                Left:{" "}
                                                {Math.max((t.max_players ?? 0) - (t.joinedPlayers ?? 0), 0)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className="h-2.5 rounded-full transition-all duration-500"
                                                style={{
                                                    backgroundColor: textColor,
                                                    width: `${Math.min(
                                                        ((t.joinedPlayers ?? 0) / (t.max_players ?? 1)) * 100,
                                                        100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
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
                                                        className={`px-3 py-1 rounded text-xs sm:text-sm transition border ${joinedRecord?.status === "confirmed" ||
                                                            joinedRecord?.status === "pending" ||
                                                            isJoining ||
                                                            buttonDisabled
                                                            ? "cursor-not-allowed opacity-70"
                                                            : "hover:opacity-90"
                                                            }`}
                                                        style={{
                                                            backgroundColor:
                                                                joinedRecord?.status === "confirmed"
                                                                    ? "#0D1117"
                                                                    : joinedRecord?.status === "pending"
                                                                        ? "#1C1F26"
                                                                        : "#0D1117",
                                                            color:
                                                                joinedRecord?.status === "confirmed"
                                                                    ? "#00E5FF"
                                                                    : joinedRecord?.status === "pending"
                                                                        ? "#999"
                                                                        : "#00E5FF",
                                                            borderColor:
                                                                joinedRecord?.status === "confirmed"
                                                                    ? "#00E5FF"
                                                                    : joinedRecord?.status === "pending"
                                                                        ? "#555"
                                                                        : "#00E5FF",
                                                        }}
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
                                                            className={`px-3 py-1 rounded cursor-pointer text-xs sm:text-sm transition border ${isCancelling
                                                                ? "cursor-not-allowed opacity-70"
                                                                : "hover:opacity-90"
                                                                }`}
                                                            style={{
                                                                backgroundColor: isCancelling ? "#1C1F26" : "#0D1117",
                                                                color: isCancelling ? "#999" : "#00E5FF",
                                                                borderColor: isCancelling ? "#555" : "#00E5FF",
                                                            }}
                                                        >
                                                            {isCancelling ? (
                                                                <LoaderIcon className="w-4 h-4 inline-block animate-spin" />
                                                            ) : (
                                                                "Cancel"
                                                            )}
                                                        </button>
                                                    )}


                                                </div>
                                            ) : null}



                                            <button
                                                onClick={() => toggleExpand(t._id)}
                                                className="p-1 rounded transition cursor-pointer border hover:shadow-[0_0_12px_#00E5FF]"
                                                style={{
                                                    color: "#00E5FF",
                                                    borderColor: "#00E5FF",
                                                    backgroundColor: "#0D1117",
                                                    boxShadow: "0 0 6px #00E5FF", // subtle cyan glow around the button
                                                    textShadow: "0 0 8px #00E5FF", // glowing effect on icon
                                                }}
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
                                                        className={`px-3 py-1.5 rounded-md transition-all duration-300 cursor-pointer
                                                            ${activeSection === tab.key
                                                                ? "bg-[#0D1117] text-[#00E5FF] border border-[#00E5FF]"
                                                                : " border border-00E5FF hover:text-[#00E5FF] hover:border-[#00E5FF]"
                                                            }`}
                                                        style={{
                                                            boxShadow:
                                                                activeSection === tab.key
                                                                    ? "0 0 10px #00E5FF"
                                                                    : "0 0 6px rgba(0, 0, 0, 0.5)",
                                                            textShadow:
                                                                activeSection === tab.key
                                                                    ? "0 0 8px #00E5FF"
                                                                    : "none",
                                                            backgroundColor: activeSection === tab.key ? "#0D1117" : "transparent",
                                                            transition: "all 0.3s ease-in-out",
                                                        }}
                                                    >
                                                        {tab.label}
                                                    </button>

                                                ))}
                                            </div>



                                            {/* Leaderboard / Prize Distribution */}
                                            {activeSection === "leaderboard" && t.joinedPlayers > 3 && (
                                                <div
                                                    className="mt-6 w-full rounded-xl overflow-hidden shadow-xl border border-gray-700"
                                                    style={{
                                                        backgroundColor: bgColor,
                                                        color: textColor,
                                                        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                                                    }}
                                                >
                                                    <div className="p-4 border-b border-gray-600 flex items-center gap-2">
                                                        <Trophy className="w-6 h-6 text-yellow-400" />
                                                        <h3 className="font-bold text-xl">Leaderboard / Prize Distribution</h3>
                                                    </div>

                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-700 text-sm sm:text-base">
                                                            <thead className="bg-gray-800/40">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">
                                                                        Position
                                                                    </th>
                                                                    <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">
                                                                        Prize
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="divide-y divide-gray-700">
                                                                <tr className="hover:bg-gray-800/30 transition">
                                                                    <td className="px-6 py-3 font-medium">🥇 1st Place</td>
                                                                    <td className="px-6 py-3">₹{firstPrize}</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/30 transition">
                                                                    <td className="px-6 py-3 font-medium">🥈 2nd Place</td>
                                                                    <td className="px-6 py-3">₹{secondPrize}</td>
                                                                </tr>
                                                                <tr className="hover:bg-gray-800/30 transition">
                                                                    <td className="px-6 py-3 font-medium">🥉 3rd Place</td>
                                                                    <td className="px-6 py-3">₹{thirdPrize}</td>
                                                                </tr>

                                                                {winnerBottomPlayers > 0 && (
                                                                    <tr className="hover:bg-gray-800/30 transition">
                                                                        <td className="px-6 py-3 font-medium">
                                                                            4th – {winnerPlayers}th Place
                                                                        </td>
                                                                        <td className="px-6 py-3">₹{returnedPerPlayer}</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {activeSection === "game" && (
                                                <div>
                                                    <h3 className="font-semibold text-lg mb-2 border-b border-gray-500 pb-1 flex items-center gap-2">
                                                        <Gamepad className="w-5 h-5" /> Game Details
                                                    </h3>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                        <div className="space-y-2">
                                                            <p><span className="font-semibold">Name:</span> {t.name}</p>
                                                            <p><span className="font-semibold">Description:</span> {t.description}</p>
                                                            <p>
                                                                <span className="font-semibold">Organizer:</span>{" "}
                                                                {t.organizer_id && typeof t.organizer_id === "object"
                                                                    ? `${t.organizer_id.firstName} ${t.organizer_id.lastName} (${t.organizer_id.email})`
                                                                    : t.organizer_id}
                                                            </p>
                                                            <p><span className="font-semibold">Game Type:</span> {t.game_type}</p>
                                                            <p><span className="font-semibold">Max Players:</span> {t.max_players}</p>
                                                            <p><span className="font-semibold">Entry Fee:</span> ₹{t.entry_fee}</p>
                                                            <p>
                                                                <span className="font-semibold">Prize Pool (Entry × Joined × 0.9):</span>{" "}
                                                                ₹{prizePoolMoney}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <p><span className="font-semibold">Start Time:</span> {new Date(t.start_datetime).toLocaleString()}</p>
                                                            <p><span className="font-semibold">End Time:</span> {new Date(t.end_datetime).toLocaleString()}</p>
                                                            <p><span className="font-semibold">Status:</span> {t.status}</p>
                                                            <p><span className="font-semibold">Pre-Joined Players:</span> {t.preJoined}</p>
                                                            <p><span className="font-semibold">Joined Players:</span> {t.joinedPlayers}</p>
                                                            {t.roomID && (
                                                                <p><span className="font-semibold">Room ID:</span> {t.roomID}</p>
                                                            )}
                                                            {t.password && (
                                                                <p><span className="font-semibold">Password:</span> {t.password}</p>
                                                            )}
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
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

                                                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center justify-center w-full sm:w-auto">
                                                            {/* 👤 Account Holder Name Card */}
                                                            {t.organizer_id?.accountHolderName && (
                                                                <div
                                                                    className="flex items-center justify-between gap-2 w-full sm:w-auto max-w-full sm:max-w-md px-3 py-2 rounded-lg shadow-md transition-all duration-300 border cursor-pointer text-[11px] sm:text-sm overflow-hidden"
                                                                    style={{
                                                                        backgroundColor: "#0D1117",
                                                                        color: "#00E5FF",
                                                                        borderColor: "#00E5FF",
                                                                        boxShadow: "0 0 8px #00E5FF",
                                                                        textShadow: "0 0 6px #00E5FF",
                                                                        wordBreak: "break-all",
                                                                    }}
                                                                >
                                                                    <p className="font-medium flex items-center gap-2 flex-wrap break-all text-center sm:text-left overflow-hidden text-ellipsis">
                                                                        <User size={12} className="text-[#00E5FF]" />
                                                                        <span className="font-semibold">Account Holder:</span>
                                                                        <span className="break-all">{t.organizer_id.accountHolderName}</span>
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* 💰 UPI ID Card */}
                                                            {t.organizer_id?.upiId && (
                                                                <div
                                                                    className="flex items-center justify-between gap-2 w-full sm:w-auto max-w-full sm:max-w-md px-3 py-2 rounded-lg shadow-md transition-all duration-300 border cursor-pointer text-[11px] sm:text-sm overflow-hidden"
                                                                    style={{
                                                                        backgroundColor: "#0D1117",
                                                                        color: "#00E5FF",
                                                                        borderColor: "#00E5FF",
                                                                        boxShadow: "0 0 8px #00E5FF",
                                                                        textShadow: "0 0 6px #00E5FF",
                                                                        wordBreak: "break-all",
                                                                    }}
                                                                >
                                                                    <p className="font-medium flex items-center gap-2 flex-wrap break-all text-center sm:text-left overflow-hidden text-ellipsis">
                                                                        <CreditCard size={12} className="text-[#00E5FF]" />
                                                                        <span className="font-semibold">UPI ID:</span>
                                                                        <span className="break-all">{t.organizer_id.upiId}</span>
                                                                    </p>

                                                                    <button
                                                                        onClick={() => handleCopy(t.organizer_id.upiId)}
                                                                        className="flex items-center gap-1 px-2 py-[2px] rounded-md border transition-all text-[10px] sm:text-xs shrink-0"
                                                                        style={{
                                                                            color: "#00E5FF",
                                                                            borderColor: "#00E5FF",
                                                                            backgroundColor: "transparent",
                                                                            boxShadow: "0 0 4px #00E5FF",
                                                                        }}
                                                                        title={copied ? "Copied!" : "Copy UPI ID"}
                                                                    >
                                                                        <Copy size={12} />
                                                                        {copied ? "Copied!" : "Copy"}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>
                                            )}

                                            {/* Players */}
                                            {activeSection === "players" && players?.length > 0 && (
                                                <div
                                                    className="overflow-x-auto rounded-lg"
                                                    style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}
                                                >
                                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2">
                                                        <Users className="w-5 h-5" /> Players ({players.length})
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
                            message={
                                <div className="space-y-3 text-sm sm:text-base text-gray-200">
                                    <p className="leading-relaxed">
                                        Are you sure you want to pre-join{" "}
                                        <span className="font-semibold text-cyan-400">
                                            "{selectedTournamentToJoin.name}"
                                        </span>
                                        ?
                                    </p>

                                    <div className="mt-2 p-3 sm:p-4 border border-cyan-800/50 rounded-xl bg-[#0D1117] shadow-md shadow-cyan-900/30">
                                        {/* Payment Instructions */}
                                        <p className="text-cyan-400 font-semibold mb-2">
                                            💸 Please send the entry fee before confirming:
                                        </p>

                                        {/* Account Holder */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-700/60 pb-2 mb-2">
                                            <p className="font-medium">
                                                <span className="text-gray-400">Account Holder:</span>{" "}
                                                <span className="text-white">
                                                    {selectedTournamentToJoin.organizer_id?.accountHolderName || "N/A"}
                                                </span>
                                            </p>
                                        </div>

                                        {/* UPI ID */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-700/60 pb-2 mb-2">
                                            <p className="font-medium">
                                                <span className="text-gray-400">UPI ID:</span>{" "}
                                                <span className="text-white">
                                                    {selectedTournamentToJoin.organizer_id?.upiId || "N/A"}
                                                </span>
                                            </p>
                                            {selectedTournamentToJoin.organizer_id?.upiId && (
                                                <button
                                                    onClick={() =>
                                                        handleCopy(selectedTournamentToJoin.organizer_id.upiId)
                                                    }
                                                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition text-sm font-medium"
                                                    title={copied ? 'Copied!' : 'Copy UPI ID'}
                                                >
                                                    <Copy size={14} />
                                                    {copied ? 'Copied' : 'Copy'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Entry Fee */}
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">
                                                <span className="text-gray-400">Entry Fee :</span>{" "}
                                                <span className="text-cyan-400 font-semibold">
                                                    ₹{selectedTournamentToJoin.entry_fee}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs sm:text-sm text-gray-400">
                                        Once payment is done, click <span className="text-cyan-400">Confirm</span> to
                                        complete your pre-join request.
                                    </p>
                                </div>
                            }

                            onCancel={() => setShowConfirmModal(false)}
                            onConfirm={async () => {
                                setShowConfirmModal(false);

                                // ✅ Safety check for missing data
                                if (!selectedTournamentToJoin?._id) {
                                    console.error("No tournament selected");
                                    return;
                                }
                                if (!user?._id) {
                                    console.error("User not logged in or user data missing");
                                    return;
                                }

                                try {
                                    await handleJoin(selectedTournamentToJoin._id, user._id);
                                    setSelectedTournamentToJoin(null);
                                } catch (error) {
                                    console.error("Error joining tournament:", error);
                                }
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
