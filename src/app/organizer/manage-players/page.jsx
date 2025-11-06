"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ChevronDown,
    ChevronUp,
    Users,
    Trophy,
    Timer,
    CheckCircle,
    XCircle,
    Check,
    X,
    Trash2,
} from "lucide-react";
import useTournament from "@/hooks/useTournament";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import getTimeLeft from "@/utils/getTimeLeft";
import ConfirmModal from "@/components/organizer/ConfirmModal";

export default function ManageTournamentPage() {
    const [expanded, setExpanded] = useState(null);
    const [tournamentColors, setTournamentColors] = useState({});
    const [activeTab, setActiveTab] = useState("leaderboard");

    const { ManagePendingPlayers, loading, error, confirmTournamentJoin, deleteTournamentJoin, fetchTournamentsPendingPlayerList } = useTournament();
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const handleApprove = async (joinId) => {
        await confirmTournamentJoin({ joinId });
    };

    const handleReject = async (joinId) => {
        await deleteTournamentJoin({ joinId });
    };

    const openModal = (type, id) => {
        setActionType(type);
        setSelectedPlayerId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setActionType(null);
        setSelectedPlayerId(null);
    };

    const handleConfirm = async () => {
        if (!selectedPlayerId) return;

        if (actionType === "approve") {
            await handleApprove(selectedPlayerId);
        } else if (actionType === "reject") {
            await handleReject(selectedPlayerId);
        }

        closeModal();
    };


    useEffect(() => {
        fetchTournamentsPendingPlayerList();
    }, []);

    // useEffect(() => {
    //     if (Array.isArray(ManagePendingPlayers) && ManagePendingPlayers.length > 0) {
    //         const colors = {};
    //         ManagePendingPlayers.forEach((t) => {
    //             if (!t || !t._id) return;
    //             colors[t._id] = getRandomColor();
    //         });
    //         setTournamentColors(colors);
    //     }
    // }, [ManagePendingPlayers]);
    useEffect(() => {
        if (Array.isArray(ManagePendingPlayers) && ManagePendingPlayers.length) {
            const colors = {};
            ManagePendingPlayers.forEach((t) => {
                colors[t._id] = {
                    bgColor: "#0D1117",  // dark background
                    textColor: "#00E5FF" // glowing cyan text
                };
            });
            setTournamentColors(colors);
        }
    }, [ManagePendingPlayers]);
    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6">
            {/* Header */}


            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-8 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00E5FF] tracking-wide drop-shadow-[0_0_8px_#00E5FF]">
                    Pending Players
                </h1>
            </div>

            {/* Loading / Error / Empty States */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
                </div>

            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : Array.isArray(ManagePendingPlayers) && ManagePendingPlayers.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {ManagePendingPlayers.map((tournament) => {
                        const isExpanded = expanded === tournament._id;
                        const { bgColor, textColor } = tournamentColors?.[tournament._id] || {
                            bgColor: "#0D1117",
                            textColor: "#00E5FF",
                        };

                        const now = new Date();
                        const startTime = new Date(tournament.start_datetime);
                        const endTime = new Date(tournament.end_datetime);

                        let statusLabel = "";
                        let statusColor = "";

                        if (tournament.status === "CANCELLED") {
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


                        // ✅ Player ratio for progress bar
                        const joinedPlayers = tournament.joinedPlayers || 0;
                        const maxPlayers = tournament.max_players || 1;
                        const pendingPlayers = tournament.pendingPlayers?.length || 0;
                        const confirmedPlayers = tournament.confirmedPlayers?.length || 0;
                        const progressPercent = Math.min(
                            (confirmedPlayers / maxPlayers) * 100,
                            100
                        );
                        const {
                            // joinedPlayers = 0,
                            entry_fee = 0
                        } = tournament;

                        // Initialize all prizes and counts to 0
                        let totalPool = 0, prizePoolMoney = 0, winnerPlayers = 0, winnerBottomPlayers = 0;
                        let bottomPlayersReturn = 0, leftoverMoney = 0, firstPrize = 0, secondPrize = 0, thirdPrize = 0, returnedPerPlayer = 0;

                        if (joinedPlayers > 0) {
                            totalPool = entry_fee * joinedPlayers;

                            if (tournament?.game_type === "CLASSIC") {
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

                            } else if (tournament?.game_type === "TDM") {
                                // Step 1: Remove 38% commission
                                const commission = totalPool * 0.38;
                                console.log("Commission:", commission);

                                const prizePoolMoney = totalPool - commission;

                                // Step 2: Determine how many players joined
                                const joinedPlayers = tournament?.joinedPlayers;

                                // Step 3: Initialize prizes

                                if (joinedPlayers === 7 || joinedPlayers === 8) {
                                    // 3 winners
                                    firstPrize = Math.floor(prizePoolMoney * 0.5);
                                    secondPrize = Math.floor(prizePoolMoney * 0.3);
                                    thirdPrize = Math.floor(prizePoolMoney * 0.2);
                                } else if (joinedPlayers >= 2 && joinedPlayers <= 6) {
                                    // Only 2 winners
                                    firstPrize = Math.floor(prizePoolMoney * 0.6);
                                    secondPrize = Math.floor(prizePoolMoney * 0.4);
                                    thirdPrize = 0;
                                } else if (joinedPlayers === 1) {
                                    // Only 1 player
                                    firstPrize = prizePoolMoney;
                                    secondPrize = 0;
                                    thirdPrize = 0;
                                }

                                // Step 4: Add leftover due to rounding to first prize
                                const distributedTotal = firstPrize + secondPrize + thirdPrize;
                                firstPrize += Math.floor(prizePoolMoney - distributedTotal);

                                // Step 5: No extra return for other players
                                const returnedPerPlayer = 0;

                                console.log("Prizes:", { firstPrize, secondPrize, thirdPrize });
                            }
                        }
                        return (
                            <div
                                key={tournament._id}
                                className="rounded-lg shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden"
                                style={{
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    borderColor: textColor,
                                    boxShadow: `0 0 5px ${textColor}`,
                                }}>
                                {/* Tournament Header */}
                                <div className="p-4 rounded-lg shadow-md w-full">
                                    <div className="flex sm:flex-row justify-between items-start sm:items-center gap-3">
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
                                                {tournament.prize_pool ? `₹${tournament.prize_pool}` : "Prize TBA"}
                                            </h2>
                                        </div>

                                        <div className="flex items-center gap-2">

                                            {/* <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                                            >
                                                {statusLabel}
                                            </span> */}
                                            <Link href={`/organizer/manage-players/${tournament._id}`}>
                                                <button
                                                    className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[11px] sm:text-sm transition-all duration-300"
                                                    style={{
                                                        color: "#00E5FF",
                                                        backgroundColor: "#0D1117",
                                                        border: "1px solid #00E5FF",
                                                        boxShadow: "0 0 6px #00E5FF",
                                                        textShadow: "0 0 5px #00E5FF",
                                                        width: "100%",
                                                    }}
                                                >
                                                    Messages
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => toggleExpand(tournament._id)}
                                                className="p-1 rounded transition cursor-pointer border"
                                                style={{
                                                    color: "#00E5FF",
                                                    borderColor: "#00E5FF",
                                                    backgroundColor: "#0D1117",
                                                    boxShadow: "0 0 6px #00E5FF",
                                                    textShadow: "0 0 8px #00E5FF",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow = "0 0 12px #00E5FF";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = "0 0 6px #00E5FF";
                                                }}
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* ✅ Improved Progress & Info Section */}
                                    <div className="mt-3 p-3 rounded-md bg-black/20 text-sm sm:text-base space-y-3">
                                        {/* Player & Progress Info */}
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <p className="font-semibold text-sm flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {joinedPlayers}/{maxPlayers} Players Joined
                                            </p>

                                            {/* Status + Timer */}
                                            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                                                <span
                                                    className="uppercase tracking-wide"
                                                    style={{ color: "#00E5FF" }}
                                                >
                                                    {statusLabel}
                                                </span>

                                                {statusLabel === "UPCOMING" && (
                                                    <span
                                                        className="text-[10px] sm:text-xs font-medium"
                                                        style={{ color: "#00E5FF" }}
                                                    >
                                                        Starts in {getTimeLeft(tournament.start_datetime) || "00:00:00"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pending / Confirmed Info */}
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <p className="text-xs opacity-80">
                                                {pendingPlayers} Pending | {confirmedPlayers} Confirmed
                                            </p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-300/40 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="h-2.5 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${progressPercent}%`,
                                                    backgroundColor: "#00E5FF",
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="p-4 border-t border-white/20 space-y-4 text-sm sm:text-base">
                                        {/* Tabs */}
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { key: "leaderboard", label: <><Trophy className="inline w-4 h-4 mr-1" />Leaderboard</> },
                                                { key: "details", label: "Details" },
                                                { key: "players", label: "Pending Players" },
                                                { key: "joined", label: "Joined Players" },
                                            ].map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => setActiveTab(tab.key)}
                                                    className={`px-3 py-1.5 rounded-md transition-all duration-300 cursor-pointer
                                                            ${activeTab === tab.key
                                                            ? "bg-[#0D1117] text-[#00E5FF] border border-[#00E5FF]"
                                                            : " border border-00E5FF hover:text-[#00E5FF] hover:border-[#00E5FF]"
                                                        }`}
                                                    style={{
                                                        boxShadow:
                                                            activeTab === tab.key
                                                                ? "0 0 10px #00E5FF"
                                                                : "0 0 6px rgba(0, 0, 0, 0.5)",
                                                        textShadow:
                                                            activeTab === tab.key
                                                                ? "0 0 8px #00E5FF"
                                                                : "none",
                                                        backgroundColor: activeTab === tab.key ? "#0D1117" : "transparent",
                                                        transition: "all 0.3s ease-in-out",
                                                    }}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                        {activeTab === "leaderboard" &&
                                            ((tournament.game_type === "CLASSIC" && tournament.joinedPlayers > 3) ||
                                                (tournament.game_type === "TDM" && tournament.joinedPlayers > 0)) && (
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
                                                        <h1 className="ml-auto font-medium">
                                                            {tournament?.joinedPlayers > 0
                                                                ? `Prize money will be distributed among ${tournament.joinedPlayers} players.`
                                                                : "Waiting for players to join..."}
                                                        </h1>
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

                                        {/* Details Tab */}
                                        {activeTab === "details" && (
                                            <div className="space-y-2 text-sm sm:text-base">
                                                <p>
                                                    <span className="font-semibold">Game Type:</span>{" "}
                                                    {tournament.game_type || "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Entry Fee:</span> ₹
                                                    {tournament.entry_fee || 0}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Prize Pool:</span> ₹
                                                    {tournament.prize_pool || "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Max Players:</span>{" "}
                                                    {tournament.max_players || "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Start Date & Time:</span>{" "}
                                                    {tournament.start_datetime
                                                        ? new Date(tournament.start_datetime).toLocaleString()
                                                        : "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">End Date & Time:</span>{" "}
                                                    {tournament.end_datetime
                                                        ? new Date(tournament.end_datetime).toLocaleString()
                                                        : "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Platform:</span>{" "}
                                                    {tournament.platform || "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Mode:</span>{" "}
                                                    {tournament.mode || "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Organizer:</span>{" "}
                                                    {tournament.organizer?.name || "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Rules:</span>{" "}
                                                    {Array.isArray(tournament.rules) && tournament.rules.length > 0
                                                        ? tournament.rules.join(", ")
                                                        : "N/A"}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">Description:</span>{" "}
                                                    {tournament.description || "No description provided."}
                                                </p>
                                            </div>
                                        )}

                                        {/* Pending Players Tab */}
                                        {activeTab === "players" && (
                                            <div
                                                className="rounded-lg"
                                                style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}
                                            >
                                                <h3 className="text-lg font-semibold border-b pb-1 mb-2 flex items-center gap-2">
                                                    <Users className="w-5 h-5" /> Pending Players (
                                                    {tournament.pendingPlayers?.length || 0})
                                                </h3>

                                                {tournament.pendingPlayers?.length > 0 ? (
                                                    <div className="overflow-x-auto w-full">
                                                        <table
                                                            className="min-w-full border-collapse text-center text-sm sm:text-base"
                                                            style={{
                                                                backgroundColor: bgColor,
                                                                color: textColor,
                                                                border: `1px solid ${textColor}`,
                                                            }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    {["#", "Avatar", "Name", "Email", "Status", "Confirmed"].map(
                                                                        (heading) => (
                                                                            <th
                                                                                key={heading}
                                                                                className="px-4 py-2 border text-center"
                                                                                style={{ borderColor: textColor }}
                                                                            >
                                                                                {heading}
                                                                            </th>
                                                                        )
                                                                    )}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tournament.pendingPlayers.map((p, index) => (
                                                                    <tr
                                                                        key={p._id}
                                                                        className="hover:bg-black/20 transition text-center"
                                                                    >
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {index + 1}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            <img
                                                                                src={p.player?.avatar || "/default-avatar.png"}
                                                                                alt={p.player?.firstName}
                                                                                className="w-10 h-10 rounded-full object-cover mx-auto"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {p.player?.firstName} {p.player?.lastName}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {p.player?.email}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {p.status}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            <div className="flex justify-center items-center gap-2">
                                                                                <button
                                                                                    onClick={() => openModal("approve", p._id)}
                                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium transition"
                                                                                >
                                                                                    <Check className="w-4 h-4" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => openModal("reject", p._id)}
                                                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-center opacity-80">No pending players found.</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Confirmed Players Tab */}
                                        {activeTab === "joined" && (
                                            <div
                                                className="rounded-lg"
                                                style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}
                                            >
                                                <h3 className="text-lg font-semibold border-b pb-1 mb-2 flex items-center gap-2">
                                                    <Users className="w-5 h-5" /> Confirmed Players (
                                                    {tournament.confirmedPlayers?.length || 0})
                                                </h3>

                                                {tournament.confirmedPlayers?.length > 0 ? (
                                                    <div className="overflow-x-auto w-full">
                                                        <table
                                                            className="min-w-full border-collapse text-center text-sm sm:text-base"
                                                            style={{
                                                                backgroundColor: bgColor,
                                                                color: textColor,
                                                                border: `1px solid ${textColor}`,
                                                            }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    {[
                                                                        "#",
                                                                        "Avatar",
                                                                        "Name",
                                                                        "Email",
                                                                        "Status",
                                                                        "Joined At",
                                                                        "Actions",
                                                                    ].map((heading) => (
                                                                        <th
                                                                            key={heading}
                                                                            className="px-4 py-2 border text-center"
                                                                            style={{ borderColor: textColor }}
                                                                        >
                                                                            {heading}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tournament.confirmedPlayers.map((p, index) => (
                                                                    <tr
                                                                        key={p._id}
                                                                        className="hover:bg-black/20 transition text-center"
                                                                    >
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {index + 1}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            <img
                                                                                src={p.player?.avatar || "/default-avatar.png"}
                                                                                alt={p.player?.firstName}
                                                                                className="w-10 h-10 rounded-full object-cover mx-auto"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {p.player?.firstName} {p.player?.lastName}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {p.player?.email}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            <span className="font-semibold">{p.status}</span>
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            {new Date(p.joinedAt).toLocaleString()}
                                                                        </td>
                                                                        <td className="px-4 py-2 border" style={{ borderColor: textColor }}>
                                                                            <button
                                                                                onClick={() => openModal("reject", p._id)}
                                                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition mx-auto"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-center opacity-80">No confirmed players found.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        );
                    })}
                    {showModal && (
                        <ConfirmModal
                            title={actionType === "approve" ? "Approve Player" : "Reject Player"}
                            message={
                                actionType === "approve"
                                    ? "Are you sure you want to approve this player?"
                                    : "Are you sure you want to reject this player?"
                            }
                            confirmText={actionType === "approve" ? "Approve" : "Reject"}
                            onConfirm={handleConfirm}
                            onCancel={closeModal}
                            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                        />
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500">No tournaments found.</p>
            )}
        </div>
    );
}
