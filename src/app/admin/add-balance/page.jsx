"use client";

import { useEffect, useState } from "react";
import useWallet from "@/hooks/useWallet";
import LoaderIcon from "@/components/LoadingButton";

export default function UserListPage() {
  const { pendingTransactions, fetchPendingTransactions, loading } = useWallet();
  const [transactions, setTransactions] = useState([]);

  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  useEffect(() => {
    if (pendingTransactions && Array.isArray(pendingTransactions)) {
      setTransactions(pendingTransactions);
    }
  }, [pendingTransactions]);

  return (
    <div
      className="p-4 min-h-screen"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]" />
        <h1 className="text-2xl font-extrabold text-[#00E5FF] tracking-wide">
          User List
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No users found.</p>
      ) : (
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
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="transition duration-300 hover:bg-[#121822]"
                  style={{
                    borderBottom: `1px solid ${textColor}30`,
                    backgroundColor: "rgba(13, 17, 23, 0.8)",
                  }}
                >
                  <td className="py-3 px-4">{`${tx.userId?.firstName || ""} ${tx.userId?.lastName || ""}`}</td>
                  <td className="py-3 px-4">{tx.userId?.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
