"use client";

import {
  FaUsers,
  FaProjectDiagram,
  FaFileInvoice,
  FaCog,
  FaChartPie,
} from "react-icons/fa";
import Image from "next/image";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Superposición */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside>
        {/* Menú lateral */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-900 border-r border-gray-300 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform lg:translate-x-0 lg:static lg:min-h-screen z-40`}
        >
          {/* Logo de Bildy */}
          <div className="sidebar-header flex items-center justify-center py-6 border-b border-gray-300">
            <Image
              src="/img/logo_bildy.png"
              alt="Bildy Logo"
              className="sidebar-logo w-40"
              width={160}
              height={40}
            />
          </div>

          {/* Navegación */}
          <nav className="space-y-4 p-4">
            {/* Overview */}
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">
              Overview
            </p>

            {/* Sección de Resumen */}
            <div>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FaChartPie className="text-blue-500" />
                <span className="font-medium">Resumen</span>
              </a>
            </div>

            {/* Sección de Clients */}
            <div>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FaUsers className="text-blue-500" />
                <span className="font-medium">Clients</span>
              </a>
            </div>

            {/* Sección de Projects */}
            <div>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FaProjectDiagram className="text-blue-500" />
                <span className="font-medium">Projects</span>
              </a>
            </div>

            {/* Sección de Delivery Notes */}
            <div>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FaFileInvoice className="text-blue-500" />
                <span className="font-medium">Delivery Notes</span>
              </a>
            </div>

            {/* Sección de Settings */}
            <div>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FaCog className="text-blue-500" />
                <span className="font-medium">Settings</span>
              </a>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
