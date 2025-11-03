"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function UserListPage() {
  const { userList, loading, getUnverifiedUsers, updateUser } = useAuth(); // make sure updateUser exists in your hook

  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");

  const bgColor = "#0D1117";
  const textColor = "#00E5FF";

  useEffect(() => {
    getUnverifiedUsers();
  }, []);

  // Filtered list based on search term
  const filteredUsers =
    userList?.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Handle wallet update confirmation
  const handleWalletUpdate = async () => {

    if (!selectedUser || !amount) return;

    const newBalance =
      (Number(selectedUser.walletBalance) || 0) + Number(amount);

    await updateUser(selectedUser._id, { walletBalance: newBalance });

    setShowConfirm(false);
    setSelectedUser(null);
    setAmount("");
  };
  return (
    <div
      className="p-4 min-h-screen"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#00E5FF] rounded-full shadow-[0_0_10px_#00E5FF]" />
          <h1 className="text-2xl font-extrabold text-[#00E5FF] tracking-wide">
            User List
          </h1>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[#121822] border border-[#00E5FF50] text-[#00E5FF] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00E5FF]"
        />
      </div>

      {/* Loader or Empty */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoaderIcon size={85} colorClass="text-[#00E5FF]" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No users found.</p>
      ) : (
        // Table
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
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4">Wallet</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="transition duration-300 hover:bg-[#121822]"
                  style={{
                    borderBottom: `1px solid ${textColor}30`,
                    backgroundColor: "rgba(13, 17, 23, 0.8)",
                  }}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{`${user.firstName || ""} ${user.lastName || ""
                    }`}</td>
                  <td className="py-3 px-4">{user.email || "-"}</td>
                  <td className="py-3 px-4">{user.mobile || "-"}</td>
                  <td className="py-3 px-4">{user.gender || "-"}</td>
                  <td className="py-3 px-4 capitalize">{user.role || "-"}</td>
                  <td className="py-3 px-4">
                    {user.isVerified ? (
                      <span className="text-green-400 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-400 font-semibold">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{user.walletBalance ?? 0}</td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Add Money Button */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowConfirm(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#00E5FF20] border border-[#00E5FF70] hover:bg-[#00E5FF40] transition text-[#00E5FF]"
                    >
                      Add Money
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && selectedUser && (
        <ConfirmModal
          title="Add Wallet Balance"
          message={
            <div className="space-y-3 text-center">
              <p>
                Enter the amount to add for{" "}
                <strong>
                  {selectedUser.firstName} {selectedUser.lastName}
                </strong>
              </p>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-[#00E5FF70] rounded-lg bg-[#121822] text-[#00E5FF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]"
              />
            </div>
          }
          confirmText="Add"
          cancelText="Cancel"
          onConfirm={handleWalletUpdate}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedUser(null);
            setAmount("");
          }}
        />
      )}
    </div>
  );
}
