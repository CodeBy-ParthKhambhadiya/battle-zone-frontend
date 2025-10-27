"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";

export default function AccountPage() {
  const { updateUser, loading } = useAuth();
  const [userData, setUserData] = useState({});
  const [accountHolderName, setAccountHolderName] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData(storedUser);
    setAccountHolderName(storedUser.accountHolderName || "");
    setUpiId(storedUser.upiId || "");
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userData._id, { accountHolderName, upiId });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-primary">Account Details</h3>
      <p className="text-secondary">Role: {userData.role || "PLAYER"}</p>
      <p className="text-secondary">
        Verified: {userData.isVerified ? "Yes" : "No"}
      </p>
      <p className="text-secondary">
        Joined: {new Date(userData?.createdAt).toLocaleDateString()}
      </p>

      <form onSubmit={handleSave} className="space-y-4 mt-4">
        <div>
          <label className="block text-secondary mb-1">Account Holder Name</label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="w-full p-2 rounded-md bg-primary border border-border focus:ring-2 focus:ring-accent-primary"
          />
        </div>

        <div>
          <label className="block text-secondary mb-1">UPI ID</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full p-2 rounded-md bg-primary border border-border focus:ring-2 focus:ring-accent-primary"
          />
        </div>

        <div className="md:col-span-2 flex justify-center mt-4">
                 <button
                   type="submit"
                   className={`flex items-center justify-center px-6 py-2 rounded-md text-white bg-gray-700 shadow-md hover:bg-gray-600 transition-all ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                   disabled={loading}
                 >
                   {loading ? (
                     <LoaderIcon className="animate-spin w-5 h-5" />
                   ) : (
                     "Save Changes"
                   )}
                 </button>
               </div>
      </form>
    </div>
  );
}
