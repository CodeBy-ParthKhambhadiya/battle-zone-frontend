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
    const [color, setColor] = useState(() => getRandomColor());
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
                colors[t._id] = getRandomColor();
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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
                <button
                    onClick={() => {
                        setOpen(true);
                        setEditMode(false);
                        setSelectedTournament(null);
                    }}
                    style={{
                        backgroundColor: color.bgColor,
                        color: color.textColor,
                    }}
                    className="hover:scale-105 px-5 py-2 rounded-lg font-semibold transition-all mt-4 sm:mt-0 shadow-md"
                >
                    Add Tournament
                </button>
            </div>

            {/* Loading / Error / Empty States */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={16} colorClass="text-blue-600" />
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

                                                        {/* 🖊️ Edit */}
                                                        <button
                                                            onClick={() => handleEditClick(t)}
                                                            className="p-2 rounded-md bg-black/20 hover:bg-black/30 transition cursor-pointer"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        {/* 🗑️ Delete */}
                                                        <button
                                                            onClick={() => handleDeleteClick(t._id)}
                                                            className="p-2 rounded-md bg-black/20 hover:bg-red-500/60 transition cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>


                                                        {/* ⬇ Expand */}
                                                        <button
                                                            onClick={() => toggleExpand(t._id)}
                                                            className="p-2 rounded-md bg-black/20 hover:bg-black/30 transition cursor-pointer"
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
      px-4 py-2 rounded-md border border-gray-400 
      font-medium text-sm shadow-sm
      transition-all duration-200 transform 
      bg-white/10 backdrop-blur-md
      hover:scale-[1.05] hover:shadow-lg hover:border-gray-300
      hover:bg-white/20 active:scale-[0.95]
      disabled:opacity-40 disabled:cursor-not-allowed
    `}
                            >
                                <ChevronLeft size={18} />
                                Prev
                            </button>

                            {/* Page Info */}
                            <span className="font-semibold text-sm px-4 py-2 bg-white/10 rounded-md border border-gray-300 shadow-sm">
                                Page {currentPage} of {totalPages}
                            </span>

                            {/* Next Button */}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`
      flex items-center justify-center gap-1 
      px-4 py-2 rounded-md border border-gray-400 
      font-medium text-sm shadow-sm
      transition-all duration-200 transform 
      bg-white/10 backdrop-blur-md
      hover:scale-[1.05] hover:shadow-lg hover:border-gray-300
      hover:bg-white/20 active:scale-[0.95]
      disabled:opacity-40 disabled:cursor-not-allowed
    `}
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
            <Modal open={open} onClose={() => setOpen(false)}>
                <CreateTournament
                    onClose={() => setOpen(false)}
                    editMode={editMode}
                    tournament={selectedTournament}
                />
            </Modal>
            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <EditTournament onClose={() => setEditOpen(false)} tournament={selectedTournament} />
            </Modal>
        </div>
    );
}
