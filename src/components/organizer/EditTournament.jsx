"use client";

import React, { useState, useEffect } from "react";
import useTournament from "@/hooks/useTournament";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "../LoadingButton";

export default function EditTournament({ onClose, tournament }) {
    const { updateTournament, loading } = useTournament();
    const [color, setColor] = useState({ bgColor: "#1f2937", textColor: "#fff" });

    useEffect(() => {
        setColor(getRandomColor());
    }, []);

    // 🧩 Initialize form
    const [formData, setFormData] = useState({
        name: tournament?.name || "",
        description: tournament?.description || "",
        game_type: tournament?.game_type || "",
        max_players: tournament?.max_players || "",
        start_datetime: tournament?.start_datetime || "",
        end_datetime: tournament?.end_datetime || "",
        status: tournament?.status || "UPCOMING",
        prize_pool: tournament?.prize_pool || "",
        rules:
            Array.isArray(tournament?.rules) && tournament.rules.length > 0
                ? tournament.rules
                : [""],
        roomID: tournament?.roomID || "",
        password: tournament?.password || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (tournament._id) {
                await updateTournament({ tournamentId: tournament._id, formData });
            }
            onClose();
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <div className="flex justify-center items-center w-full">
            <div
                className="w-full max-w-3xl p-6 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 transition-shadow duration-300"
                style={{
                    backgroundColor: color.bgColor,
                    color: color.textColor,
                    boxShadow: `0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px ${color.bgColor}80`,
                }}
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Edit Tournament</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 🏷 Tournament Name & Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Tournament Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition resize-none"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                    </div>

                    {/* 🎮 Game Type & Max Players */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Game Type</label>
                            <input
                                type="text"
                                name="game_type"
                                value={formData.game_type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Max Players</label>
                            <input
                                type="number"
                                name="max_players"
                                value={formData.max_players}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                    </div>

                    {/* ⏰ Start & End Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Start Time</label>
                            <input
                                type="datetime-local"
                                name="start_datetime"
                                value={
                                    formData.start_datetime
                                        ? formData.start_datetime.slice(0, 16)
                                        : ""
                                }
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        start_datetime: new Date(e.target.value).toISOString(),
                                    }))
                                }
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">End Time</label>
                            <input
                                type="datetime-local"
                                name="end_datetime"
                                value={
                                    formData.end_datetime
                                        ? formData.end_datetime.slice(0, 16)
                                        : ""
                                }
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        end_datetime: new Date(e.target.value).toISOString(),
                                    }))
                                }
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                    </div>

                    {/* 💰 Prize Pool & Rules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Prize Pool</label>
                            <input
                                type="number"
                                name="prize_pool"
                                value={formData.prize_pool}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Rules</label>
                            <div
                                className={`max-h-[190px] overflow-y-auto pr-1 ${
                                    formData.rules.length > 3
                                        ? "border border-gray-600 rounded-lg p-2"
                                        : ""
                                }`}
                            >
                                {formData.rules.map((rule, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={rule}
                                            onChange={(e) => {
                                                const updated = [...formData.rules];
                                                updated[index] = e.target.value;
                                                setFormData({ ...formData, rules: updated });
                                            }}
                                            className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                            style={{
                                                color: color.textColor,
                                                borderColor: color.textColor,
                                            }}
                                        />
                                        {formData.rules.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = formData.rules.filter(
                                                        (_, i) => i !== index
                                                    );
                                                    setFormData({ ...formData, rules: updated });
                                                }}
                                                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({ ...formData, rules: [...formData.rules, ""] })
                                }
                                className="mt-2 px-4 py-2 rounded font-medium transition transform hover:scale-[1.05]"
                                style={{
                                    backgroundColor: color.bgColor,
                                    color: color.textColor,
                                    boxShadow: `0 3px 10px ${color.bgColor}70`,
                                }}
                            >
                                ➕ Add Rule
                            </button>
                        </div>
                    </div>

                    {/* 🆕 Room ID & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Room ID</label>
                            <input
                                type="text"
                                name="roomID"
                                value={formData.roomID}
                                onChange={handleChange}
                                placeholder="Enter room ID"
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Password</label>
                            <input
                                type="text"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter room password"
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none transition"
                                style={{ color: color.textColor, borderColor: color.textColor }}
                            />
                        </div>
                    </div>

                    {/* 🚀 Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-semibold mt-6 flex justify-center items-center gap-2 transition transform hover:scale-[1.02]"
                        style={{
                            backgroundColor: loading ? "#4b5563" : color.bgColor,
                            color: color.textColor,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? (
                            <LoaderIcon size={5} colorClass="text-white" />
                        ) : (
                            "Update Tournament"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
