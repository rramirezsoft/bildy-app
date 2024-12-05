"use client";

import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/app/utils/api";
import getToken from "@/app/utils/auth";

export default function Header({ toggleSidebar }) {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const placeholder = "/img/placeholder.png";

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();

      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      try {
        const userData = await getUser(token);
        setUser(userData); // Guardamos los datos del usuario en el estado
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between gap-4 flex-wrap border-b border-gray-300">
      <button
        className="text-blue-700 p-2 rounded-full lg:hidden hover:bg-gray-100 transition"
        onClick={toggleSidebar}
      >
        <FaBars className="text-2xl" />
      </button>

      <input
        type="text"
        placeholder="Search..."
        className="flex-grow p-2 border border-gray-300 rounded-lg md:ml-12"
      />

      <Link href="/dashboard/user" className="flex items-center space-x-4">
        <Image
          src={user?.logo || placeholder}
          alt="User"
          className="h-10 w-10 rounded-full"
          width={40}
          height={40}
        />

        <span className="font-semibold">
          {user
            ? `${user.name}${user.surnames ? ` ${user.surnames}` : ""}`
            : "Loading..."}
        </span>
      </Link>
    </header>
  );
}
