"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getUser, updateUserLogo } from "@/app/utils/api";
import getToken from "@/app/utils/auth";
import { useRouter } from "next/navigation";

export default function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

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

  const handleUpdateUserLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = getToken();
    setUploading(true);
    try {
      const updatedUserData = await updateUserLogo(file, token);
      setUser((prev) => ({ ...prev, logo: updatedUserData.logo }));
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to update profile image.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = `bytoken=; Max-Age=0; path=/;`;
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 mx-auto my-6">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Image
            src={user?.logo || "/img/placeholder.png"}
            alt="Profile Image"
            width={150}
            height={150}
            className="rounded-full object-cover border-4 border-blue-500"
          />
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpdateUserLogo}
              className="hidden"
            />
            {uploading ? "Uploading..." : "Edit"}
          </label>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-500"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={`${user.name}${user.surnames ? ` ${user.surnames}` : ""}`}
              readOnly
              className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email}
              readOnly
              className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
