"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getUser, updateProfileImage } from "@/app/utils/api";
import getToken from "@/app/utils/auth";

export default function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      try {
        const userData = await getUser(token);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = getToken();
    setUploading(true);
    try {
      const updatedUserData = await updateProfileImage(file, token); // Call API to update image
      setUser((prev) => ({ ...prev, logo: updatedUserData.logo }));
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to update profile image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        {/* Profile Image Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src={user?.logo || "/img/placeholder.png"}
              alt="Profile Image"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-blue-500"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
              {uploading ? "Uploading..." : "Edit"}
            </label>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Full Name</span>
            <p className="text-lg font-semibold text-gray-800">
              {user?.name} {user?.surnames}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Email</span>
            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
