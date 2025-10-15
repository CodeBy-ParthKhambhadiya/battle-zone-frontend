// /src/app/player/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { User, Medal, Swords } from "lucide-react";
// import useUser from "@/hooks/useUser";

export default function PlayerProfilePage() {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("PLAYER");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(""); // For preview
  const [avatarFile, setAvatarFile] = useState(null); // For uploading to backend

    const { user, loading} = useAuth();
    console.log("🚀 ~ PlayerProfilePage ~ user:", user)

  // useEffect(() => {
  //   // Fetch user on component mount
  //   fetchUser();
  // }, []);
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Updated profile:", { name, email });
      // TODO: call API to save profile
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tabs with icons
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "game", label: "Game", icon: Swords },
    { id: "account", label: "Account", icon: Medal },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 md:p-6 bg-background text-text-primary">
      {/* Sidebar / Top Tabs */}
      <aside className="flex md:flex-col w-full md:w-64 mb-4 md:mb-0 bg-surface rounded-xl p-2 md:p-4 shadow-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-4 py-2 md:mb-2 rounded-md transition-all duration-300 transform hover:scale-105 cursor-pointer ${selectedTab === tab.id
                ? "bg-accent-primary text-white shadow-md"
                : "hover:bg-primary hover:text-accent-primary"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Content */}
      <main className="flex-1 space-y-6 ml-2">
        {selectedTab === "profile" && (
          <div className="bg-surface rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-primary">Update Profile</h3>
            <form onSubmit={handleSave} className="space-y-6">

              {/* Avatar Preview */}
              <div className="flex flex-col items-center">
                {/* Avatar Preview */}
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-32 h-32 rounded-full border border-border object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border border-border flex items-center justify-center mb-4 text-secondary">
                    No Avatar
                  </div>
                )}

                {/* File input */}
                <input
                  type="file"
                  accept="image/*"
                  className="mb-2"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Preview the selected image
                      const reader = new FileReader();
                      reader.onloadend = () => setAvatarPreview(reader.result);
                      reader.readAsDataURL(file);

                      // Save file for uploading to backend
                      setAvatarFile(file);
                    }
                  }}
                />
              </div>


              {/* Other Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-secondary mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-secondary mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-secondary mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={email}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-secondary mb-1">Mobile</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-secondary mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-secondary mb-1">Gender</label>
                  <select
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-secondary mb-1">Role</label>
                  <select
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="PLAYER">Player</option>
                    <option value="ADMIN">Admin</option>
                    <option value="ORGANIZER">Organizer</option>
                  </select>
                </div>

                {/* Bio full width */}
                <div className="md:col-span-2">
                  <label className="block text-secondary mb-1">Bio</label>
                  <textarea
                    className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`mt-4 px-4 py-2 rounded-md text-white bg-accent-primary hover:bg-indigo-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>


        )}

        {selectedTab === "game" && (
          <div className="bg-surface rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-primary">Game Details</h3>
            <p className="text-secondary">Total Tournaments Joined: 12</p>
            <p className="text-secondary">Wins: 4</p>
            <p className="text-secondary">Current Rank: Diamond</p>
          </div>
        )}

        {selectedTab === "account" && (
          <div className="bg-surface rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-primary">Account Details</h3>
            <p className="text-secondary">Role: {user?.role || "PLAYER"}</p>
            <p className="text-secondary">Verified: {user?.isVerified ? "Yes" : "No"}</p>
            <p className="text-secondary">
              Joined: {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
