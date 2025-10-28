"use client";

import { useEffect, useState } from "react";
import useTournament from "@/hooks/useTournament";
import { ChevronDown, ChevronUp, Home, Lock } from "lucide-react";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import useAuth from "@/hooks/useAuth";
import ConfirmModal from "@/components/player/ConfirmModal";
import { Trophy, Gamepad, FileText, User, Users, Copy } from 'lucide-react';
import getTimeLeft from "@/utils/getTimeLeft.js";

import Link from "next/link";
export default function JoinedPage() {
    const { tournaments, joinDetails, fetchJoinDetails, fetchTournaments, fetchAllTournamentChats, tournamentChats, loading } = useTournament();
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(null);
    const [tournamentColors, setTournamentColors] = useState({});
    const [activeSection, setActiveSection] = useState("leaderboard");
    const [copied, setCopied] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
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
        Array.isArray(joinDetails) &&
        joinDetails.some((join) => {
            // make sure join.tournament and join.player exist
            if (!join.tournament || !join.player || !user || !user._id) return false;

            // compare as strings (in case of ObjectId)
            return (
                String(join.tournament._id) === String(t._id) &&
                String(join.player._id) === String(user._id) &&
                join.status === "confirmed"
            );
        })
    );


    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // revert back after 2 seconds
    };
    const [ishandleCopyRoomIdAndPassword, setHandleCopyRoomIdAndPassword] = useState({ id: null, field: "" });

    const handleCopyRoomIdAndPassword = (value, field, tournamentId) => {
        navigator.clipboard.writeText(value);

        // set copied for specific tournament
        setHandleCopyRoomIdAndPassword({ id: tournamentId, field });

        // reset after 1.5 seconds
        setTimeout(() => setHandleCopyRoomIdAndPassword({ id: null, field: "" }), 1500);
    };


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
                        const {
                            joinedPlayers = 0,
                            entry_fee = 0
                        } = t;
                        const players = Array.isArray(joinDetails)
                            ? joinDetails
                                .filter(item => item?.tournament?._id && t?._id && item.tournament._id === t._id)
                                .map(item => item.player)
                            : [];

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
                        const now = new Date();
                        const startTime = new Date(t.start_datetime);
                        const endTime = new Date(t.end_datetime);

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
                            statusLabel = "UPCOMING";
                            statusColor = "bg-blue-700 text-white";
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
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusColor}`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${(t.joinedPlayers / t.max_players) * 100}%` }}
                                        ></div>
                                    </div>

                                    {/* Entry Fee, Prize Pool, Room Info */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                                            <p className="text-xs sm:text-sm">
                                                <span className="font-semibold">Entry Fee:</span> ₹{t.entry_fee}
                                            </p>

                                            <p className="text-xs sm:text-sm">
                                                <span className="font-semibold">Prize Pool:</span> ₹{firstPrize} / ₹{secondPrize} / ₹{thirdPrize} (1st / 2nd / 3rd)
                                            </p>
                                        </div>


                                    </div>

                                    {/* Joined button & Expand toggle */}
                                    <div
                                        className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3 p-3 rounded-lg"
                                    >
                                        {/* 🎮 Room Info Section */}
                                        {(t.roomID || t.password) && (
                                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                                                {/* 🏠 Room ID Card */}
                                                {t.roomID && (
                                                    <div
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                                                        style={{ backgroundColor: bgColor, color: textColor }}
                                                    >
                                                        <p className="text-xs sm:text-sm font-medium flex items-center gap-2">
                                                            <Home size={14} className="text-gray-700" />
                                                            <span className="font-semibold">Room ID:</span> {t.roomID}
                                                        </p>

                                                        <button
                                                            onClick={() =>
                                                                handleCopyRoomIdAndPassword(t.roomID, "roomID", t._id)
                                                            }
                                                            className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm rounded-md border border-gray-300 hover:bg-gray-200 transition-all"
                                                            style={{ color: textColor }}
                                                        >
                                                            <Copy size={14} />
                                                            {ishandleCopyRoomIdAndPassword.id === t._id && ishandleCopyRoomIdAndPassword.field === "roomID"
                                                                ? "Copied!"
                                                                : "Copy"}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* 🔐 Password Card */}
                                                {t.password && (
                                                    <div
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md transition-all duration-300"
                                                        style={{ backgroundColor: bgColor, color: textColor }}
                                                    >
                                                        <p className="text-xs sm:text-sm font-medium flex items-center gap-2">
                                                            <Lock size={14} className="text-gray-700" />
                                                            <span className="font-semibold">Password:</span> {t.password}
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                handleCopyRoomIdAndPassword(t.password, "password", t._id)
                                                            }
                                                            className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm rounded-md border border-gray-300 hover:bg-gray-200 transition-all"
                                                            style={{ color: textColor }}
                                                        >
                                                            <Copy size={14} />
                                                            {ishandleCopyRoomIdAndPassword.id === t._id && ishandleCopyRoomIdAndPassword.field === "password"
                                                                ? "Copied!"
                                                                : "Copy"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* 🎯 Action Buttons Section */}
                                        <div className="flex items-center gap-2">
                                            <Link href={`/player/joined/${t._id}`}>
                                                <button className="bg-green-600 text-white px-3 py-1 cursor-pointer rounded text-xs sm:text-sm">
                                                    Messages
                                                </button>
                                            </Link>

                                            <button
                                                disabled
                                                className="bg-blue-600 text-white px-3 py-1 cursor-not-allowed rounded text-xs sm:text-sm"
                                            >
                                                Joined
                                            </button>

                                            <button
                                                onClick={() => toggleExpand(t._id)}
                                                className="p-1 rounded transition btn-dark-shadow cursor-pointer"
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                </div>

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
                                                    <h3 className="font-semibold text-lg mb-2 border-b border-gray-500 pb-1 flex items-center gap-2">
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
                                                    <h3 className="font-semibold text-lg mb-2 border-b border-gray-500 pb-1 flex items-center gap-2">
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
                                                    <h3 className="font-semibold text-lg mb-2 border-b border-gray-500 pb-1 flex items-center gap-2">
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
                                                    className="p-4 rounded-lg"
                                                    style={{
                                                        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                                                    }}
                                                >
                                                    <h3 className="text-lg font-semibold border-b pb-1 mb-2 flex items-center gap-2">
                                                        <Users className="w-5 h-5" /> Joined Players ({players.length})
                                                    </h3>
                                                    <table
                                                        className="min-w-full border-collapse"
                                                        style={{
                                                            backgroundColor: bgColor,
                                                            color: textColor,
                                                            border: `1px solid ${textColor}`
                                                        }}
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
                                                                    <td className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>{p.firstName} {p.lastName}</td>
                                                                    <td className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>{p.gameUserName}</td>
                                                                    <td className="px-4 py-2 text-center" style={{ border: `1px solid ${textColor}` }}>{p.gameId}</td>
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
                </div>


            )}
        </div>
    );
}
