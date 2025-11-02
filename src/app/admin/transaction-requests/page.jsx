"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Search, CheckCircle, XCircle, ChevronDown, Check, X } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import ConfirmModal from "@/components/admin/ConfirmModal";
import LoaderIcon from "@/components/LoadingButton";

export default function TransactionRequestsPage() {
    const {
        pendingTransactions,
        fetchPendingTransactions,
        approveTransaction,
        rejectTransaction,
        loading,
    } = useWallet();
    const dropdownRef = useRef();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [transactions, setTransactions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmType, setConfirmType] = useState("");

    const bgColor = "#0D1117";
    const textColor = "#00E5FF";

    useEffect(() => {
        fetchPendingTransactions();
    }, []);

    useEffect(() => {
        if (pendingTransactions && Array.isArray(pendingTransactions)) {
            setTransactions([...pendingTransactions]);
        }
    }, [pendingTransactions]);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sorted = [...transactions].sort((a, b) => {
            const valA = a[key]?.toString().toLowerCase() ?? "";
            const valB = b[key]?.toString().toLowerCase() ?? "";
            if (valA < valB) return direction === "asc" ? -1 : 1;
            if (valA > valB) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setTransactions(sorted);
        setSortConfig({ key, direction });
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

    // 🔍 Combine search + filter logic
    const filtered = transactions.filter((tx) => {
        const name = `${tx.userId?.firstName ?? ""} ${tx.userId?.lastName ?? ""}`.toLowerCase();
        const email = tx.userId?.email?.toLowerCase() ?? "";
        const type = tx.type?.toLowerCase() ?? "";
        const matchesSearch =
            name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase()) ||
            type.includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterType === "ALL" || tx.type?.toUpperCase() === filterType;
        return matchesSearch && matchesFilter;
    });

    const handleConfirmAction = async () => {
        if (!selectedTransaction) return;
        try {
            if (confirmType === "approve") {
                await approveTransaction({
                    transactionId: selectedTransaction._id,
                    remark: "Transferred successfully to UPI",
                });
            } else if (confirmType === "reject") {
                await rejectTransaction({
                    transactionId: selectedTransaction._id,
                    remark: "Rejected by admin",
                });
            }
            setShowConfirm(false);
            setSelectedTransaction(null);
            fetchPendingTransactions();
        } catch (err) {
            console.error("Error processing transaction:", err);
        }
    };

    return (
        <div
            className="p-2 min-h-screen"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <div className="flex items-center gap-3 mb-8">
                {/* Glowing Accent Bar */}
                <div className="w-1.5 h-8 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]" />

                {/* Title */}
                <h1 className="text-2xl sm:text-xl md:text-3xl font-extrabold text-[#00E5FF] tracking-wide drop-shadow-[0_0_10px_#00E5FF]">
                    Transaction Requests
                </h1>
            </div>

            {/* 🔎 Search + Filter Bar */}
            <div
                className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between items-center gap-2 sm:gap-4 mb-6 w-full max-w-3xl mx-auto"
            >
                {/* Search Input */}
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-full shadow-md flex-1 min-w-[160px] sm:min-w-[250px]"
                    style={{
                        border: `1px solid ${textColor}`,
                        boxShadow: `0 0 10px ${textColor}40`,
                        backgroundColor: "#121822",
                    }}
                >
                    <Search size={16} className="flex-shrink-0" style={{ color: textColor }} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent outline-none text-xs sm:text-sm w-full"
                        style={{ color: textColor }}
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="relative flex-shrink-0 w-[130px] sm:w-[180px]" ref={dropdownRef}>
                    <button
                        type="button"
                        className="w-full px-3 py-2 rounded-full border text-left focus:outline-none focus:ring-2 flex justify-between items-center cursor-pointer transition-all duration-200 text-xs sm:text-sm"
                        style={{
                            borderColor: textColor,
                            color: textColor,
                            backgroundColor: "#121822",
                            boxShadow: `0 0 12px ${textColor}40`,
                        }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {filterType === "ALL"
                            ? "All"
                            : filterType === "WITHDRAWAL"
                                ? "Withdrawal"
                                : "Deposit"}
                        <span
                            className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
                                }`}
                        >
                            <ChevronDown size={16} style={{ color: textColor }} />
                        </span>
                    </button>

                    {/* Dropdown List */}
                    <ul
                        className={`absolute w-full mt-2 rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top z-20 ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                            }`}
                        style={{
                            backgroundColor: bgColor,
                            border: `1px solid ${textColor}`,
                            boxShadow: `0 0 15px ${textColor}40`,
                        }}
                    >
                        {["ALL", "WITHDRAWAL", "DEPOSIT"].map((option) => (
                            <li
                                key={option}
                                className="p-2 text-xs sm:text-sm cursor-pointer transition-all duration-200"
                                style={{
                                    color: textColor,
                                    border: "1px solid transparent",
                                    backgroundColor: "#0D1117",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#121822";
                                    e.currentTarget.style.border = `1px solid ${textColor}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0D1117";
                                    e.currentTarget.style.border = "1px solid transparent";
                                }}
                                onClick={() => {
                                    setFilterType(option);
                                    setDropdownOpen(false);
                                }}
                            >
                                {option === "ALL"
                                    ? "All Transactions"
                                    : option === "WITHDRAWAL"
                                        ? "Withdrawal"
                                        : "Deposit"}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>



            {loading && (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <p className="text-center text-gray-500 text-lg">
                    No pending transactions.
                </p>
            )}

            {!loading && filtered.length > 0 && (
                <div
                    className="overflow-x-auto rounded-2xl shadow-lg"
                    style={{
                        border: `1px solid ${textColor}`,
                        boxShadow: `0 0 20px ${textColor}40, 0 0 40px ${textColor}30`,
                    }}
                >
                    <table className="min-w-full bg-transparent text-left">
                        <thead>
                            <tr style={{ backgroundColor: "#121822", color: textColor }}>
                                <th className="py-3 px-4">
                                    <SortButton label="User" sortKey="user" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="Email" sortKey="email" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="Type" sortKey="type" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="Amount" sortKey="amount" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="UTR Number" sortKey="utrNumber" />
                                </th>
                                <th className="py-3 px-4">
                                    <SortButton label="User Message" sortKey="userMessage" />
                                </th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((tx) => (
                                <tr
                                    key={tx._id}
                                    className="transition duration-300 hover:bg-[#121822]"
                                    style={{
                                        borderBottom: `1px solid ${textColor}30`,
                                        backgroundColor: "rgba(13, 17, 23, 0.8)",
                                    }}
                                >
                                    <td className="py-3 px-4">{`${tx.userId?.firstName} ${tx.userId?.lastName}`}</td>
                                    <td className="py-3 px-4">{tx.userId?.email}</td>
                                    <td className="py-3 px-4">{tx.type}</td>
                                    <td className="py-3 px-4 font-semibold">₹{tx.amount}</td>
                                    <td className="py-3 px-4 text-sm">
                                        {tx.type === "DEPOSIT"
                                            ? tx.utrNumber || "–"
                                            : "–"}
                                    </td>
                                    <td className="py-3 px-4 text-sm italic">{tx.userMessage || "-"}</td>
                                    <td className="py-3 px-4 text-sm">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center gap-3">
                                            {/* Approve Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedTransaction(tx);
                                                    setConfirmType("approve");
                                                    setShowConfirm(true);
                                                }}
                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500/20 hover:bg-green-500/30 transition"
                                            >
                                                <Check size={18} className="text-green-400 drop-shadow-[0_0_6px_#4ADE80]" />
                                            </button>

                                            {/* Reject Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedTransaction(tx);
                                                    setConfirmType("reject");
                                                    setShowConfirm(true);
                                                }}
                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/30 transition"
                                            >
                                                <X size={18} className="text-red-400 drop-shadow-[0_0_6px_#FF4D4D]" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showConfirm && selectedTransaction && (
                <ConfirmModal
                    title={
                        confirmType === "approve"
                            ? "Approve Transaction"
                            : "Reject Transaction"
                    }
                    message={`Are you sure you want to ${confirmType} this transaction of ₹${selectedTransaction.amount}?`}
                    confirmText={confirmType === "approve" ? "Approve" : "Reject"}
                    cancelText="Cancel"
                    onConfirm={handleConfirmAction}
                    onCancel={() => {
                        setShowConfirm(false);
                        setSelectedTransaction(null);
                    }}
                />
            )}
        </div>
    );
}
