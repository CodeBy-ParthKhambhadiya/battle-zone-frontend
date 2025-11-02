"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import useWallet from "@/hooks/useWallet";
import LoaderIcon from "@/components/LoadingButton";
import { useTheme } from "@/context/ThemeContext";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AccountPage() {
  const { updateUser, loading: userLoading } = useAuth();
  const { bgColor, textColor } = useTheme() || {};
  const { createTransaction, fetchMyTransactions } = useWallet();

  const [userData, setUserData] = useState({});
  const [upiId, setUpiId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [balance, setBalance] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const [depositData, setDepositData] = useState({
    amount: "",
    utrNumber: "",
    userMessage: "",
  });
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    userMessage: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filteredTransactions =
    filterType === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData(storedUser);
    setUpiId(storedUser.upiId || "");
    setBalance(storedUser.walletBalance || 0);
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await fetchMyTransactions();
      if (res?.payload) {
        setTransactions(res.payload);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userData._id, { upiId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const { amount, utrNumber, userMessage } = depositData;

    setFormLoading(true);
    try {
      await createTransaction({ type: "DEPOSIT", amount, utrNumber, userMessage });
      await loadTransactions();
      setDepositData({ amount: "", utrNumber: "", userMessage: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const { amount, userMessage } = withdrawData;

    setFormLoading(true);
    try {
      await createTransaction({ type: "WITHDRAWAL", amount, userMessage });
      await loadTransactions();
      setWithdrawData({ amount: "", userMessage: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const inputStyle = {
    color: textColor || "#fff",
    border: `1px solid ${textColor || "#444"}`,
  };
  const labelStyle = { color: textColor || "#aaa" };
  const buttonStyle = {
    backgroundColor: textColor || "#444",
    color: "#000000ff",
  };

  return (
    <div
      className="rounded-xl p-3 shadow-md transition-all duration-500 space-y-6"
      style={{
        backgroundColor: bgColor || "#121212",
        color: textColor || "#fff",
      }}
    >
      {/* 💰 Wallet Section */}
      <div className="mt-6 p-4 rounded-md border" style={{ borderColor: textColor || "#444" }}>
        <h2 className="text-lg font-semibold mb-2">Wallet Balance</h2>
        <p className="text-2xl font-bold mb-4">₹{balance}</p>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowDeposit(!showDeposit);
              setShowWithdraw(false);
            }}
            style={buttonStyle}
            className="px-4 py-2 rounded-md font-medium shadow-md"
          >
            Deposit
          </button>
          <button
            onClick={() => {
              setShowWithdraw(!showWithdraw);
              setShowDeposit(false);
            }}
            style={buttonStyle}
            className="px-4 py-2 rounded-md font-medium shadow-md"
          >
            Withdraw
          </button>
        </div>

        {/* Deposit Form */}
        {showDeposit && (
          <form onSubmit={handleDeposit} className="mt-4 space-y-3">
            <input
              type="number"
              placeholder="Amount"
              value={depositData.amount}
              onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
              className="w-full p-2 rounded-md"
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="UTR Number"
              value={depositData.utrNumber}
              onChange={(e) => setDepositData({ ...depositData, utrNumber: e.target.value })}
              className="w-full p-2 rounded-md"
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Message (e.g., Paid via Paytm)"
              value={depositData.userMessage}
              onChange={(e) => setDepositData({ ...depositData, userMessage: e.target.value })}
              className="w-full p-2 rounded-md"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2 rounded-md shadow-md transition-all"
              style={{ ...buttonStyle, opacity: formLoading ? 0.7 : 1 }}
            >
              {formLoading ? "Processing..." : "Submit Deposit"}
            </button>
          </form>
        )}

        {/* Withdraw Form */}
        {showWithdraw && (
          <form onSubmit={handleWithdraw} className="mt-4 space-y-3">
            <input
              type="number"
              placeholder="Amount"
              value={withdrawData.amount}
              onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
              className="w-full p-2 rounded-md"
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Message (e.g., Send to UPI test@upi)"
              value={withdrawData.userMessage}
              onChange={(e) => setWithdrawData({ ...withdrawData, userMessage: e.target.value })}
              className="w-full p-2 rounded-md"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2 rounded-md shadow-md transition-all"
              style={{ ...buttonStyle, opacity: formLoading ? 0.7 : 1 }}
            >
              {formLoading ? "Processing..." : "Submit Withdrawal"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-6">

        <div
          className="flex sm:flex-row sm:items-center sm:justify-between mb-4 gap-2"
        >
          {/* Left: Title */}
          <h2 className="text-lg font-semibold">Transaction History</h2>

          {/* Right: Dropdown Filter */}
          <div
            className="relative flex-shrink-0 w-auto sm:w-[180px]"
          >
            <button
              type="button"
              className="px-3 py-2 rounded-full border text-left focus:outline-none focus:ring-2 flex justify-between items-center cursor-pointer transition-all duration-200 text-xs sm:text-sm w-auto sm:w-full"
              style={{
                borderColor: textColor,
                color: textColor,
                backgroundColor: "#121822",
                boxShadow: `0 0 12px ${textColor}40`,
                whiteSpace: "nowrap", // prevent wrapping on narrow text
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
                  } ml-2`}
              >
                <ChevronDown size={16} style={{ color: textColor }} />
              </span>
            </button>

            {/* Dropdown List */}
            <ul
              className={`absolute w-max sm:w-full right-0 mt-2 rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top z-20 ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
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
                  className="p-2 text-xs sm:text-sm cursor-pointer transition-all duration-200 whitespace-nowrap"
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

        {/* 🧩 Filtered Transaction List */}
        {filteredTransactions.length === 0 ? (
          <p className="text-sm opacity-80">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((t) => {
              const isExpanded = expandedId === t._id;
              return (
                <div
                  key={t._id}
                  className="p-4 rounded-md border shadow-sm transition-all hover:shadow-md"
                  style={{ borderColor: textColor || "#333" }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-base">
                        {t.type} — <span className="uppercase">{t.status}</span>
                      </p>
                      <p className="text-sm opacity-70">
                        {new Date(t.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(t._id)}
                      className="p-1 rounded transition cursor-pointer border hover:shadow-[0_0_12px_#00E5FF]"
                      style={{
                        color: "#00E5FF",
                        borderColor: "#00E5FF",
                        backgroundColor: "#0D1117",
                        boxShadow: "0 0 6px #00E5FF",
                        textShadow: "0 0 8px #00E5FF",
                      }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div
                      className="mt-4 p-3 rounded-md border text-sm transition-all duration-300 grid sm:grid-cols-2 gap-3"
                      style={{
                        borderColor: "#00E5FF",
                        backgroundColor: "rgba(13, 17, 23, 0.6)",
                        boxShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
                      }}
                    >
                      <div className="pl-3">
                        <p>
                          <span className="font-medium opacity-80">Amount:</span> ₹{t.amount}
                        </p>
                        <p>
                          <span className="font-medium opacity-80">UTR:</span>{" "}
                          {t.utrNumber || "—"}
                        </p>
                        <p>
                          <span className="font-medium opacity-80">User Message:</span>{" "}
                          {t.userMessage || "—"}
                        </p>
                        <p>
                          <span className="font-medium opacity-80">System Message:</span>{" "}
                          {t.systemMessage || "—"}
                        </p>
                      
                        <p>
                          <span className="font-medium opacity-80">Updated At:</span>{" "}
                          {new Date(t.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>


    </div>
  );
}
