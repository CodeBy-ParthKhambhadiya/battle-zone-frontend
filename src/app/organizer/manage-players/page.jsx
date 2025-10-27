"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
    ChevronDown,
    ChevronUp,
    Users,
    Gamepad,
    FileText,
    Clock,
    Trophy,
    Timer,
} from "lucide-react";
import useTournament from "@/hooks/useTournament";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import getTimeLeft from "@/utils/getTimeLeft";

export default function ManageTournamentPage() {
    const [expanded, setExpanded] = useState(null);
    const [tournamentColors, setTournamentColors] = useState({});
    const [activeTab, setActiveTab] = useState("details");
    const [countdowns, setCountdowns] = useState({});

    const { organizerTournaments, pendingPlayers, joinDetails, loading, error, fetchJoinDetails, fetchTournamentsPendingPlayerList, fetchOrganizerTournamentsList } =
        useTournament();
    console.log("🚀 ~ ManageTournamentPage ~ pendingPlayers:", pendingPlayers)

    useEffect(() => {
        fetchOrganizerTournamentsList();
        fetchJoinDetails();
        fetchTournamentsPendingPlayerList();
    }, []);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (!organizerTournaments || organizerTournaments.length === 0) return;

    //         const updatedCountdowns = {};
    //         organizerTournaments.forEach((t) => {
    //             updatedCountdowns[t._id] = getTimeLeft(t.start_datetime);
    //         });

    //         setCountdowns(updatedCountdowns);
    //     }, 1000);

    //     return () => clearInterval(interval); // cleanup on unmount
    // }, [organizerTournaments]);
    useEffect(() => {
        if (Array.isArray(organizerTournaments) && organizerTournaments.length > 0) {
            const colors = {};
            organizerTournaments.forEach((t) => {
                if (!t || !t._id) return;
                colors[t._id] = getRandomColor();
            });
            setTournamentColors(colors);
        }
    }, [organizerTournaments]);

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tournaments Overview</h1>
            </div>

            {/* Loading / Error / Empty States */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={16} colorClass="text-blue-600" />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {Array.isArray(organizerTournaments) &&
                        organizerTournaments
                            .filter((t) => t && t._id)
                            .map((t) => {
                                const isExpanded = expanded === t._id;
                                const { bgColor, textColor } = tournamentColors?.[t._id] || {
                                    bgColor: "#3b82f6",
                                    textColor: "#fff",
                                };

                                const now = new Date();
                                const start = new Date(t.start_datetime);
                                const end = new Date(t.end_datetime);

                                let statusLabel = "";
                                let statusColor = "";

                                if (t.status === "CANCELLED") {
                                    statusLabel = "CANCELLED";
                                    statusColor = "bg-red-700 text-white";
                                } else if (now < start) {
                                    statusLabel = "UPCOMING";
                                    statusColor = "bg-blue-700 text-white";
                                } else if (now >= start && now <= end) {
                                    statusLabel = "ONGOING";
                                    statusColor = "bg-green-700 text-white";
                                } else {
                                    statusLabel = "COMPLETED";
                                    statusColor = "bg-gray-600 text-white";
                                }
                                   const players = joinDetails?.filter(item => item.tournament._id === t._id)
                            .map(item => item.player) || [];
                                   console.log("🚀 ~ ManageTournamentPage ~ players:", players)

                                return (
                                    <div
                                        key={t._id}
                                        className="rounded-lg shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden"
                                        style={{ backgroundColor: bgColor, color: textColor }}
                                    >
                                        <div className="p-4 rounded-lg shadow-md w-full">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <div>
                                                    <h2 className="text-xl font-bold">{t.name}</h2>
                                                    <p className="text-sm opacity-90">{t.description}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col items-end sm:items-center gap-0.5">
                                                        {statusLabel === "UPCOMING" && (
                                                            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-700">
                                                                <Timer size={12} className="text-gray-600" />
                                                                Starts in {getTimeLeft(t.start_datetime) || "00:00:00"}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                                                    >
                                                        {statusLabel}
                                                    </span>

                                                    {/* Expand Button */}
                                                    <Link href={`/organizer/manage-players/${t._id}`}>
                                                        <button className="bg-green-600 text-white px-3 py-1 cursor-pointer rounded text-xs sm:text-sm">
                                                            Messages
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleExpand(t._id)}
                                                        className="p-2 rounded-md bg-black/20 hover:bg-black/30 transition cursor-pointer"
                                                    >
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Joined Players Progress */}
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
                                        </div>

                                        {/* Expanded Section */}
                                        {isExpanded && (
                                            <div className="p-4 border-t border-white/20 space-y-4 text-sm sm:text-base">
                                                {/* Tabs */}
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { key: "details", label: "Details" },
                                                        { key: "game", label: "Game Info" },
                                                        { key: "players", label: "Players" },
                                                        { key: "time", label: "Schedule" },
                                                    ].map((tab) => (
                                                        <button
                                                            key={tab.key}
                                                            onClick={() => setActiveTab(tab.key)}
                                                            className={`px-3 py-1.5 rounded-md font-semibold transition-all duration-200 ${activeTab === tab.key
                                                                ? "bg-black/40 border border-white/30"
                                                                : "bg-transparent hover:bg-black/20"
                                                                }`}
                                                        >
                                                            {tab.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Tab Content */}
                                                {activeTab === "details" && (
                                                    <div className="space-y-1">
                                                        <p>
                                                            <span className="font-semibold">Description:</span>{" "}
                                                            {t.description || "No description."}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Status:</span> {t.status}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">Entry Fee:</span> ₹
                                                            {t.entry_fee}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <Trophy size={16} />
                                                            <span className="font-semibold">Prize Pool:</span> ₹
                                                            {t.prize_pool}
                                                        </p>
                                                    </div>
                                                )}

                                                {activeTab === "game" && (
                                                    <div className="space-y-2 mt-2">
                                                        <p>
                                                            <span className="font-semibold">Game Type:</span>{" "}
                                                            {t.game_type || "N/A"}
                                                        </p>

                                                        <p>
                                                            <span className="font-semibold">Rules:</span>{" "}
                                                            {t.rules && t.rules.length > 0 ? (
                                                                <ul className="list-disc list-inside mt-1">
                                                                    {t.rules.map((rule, index) => (
                                                                        <li key={index}>{rule}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                "No rules specified"
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                              {activeTab === "players" && players?.length > 0 && (
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


                                                {activeTab === "time" && (
                                                    <div>
                                                        <p>
                                                            <span className="font-semibold">Start:</span>{" "}
                                                            {new Date(t.start_datetime).toLocaleString()}
                                                        </p>
                                                        <p>
                                                            <span className="font-semibold">End:</span>{" "}
                                                            {new Date(t.end_datetime).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
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
