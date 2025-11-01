"use client";

import React, { useState, useEffect } from "react";
import useTournament from "@/hooks/useTournament";
import { getRandomColor } from "@/components/getColor";
import LoaderIcon from "../LoadingButton";
import { PlusCircle, Trash2 } from "lucide-react";
import { getLocalDateTime } from "@/utils/getLocalTime";

export default function CreateTournament({ onClose }) {
    const { createTournament, loading } = useTournament();
    const [color, setColor] = useState({ bgColor: "#0D1117", textColor: "#00E5FF" });

    // useEffect(() => {
    //     setColor(getRandomColor());
    // }, []);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        game_type: "",
        max_players: "",
        start_datetime: "",
        end_datetime: "",
        status: "UPCOMING",
        prize_pool: "",
        rules: [""],
        roomID: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTournament(formData);
        onClose();
    };

    return (
        <div className="flex justify-center items-center w-full">
            {/* Outer wrapper with random background */}
            <div
                className="
    w-full max-w-3xl p-6 rounded-2xl shadow-2xl 
    max-h-[80vh] overflow-y-auto overflow-x-hidden
    scrollbar-thin transition-shadow duration-300
  "
                style={{
                    backgroundColor: color.bgColor,
                    color: color.textColor,
                    scrollbarColor: `${color.textColor} ${color.bgColor}`, // For Firefox
                }}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: Tournament Name | Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Tournament Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter tournament name"
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500
                  focus:outline-none focus:ring-2 transition"
                                style={{
                                    color: color.textColor,
                                    borderColor: color.textColor,
                                    focusRingColor: color.textColor,
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Short tournament description"
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500
                  focus:outline-none focus:ring-2 transition resize-none"
                                style={{
                                    color: color.textColor,
                                    borderColor: color.textColor,
                                    focusRingColor: color.textColor,

                                }}
                            />
                        </div>
                    </div>

                    {/* Row 2: Game Type | Max Players */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Game Type</label>
                            <input
                                type="text"
                                name="game_type"
                                value={formData.game_type}
                                onChange={handleChange}
                                placeholder="e.g. Battle Royale"
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                style={{
                                    color: color.textColor,
                                    borderColor: color.textColor,
                                }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Max Players</label>
                            <input
                                type="number"
                                name="max_players"
                                value={formData.max_players}
                                onChange={handleChange}
                                placeholder="Enter max players"
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                style={{
                                    color: color.textColor,
                                    borderColor: color.textColor,
                                }}
                            />
                        </div>
                    </div>

                    {/* Row 3: Start / End Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Start Time</label>
                            <input
                                type="datetime-local"
                                name="start_datetime"
                                value={
                                    formData.start_datetime
                                        ? getLocalDateTime(formData.start_datetime)
                                        : getLocalDateTime(new Date())
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        start_datetime: new Date(e.target.value).toISOString(), // store in UTC
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                style={{
                                    color: color.textColor,
                                    borderColor: color.textColor,
                                }}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">End Time</label>
                            <input
                                type="datetime-local"
                                name="end_datetime"
                                value={
                                    formData.end_datetime
                                        ? getLocalDateTime(formData.end_datetime)
                                        : getLocalDateTime(new Date())
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        end_datetime: new Date(e.target.value).toISOString(), // store in UTC
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                style={{
                                    color: color.textColor,
                                    borderColor: color.textColor,
                                }}
                            />
                        </div>
                    </div>

                    {/* Row 4: Prize Pool | Rules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-semibold">Prize Pool</label>
                            <input
                                type="number"
                                name="prize_pool"
                                value={formData.prize_pool}
                                onChange={handleChange}
                                placeholder="Enter prize amount"
                                className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                style={{
                                    color: color.textColor,
                                    borderColor: color.textColor,
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 font-semibold">Room ID</label>
                                <input
                                    type="text"
                                    name="roomID"
                                    value={formData.roomID}
                                    onChange={handleChange}
                                    placeholder="Enter room ID"
                                    className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                    style={{
                                        color: color.textColor,
                                        borderColor: color.textColor,
                                    }}
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
                                    className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                    style={{
                                        color: color.textColor,
                                        borderColor: color.textColor,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Rules</label>

                            {/* Scrollable rules list */}
                            <div
                                className={`${formData.rules.length > 3
                                    ? "max-h-[200px] overflow-y-auto pr-2 border border-gray-600 rounded-lg p-2"
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
                                            placeholder={`Rule ${index + 1}`}
                                            className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 transition"
                                            style={{
                                                color: color.textColor,
                                                borderColor: color.textColor,
                                            }}
                                        />

                                        {formData.rules.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = formData.rules.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, rules: updated });
                                                }}
                                                className="p-2 rounded-full hover:scale-110 transition"
                                                style={{
                                                    backgroundColor: "#dc2626", // red-600
                                                    color: "#fff",
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Rule Button */}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, rules: [...formData.rules, ""] })}
                                className="mt-2 px-4 py-2 rounded font-medium flex items-center gap-2 justify-center transition transform hover:scale-[1.05] active:scale-[0.95]"
                                style={{
                                    backgroundColor: color.bgColor,
                                    color: color.textColor,
                                    boxShadow: `0 4px 12px ${color.bgColor}80, 0 0 10px ${color.bgColor}60`,
                                }}
                            >
                                <PlusCircle size={18} />
                                Add Rule
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center items-center w-full">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold  flex justify-center items-center gap-1 transition transform hover:scale-[1.02]"
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
                            {loading ? (
                                <>
                                    <LoaderIcon size={5} colorClass="text-white" />
                                </>
                            ) : (
                                "Create Tournament"
                            )}
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
}
