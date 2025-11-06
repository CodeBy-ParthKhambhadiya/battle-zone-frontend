"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import CropperModal from "@/components/player/CropperModal";
import { Asterisk, ChevronDown, LogOut, Upload } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function ProfilePage() {
  const { updateUser, loading } = useAuth();
  const { bgColor, textColor } = useTheme() || {};

  const [userData, setUserData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [error, setError] = useState("");

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
  const [accountHolderName, setAccountHolderName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      setAccountHolderName(userData.accountHolderName || "");
      setUpiId(userData.upiId || "");
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

  // 🧩 Validation
  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !mobile ||
      !address ||
      !gender ||
      !accountHolderName ||
      !upiId
    ) {
      setError("Please fill out all required fields before saving.");
      setTimeout(() => setError(""), 3000);
      return false;
    }

    const upiPattern = /^[\w.-]+@[\w.-]+$/;
    if (!upiPattern.test(upiId)) {
      setError("Please enter a valid UPI ID (e.g., name@bank).");
      setTimeout(() => setError(""), 3000);
      return false;
    }

    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        accountHolderName,
        upiId,
        avatarFile: croppedFile,
      };

      await updateUser(userId, updatedData);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // 🎨 Themed styles
  const inputStyle = {
    color: textColor || "#fff",
    border: `1px solid ${textColor || "#444"}`,
  };

  const labelStyle = {
    color: textColor || "#aaa",
  };

  const buttonStyle = {
    backgroundColor: textColor || "#444",
    color: "#000000ff",
  };

  const logoutStyle = {
    backgroundColor: "#dc2626",
    color: "#000000ff",
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
        {/* Avatar Section */}
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
            { label: "First Name", value: firstName, setter: setFirstName, required: true },
            { label: "Last Name", value: lastName, setter: setLastName, required: true },
            { label: "Username", value: username, setter: setUsername, required: true },
            { label: "Email", value: email, disabled: true, required: false },
            { label: "Mobile", value: mobile, setter: setMobile, required: true },
            // { label: "Address", value: address, setter: setAddress, required: true },
            { label: "Account Holder Name", value: accountHolderName, setter: setAccountHolderName, required: true },
            { label: "UPI ID", value: upiId, setter: setUpiId, required: true },
          ].map((field, i) => (
            <div key={i}>
              <label className="block mb-1 text-sm flex items-center gap-1" style={labelStyle}>
                {field.label}
                {field.required && <Asterisk size={12} className="text-red-500" />} {/* 🔴 asterisk icon */}
              </label>
              <input
                type="text"
                value={field.value}
                disabled={field.disabled}
                onChange={(e) => field.setter && field.setter(e.target.value)}
                className="w-full p-2 rounded-md focus:outline-none focus:ring-2 transition-all"
                style={inputStyle}
              />
            </div>
          ))}


          {/* Gender */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm flex items-center gap-1" style={labelStyle}>
              Gender <Asterisk size={12} className="text-red-500" />
            </label>

            <div className="relative w-full">
              <button
                type="button"
                className="w-full p-2 rounded-md border text-left flex justify-between items-center transition-all duration-200"
                style={{
                  borderColor: textColor,
                  color: textColor,
                  backgroundColor: "transparent",
                }}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {gender || "Select Gender"}
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  style={{ color: textColor }}
                />
              </button>

              <ul
                className={`absolute w-full mt-1 rounded-md overflow-hidden shadow-lg transition-all duration-300 origin-top z-10 ${dropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                  }`}
                style={{
                  backgroundColor: bgColor,
                  border: `1px solid ${textColor}`,
                }}
              >
                {["MALE", "FEMALE", "OTHER"].map((option) => (
                  <li
                    key={option}
                    className="p-2 cursor-pointer transition-all duration-200"
                    style={{
                      color: textColor,
                      border: "1px solid transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.border = `1px solid ${textColor}`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.border = "1px solid transparent")
                    }
                    onClick={() => {
                      setGender(option);
                      setDropdownOpen(false);
                    }}
                  >
                    {option.charAt(0) + option.slice(1).toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
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
        {error && (
          <div
            className="text-red-500 text-center mb-3 transition-opacity duration-500 ease-in-out"
            style={{ opacity: error ? 1 : 0 }}
          >
            {error}
          </div>
        )}

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
              <LoaderIcon className="animate-spin mx-auto w-5 h-5 text-black" />
            ) : (
              "Update"
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
