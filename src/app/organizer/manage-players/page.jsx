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
    const [activeTab, setActiveTab] = useState("details");

    const { ManagePendingPlayers, loading, error, confirmTournamentJoin, deleteTournamentJoin, fetchTournamentsPendingPlayerList } = useTournament();
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);

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

    useEffect(() => {
        if (Array.isArray(ManagePendingPlayers) && ManagePendingPlayers.length > 0) {
            const colors = {};
            ManagePendingPlayers.forEach((t) => {
                if (!t || !t._id) return;
                colors[t._id] = getRandomColor();
            });
            setTournamentColors(colors);
        }
    }, [ManagePendingPlayers]);

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };


    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Pending Player Management</h1>
            </div>

            {/* Loading / Error / Empty States */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={16} colorClass="text-blue-600" />
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : Array.isArray(ManagePendingPlayers) && ManagePendingPlayers.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {ManagePendingPlayers.map((tournament) => {
                        const isExpanded = expanded === tournament._id;
                        const { bgColor, textColor } = tournamentColors?.[tournament._id] || {
                            bgColor: "#3b82f6",
                            textColor: "#fff",
                        };

                        const now = new Date();
                        const start = new Date(tournament.start_datetime);
                        const end = new Date(tournament.end_datetime);

                        let statusLabel = "";
                        let statusColor = "";

                        if (tournament.status === "CANCELLED") {
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

                        // ✅ Player ratio for progress bar
                        const joinedPlayers = tournament.joinedPlayers || 0;
                        const maxPlayers = tournament.max_players || 1;
                        const pendingPlayers = tournament.pendingPlayers?.length || 0;
                        const confirmedPlayers = tournament.confirmedPlayers?.length || 0;
                        const progressPercent = Math.min(
                            (confirmedPlayers / maxPlayers) * 100,
                            100
                        );
                        return (
                            <div
                                key={tournament._id}
                                className="rounded-lg shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden"
                                style={{ backgroundColor: bgColor, color: textColor }}
                            >
                                {/* Tournament Header */}
                                <div className="p-4 rounded-lg shadow-md w-full">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div>
                                            <h2 className="text-xl font-bold">{tournament.name}</h2>
                                            <p className="text-sm opacity-90">{tournament.game_type}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {statusLabel === "UPCOMING" && (
                                                <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-700">
                                                    <Timer size={12} className="text-gray-600" />
                                                    Starts in {getTimeLeft(tournament.start_datetime) || "00:00:00"}
                                                </span>
                                            )}
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                                            >
                                                {statusLabel}
                                            </span>
                                            <Link href={`/organizer/manage-players/${tournament._id}`}>
                                                <button className="bg-green-600 text-white px-3 py-1 cursor-pointer rounded text-xs sm:text-sm">
                                                    Messages
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => toggleExpand(tournament._id)}
                                                className="p-2 rounded-md bg-black/20 hover:bg-black/30 transition cursor-pointer"
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* ✅ Improved Progress & Info Section */}
                                    <div className="mt-3 p-3 rounded-md bg-black/20 text-sm sm:text-base space-y-3">
                                        {/* Player & Progress Info */}
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <div>
                                                <p className="font-semibold text-sm flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {joinedPlayers}/{maxPlayers} Players Joined
                                                </p>
                                                <p className="text-xs opacity-80">
                                                    {pendingPlayers} Pending | {confirmedPlayers} Confirmed
                                                </p>
                                            </div>

                                            {/* Status + Timer */}
                                            <div className="flex flex-col sm:items-end gap-1">
                                                {statusLabel === "UPCOMING" && (
                                                    <span className={`flex items-center gap-1 text-xs font-medium ${textColor}`}>
                                                        <Timer size={12} className="text-gray-300" />
                                                        Starts in {getTimeLeft(tournament.start_datetime) || "00:00:00"}
                                                    </span>
                                                )}
                                               
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-300/40 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercent}%` }}
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
                                                { key: "details", label: "Details" },
                                                { key: "players", label: "Pending Players" },
                                                { key: "joined", label: "Joined Players" },
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
                                                className="p-4 rounded-lg"
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
                                                className="p-4 rounded-lg"
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
