"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import LoaderIcon from "@/components/LoadingButton";
import CropperModal from "@/components/player/CropperModal";
import { Upload } from 'lucide-react';

export default function ProfilePage() {
  const { updateUser, loading } = useAuth();

  const [userData, setUserData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("PLAYER");
  const [userId, setUserId] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);   // Final cropped file to upload

  // Load user data from localStorage
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
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImage(reader.result);  // show in cropper modal
        setShowCropper(true);        // open cropper
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCropComplete = (croppedImageUrl) => {
    setAvatarPreview(croppedImageUrl); // update preview
    setShowCropper(false);              // close cropper

    // Convert the cropped URL to File, but DO NOT call updateUser yet
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        setCroppedFile(file); // store the cropped file for later save
      });
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
        avatarFile: croppedFile, // the cropped file prepared earlier
      };

      await updateUser(userId, updatedData); // now it’s called on Save click
      console.log("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-primary">Update Profile</h3>
      <form
        onSubmit={handleSave}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Avatar Preview & Upload */}
        <div className="flex items-center gap-6 mb-6">
          {/* Avatar Preview */}
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border border-border flex items-center justify-center text-secondary">
              No Avatar
            </div>
          )}

          {/* Upload Button */}
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
    className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-md text-white bg-gray-700 shadow-md hover:bg-gray-600 transition-all ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    {/* Upload Icon (always visible) */}
    <Upload className="w-5 h-5" />
    
    {/* Text: hidden on small screens, visible on sm+ */}
    <span className="hidden sm:inline ml-2">Choose Image</span>
  </label>
</div>


        </div>

        {/* Cropper Modal */}
        {showCropper && (
          <CropperModal
            imageSrc={rawImage}
            onCancel={() => setShowCropper(false)}
            onCropComplete={handleCropComplete}
          />
        )}

        {/* User Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-secondary mb-1">First Name</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-secondary mb-1">Last Name</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-secondary mb-1">Username</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-secondary mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={email}
              disabled
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-secondary mb-1">Mobile</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-secondary mb-1">Address</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="md:col-span-2">
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



          {/* Bio (full width) */}
          <div className="md:col-span-2">
            <label className="block text-secondary mb-1">Bio</label>
            <textarea
              className="w-full p-2 rounded-md bg-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
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
