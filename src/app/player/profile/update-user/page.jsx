"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import CropperModal from "@/components/player/CropperModal";
import { LogOut, Upload } from "lucide-react";
import Link from "next/link";
import Toast from "@/utils/toast";
import { useTheme } from "@/context/ThemeContext"; // 🩵 Import ThemeContext hook

export default function ProfilePage() {
  const { updateUser, loading } = useAuth();
  const { bgColor, textColor } = useTheme() || {};

  const [userData, setUserData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);

  // user info
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("PLAYER");

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData(storedUser);
  }, []);

  useEffect(() => {
    if (userData) {
      setUserId(userData._id || "");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setMobile(userData.mobile || "");
      setAddress(userData.address || "");
      setGender(userData.gender || "");
      setBio(userData.bio || "");
      setRole(userData.role || "PLAYER");
      setAvatarPreview(userData.avatar || "");
    }
  }, [userData]);

  // 🖼️ Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl) => {
    setAvatarPreview(croppedImageUrl);
    setShowCropper(false);

    fetch(croppedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        setCroppedFile(file);
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        firstName,
        lastName,
        username,
        mobile,
        address,
        gender,
        bio,
        role,
        avatarFile: croppedFile,
      };

      await updateUser(userId, updatedData);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // 🎨 Themed styles
  const inputStyle = {
    // backgroundColor: textColor || "#1e1e1e",
    color: textColor || "#fff",
    border: `1px solid ${textColor || "#444"}`,
  };

  const labelStyle = {
    color: textColor || "#aaa",
  };

  const buttonStyle = {
    backgroundColor: textColor || "#444",
    color: "#fff",
  };

  const logoutStyle = {
    backgroundColor: "#dc2626", // red
    color: "#fff",
  };

  return (
    <div
      className="rounded-xl p-6 shadow-md transition-all duration-500"
      style={{
        backgroundColor: bgColor || "#121212",
        color: textColor || "#fff",
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
        Update Profile
      </h3>

      <form
        onSubmit={handleSave}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Avatar Preview & Upload */}
        <div className="flex items-center gap-6 mb-6">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full border object-cover"
              style={{ borderColor: textColor || "#555" }}
            />
          ) : (
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-secondary"
              style={{
                border: `1px solid ${textColor || "#555"}`,
                color: textColor || "#aaa",
              }}
            >
              No Avatar
            </div>
          )}

          {/* Upload Button */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-md shadow-md transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              style={{
                ...buttonStyle,
                backgroundColor: loading ? "#555" : textColor || "#444",
              }}
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Choose Image</span>
            </label>
          </div>
        </div>

        {showCropper && (
          <CropperModal
            imageSrc={rawImage}
            onCancel={() => setShowCropper(false)}
            onCropComplete={handleCropComplete}
          />
        )}

        {/* User Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "First Name", value: firstName, setter: setFirstName },
            { label: "Last Name", value: lastName, setter: setLastName },
            { label: "Username", value: username, setter: setUsername },
            { label: "Email", value: email, disabled: true },
            { label: "Mobile", value: mobile, setter: setMobile },
            { label: "Address", value: address, setter: setAddress },
          ].map((field, i) => (
            <div key={i}>
              <label className="block mb-1 text-sm" style={labelStyle}>
                {field.label}
              </label>
              <input
                type={field.label === "Email" ? "email" : "text"}
                value={field.value}
                disabled={field.disabled}
                onChange={(e) => field.setter && field.setter(e.target.value)}
                className="w-full p-2 rounded-md focus:outline-none focus:ring-2 transition-all"
                style={{
                  ...inputStyle,
                 
                }}
              />
            </div>
          ))}

          {/* Gender */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm" style={labelStyle}>
              Gender
            </label>
            <select
              className="w-full p-2 rounded-md focus:outline-none focus:ring-2 transition-all"
              style={inputStyle}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm" style={labelStyle}>
              Bio
            </label>
            <textarea
              className="w-full p-2 rounded-md focus:outline-none focus:ring-2 transition-all"
              style={inputStyle}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Submit + Logout */}
        <div className="flex justify-center mt-4 gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-2 rounded-md shadow-md transition-all duration-300"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <LoaderIcon className="animate-spin w-5 h-5" />
            ) : (
              "Update Changes"
            )}
          </button>

          <Link
            href="/auth/login"
            onClick={handleLogout}
            className="flex items-center gap-2 font-semibold px-4 py-2 rounded-md shadow-md transition-all duration-300"
            style={logoutStyle}
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </form>
    </div>
  );
}
