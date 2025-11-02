"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { ArrowUpDown, Search, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal"; // check your path!
import LoaderIcon from "@/components/LoadingButton";

export default function VerificationPage() {
    const { userList, loading, getUnverifiedUsers, verifyUser, deleteUser } = useAuth();

    const [sortedUsers, setSortedUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const bgColor = "#0D1117";
    const textColor = "#00E5FF";

    useEffect(() => {
        getUnverifiedUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally only on mount

    useEffect(() => {
        if (userList && Array.isArray(userList)) {
            setSortedUsers([...userList]);
        }
    }, [userList]);

    const handleToggle = async (user) => {
        try {
            await verifyUser(user._id, !user.isVerified);
        } catch (err) {
            console.error("Error verifying user:", err);
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sorted = [...sortedUsers].sort((a, b) => {
            const valA =
                key === "name"
                    ? `${a.firstName} ${a.lastName}`.toLowerCase()
                    : key === "status"
                        ? a.isVerified
                        : a[key]?.toString().toLowerCase() ?? "";

            const valB =
                key === "name"
                    ? `${b.firstName} ${b.lastName}`.toLowerCase()
                    : key === "status"
                        ? b.isVerified
                        : b[key]?.toString().toLowerCase() ?? "";

            if (valA < valB) return direction === "asc" ? -1 : 1;
            if (valA > valB) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortedUsers(sorted);
        setSortConfig({ key, direction });
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser._id);
            setShowConfirm(false);
            setSelectedUser(null);
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    const SortButton = ({ label, sortKey }) => (
        <button
            onClick={() => handleSort(sortKey)}
            className="flex items-center gap-1 hover:opacity-80 transition"
            style={{ color: textColor }}
        >
            {label}
            <ArrowUpDown size={14} />
        </button>
    );

    const filteredUsers = sortedUsers.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div
            className="p-2 min-h-screen"
            style={{
                backgroundColor: bgColor,
                color: textColor,
            }}
        >
            <div className="flex items-center gap-3 mb-8">
                {/* Glowing Accent Bar */}
                <div className="w-1.5 h-8 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]" />

                {/* Title */}
                <h1 className="text-2xl sm:text-xl md:text-3xl font-extrabold text-[#00E5FF] tracking-wide drop-shadow-[0_0_10px_#00E5FF]">
                    User Verification Panel                </h1>
            </div>
            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
                    style={{
                        border: `1px solid ${textColor}`,
                        boxShadow: `0 0 15px ${textColor}40`,
                        backgroundColor: "#121822",
                    }}
                >
                    <Search size={18} style={{ color: textColor }} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent outline-none text-sm w-64"
                        style={{ color: textColor }}
                    />
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
                </div>)}

            {!loading && filteredUsers.length === 0 && (
                <p className="text-center text-gray-500 text-lg">No users found.</p>
            )}

            {!loading && filteredUsers.length > 0 && (
                <div
                    className="overflow-x-auto rounded-2xl shadow-lg"
                    style={{
                        border: `1px solid ${textColor}`,
                        boxShadow: `0 0 20px ${textColor}40, 0 0 40px ${textColor}30`,
                    }}
                >
                    <table className="min-w-full bg-transparent text-left">
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: "#121822",
                                    color: textColor,
                                }}
                            >
                                <th className="py-3 px-4">
                                    <SortButton label="Name" sortKey="name" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="Email" sortKey="email" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="Role" sortKey="role" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="Status" sortKey="status" />
                                </th>
                                <th className="py-3 px-4 text-center">Toggle</th>
                                <th className="py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="transition duration-300 hover:bg-[#121822]"
                                    style={{
                                        borderBottom: `1px solid ${textColor}30`,
                                        backgroundColor: "rgba(13, 17, 23, 0.8)",
                                    }}
                                >
                                    <td className="py-3 px-4">{`${user.firstName} ${user.lastName}`}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4 capitalize">{user.role}</td>
                                    <td className="py-3 px-4">
                                        {user.isVerified ? (
                                            <span className="font-semibold" style={{ color: textColor }}>
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-gray-400">
                                                Not Verified
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={user.isVerified}
                                                onChange={() => handleToggle(user)}
                                            />
                                            <div
                                                className="w-14 h-8 rounded-full transition-all duration-300 peer-checked:shadow-[0_0_12px_#00E5FF] peer-checked:shadow-cyan-500/70"
                                                style={{
                                                    backgroundColor: user.isVerified
                                                        ? textColor
                                                        : "rgba(255,255,255,0.1)",
                                                    boxShadow: user.isVerified
                                                        ? `0 0 15px ${textColor}`
                                                        : `inset 0 0 5px #555`,
                                                }}
                                            ></div>
                                            <div
                                                className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 peer-checked:translate-x-6"
                                                style={{
                                                    boxShadow: user.isVerified
                                                        ? `0 0 10px ${textColor}`
                                                        : "none",
                                                }}
                                            ></div>
                                        </label>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            className="hover:opacity-80 transition"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowConfirm(true);
                                            }}
                                        >
                                            <Trash2
                                                size={20}
                                                style={{
                                                    color: "#FF4D4D",
                                                    filter: "drop-shadow(0 0 6px #FF4D4D)",
                                                }}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showConfirm && selectedUser && (
                <ConfirmModal
                    title="Delete User"
                    message={`Are you sure you want to delete "${selectedUser.firstName} ${selectedUser.lastName}"?`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => {
                        setShowConfirm(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
}
