"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    ChevronUp,
    Users,
    Gamepad,
    FileText,
    Clock,
    Trophy,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    Timer,
} from "lucide-react";
import Modal from "@/components/organizer/Modal";
import CreateTournament from "@/components/organizer/CreateTournament";
import useTournament from "@/hooks/useTournament";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "@/components/LoadingButton";
import EditTournament from "@/components/organizer/EditTournament";
import ConfirmModal from "@/components/player/ConfirmModal";
import getTimeLeft from "@/utils/getTimeLeft";

export default function ManageTournamentPage() {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [tournamentColors, setTournamentColors] = useState({});
    const [activeTab, setActiveTab] = useState("details");
    const [color, setColor] = useState({
        bgColor: "#0D1117",   // Dark background for consistency
        textColor: "#00E5FF", // Glowing cyan text
        border: `1px solid #00E5FF55`,
        boxShadow: `0 0 15px #00E5FF33`,
    });
    const [editOpen, setEditOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // Pagination
    const [countdowns, setCountdowns] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const tournamentsPerPage = 5;

    const {
        organizerTournaments,
        loading,
        error,
        fetchOrganizerTournamentsList,
        deleteTournament, // ✅ must exist in your useTournament hook
        updateTournament,
    } = useTournament();

    useEffect(() => {
        fetchOrganizerTournamentsList();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!organizerTournaments || organizerTournaments.length === 0) return;

            const updatedCountdowns = {};
            organizerTournaments.forEach((t) => {
                updatedCountdowns[t._id] = getTimeLeft(t.start_datetime);
            });

            setCountdowns(updatedCountdowns);
        }, 1000);

        return () => clearInterval(interval); // cleanup on unmount
    }, [organizerTournaments]);

    useEffect(() => {
        if (Array.isArray(organizerTournaments) && organizerTournaments.length > 0) {
            const colors = {};
            organizerTournaments.forEach((t) => {
                if (!t || !t._id) return;

                // Apply consistent glowing cyan theme
                colors[t._id] = {
                    bgColor: "#0D1117",   // Dark background
                    textColor: "#00E5FF", // Cyan text glow
                    border: `1px solid #00E5FF55`,
                    boxShadow: `0 0 15px #00E5FF22`,
                };
            });

            setTournamentColors(colors);
        }
    }, [organizerTournaments]);


    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const totalTournaments = organizerTournaments?.length || 0;
    const totalPages = Math.ceil(totalTournaments / tournamentsPerPage);
    const startIndex = (currentPage - 1) * tournamentsPerPage;
    const currentTournaments =
        organizerTournaments?.slice(startIndex, startIndex + tournamentsPerPage) || [];

    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);



    // 🗑 Delete tournament

    const handleDeleteClick = (tournamentId) => {
        setSelectedId(tournamentId);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteTournament(selectedId); // delete single tournament
            setConfirmOpen(false);
            setSelectedId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setSelectedId(null);
    };
    const handleEditClick = (t) => {
        setSelectedTournament(t);
        setEditOpen(true);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div
                className="
    flex flex-wrap items-center justify-between 
    gap-3 mb-6
  "
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-[#00E5FF]">
                    Tournaments
                </h1>

                <button
                    onClick={() => {
                        setOpen(true);
                        setEditMode(false);
                        setSelectedTournament(null);
                    }}
                    style={{
                        color: "#00E5FF",
                        backgroundColor: "#0D1117",
                        border: "1px solid #00E5FF",
                        boxShadow: "0 0 6px #00E5FF",
                        textShadow: "0 0 5px #00E5FF",
                    }}
                    className="
      hover:scale-105 
      px-3 py-1.5 sm:px-5 sm:py-2 
      rounded-lg font-semibold 
      text-sm sm:text-base
      transition-all shadow-md
    "
                >
                    Add Tournament
                </button>
            </div>


            {/* Loading / Error / Empty States */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
                </div>

            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {Array.isArray(currentTournaments) &&
                            currentTournaments
                                .filter((t) => t && t._id) // remove null/undefined or missing _id
                                .map((t) => {
                                    const isExpanded = expanded === t._id;

                                    // Use optional chaining for safety
                                    const { bgColor, textColor } =
                                        tournamentColors?.[t._id] || {
                                            bgColor: "bg-blue-600",
                                            textColor: "text-white",
                                        };

                                    const now = new Date();
                                    const startTime = new Date(t.start_datetime);
                                    const endTime = new Date(t.end_datetime);
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

                                    return (
                                        <div
                                            key={t._id}
                                            className="rounded-lg shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden"
                                            style={{
                                                backgroundColor: bgColor,
                                                color: textColor,
                                                borderColor: textColor,
                                                boxShadow: `0 0 5px ${textColor}`,
                                            }}>
                                            <div className="p-4 rounded-lg shadow-md w-full">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                    <div>
                                                        <h2 className="text-xl font-bold">{t.name}</h2>
                                                        <p className="text-sm opacity-90">{t.description}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col items-end sm:items-center gap-0.5">
                                                            {statusLabel === "UPCOMING" && (
                                                                <span
                                                                    className="text-[10px] sm:text-xs font-medium"
                                                                    style={{
                                                                        color: "#00E5FF",
                                                                    }}
                                                                >
                                                                    Starts in {getTimeLeft(t.start_datetime) || "00:00:00"}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                                                        >
                                                            {statusLabel}
                                                        </span>

                                                        {/* 🖊️ Edit */}
                                                        <button
                                                            onClick={() => handleEditClick(t)}
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
                                                            className="p-1 rounded transition cursor-pointer border"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        {/* 🗑️ Delete */}
                                                        <button
                                                            onClick={() => handleDeleteClick(t._id)}
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
                                                            className="p-1 rounded transition cursor-pointer border"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>

                                                        {/* ⬇ Expand */}
                                                        <button
                                                            onClick={() => toggleExpand(t._id)}
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

                                                {/* Joined/Left Progress */}
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
                                                            {
                                                                key: "details",
                                                                label: (
                                                                    <>
                                                                        <FileText className="inline w-4 h-4 mr-1" /> Details
                                                                    </>
                                                                ),
                                                            },
                                                            {
                                                                key: "game",
                                                                label: (
                                                                    <>
                                                                        <Gamepad className="inline w-4 h-4 mr-1" /> Game Info
                                                                    </>
                                                                ),
                                                            },
                                                            {
                                                                key: "players",
                                                                label: (
                                                                    <>
                                                                        <Users className="inline w-4 h-4 mr-1" /> Players
                                                                    </>
                                                                ),
                                                            },
                                                            {
                                                                key: "time",
                                                                label: (
                                                                    <>
                                                                        <Clock className="inline w-4 h-4 mr-1" /> Schedule
                                                                    </>
                                                                ),
                                                            },
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

                                                            <div>
                                                                <span className="font-semibold">Rules:</span>{" "}
                                                                {t.rules && t.rules.length > 0 ? (
                                                                    <ul className="list-disc list-inside mt-1">
                                                                        {t.rules.map((rule, index) => (
                                                                            <li key={index}>{rule}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <span>No rules specified</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                    )}


                                                    {activeTab === "players" && (
                                                        <div className="space-y-1">
                                                            <p>
                                                                <span className="font-semibold">Currently Joined:</span>{" "}
                                                                {t.joinedPlayers}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold">Slots Left:</span>{" "}
                                                                {t.max_players - t.joinedPlayers}
                                                            </p>
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-3">
                            {/* Previous Button */}
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className={`
        flex items-center justify-center gap-1
        px-4 py-2 rounded-md font-medium text-sm
        transition-all duration-200 transform
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
                                style={{
                                    color: "#00E5FF",
                                    border: "1px solid #00E5FF",
                                    backgroundColor: "rgba(13, 17, 23, 0.8)",
                                    boxShadow:
                                        currentPage === 1
                                            ? "none"
                                            : "0 0 8px rgba(0, 229, 255, 0.6)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#00E5FF";
                                    e.currentTarget.style.color = "#0D1117";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(13, 17, 23, 0.8)";
                                    e.currentTarget.style.color = "#00E5FF";
                                }}
                            >
                                <ChevronLeft size={18} />
                                Prev
                            </button>

                            {/* Page Info */}
                            <span
                                className="font-semibold text-sm px-4 py-2 rounded-md shadow-sm"
                                style={{
                                    backgroundColor: "rgba(13, 17, 23, 0.8)",
                                    color: "#00E5FF",
                                    border: "1px solid #00E5FF",
                                    boxShadow: "0 0 6px rgba(0, 229, 255, 0.4)",
                                }}
                            >
                                Page {currentPage} of {totalPages}
                            </span>

                            {/* Next Button */}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`
        flex items-center justify-center gap-1
        px-4 py-2 rounded-md font-medium text-sm
        transition-all duration-200 transform
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
                                style={{
                                    color: "#00E5FF",
                                    border: "1px solid #00E5FF",
                                    backgroundColor: "rgba(13, 17, 23, 0.8)",
                                    boxShadow:
                                        currentPage === totalPages
                                            ? "none"
                                            : "0 0 8px rgba(0, 229, 255, 0.6)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#00E5FF";
                                    e.currentTarget.style.color = "#0D1117";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(13, 17, 23, 0.8)";
                                    e.currentTarget.style.color = "#00E5FF";
                                }}
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                </>
            )}
            {confirmOpen && (
                <ConfirmModal
                    title="Delete Tournament"
                    message="Are you sure you want to delete this tournament? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {/* Modal */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={editMode ? "Edit Tournament" : "Create Tournament"} // dynamic title
            >
                <CreateTournament
                    onClose={() => setOpen(false)}
                    editMode={editMode}
                    tournament={selectedTournament}
                />
            </Modal>

            <Modal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                title="Edit Tournament Details" // static title for edit modal
            >
                <EditTournament
                    onClose={() => setEditOpen(false)}
                    tournament={selectedTournament}
                />
            </Modal>

        </div>
    );
}
