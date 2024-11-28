"use client";

import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Barra lateral */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Barra superior */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Contenido dinámico */}
        <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
          {children}
        </main>
      </div>
    </div>
  );
}
