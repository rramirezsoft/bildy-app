"use client";

import {
  FaUsers,
  FaProjectDiagram,
  FaFileInvoice,
  FaCog,
  FaChartPie,
  FaWarehouse,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname(); // Obtenemos la ruta actual

  // Función para verificar si la ruta actual coincide con la de un enlace
  const isActive = (path) =>
    pathname === path
      ? "bg-blue-100 text-blue-700"
      : "hover:bg-gray-100 text-gray-900";

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
            <Link href="/dashboard">
              <Image
                src="/img/logo_bildy.png"
                alt="Bildy Logo"
                className="sidebar-logo w-40"
                width={160}
                height={40}
              />
            </Link>
          </div>

          {/* Navegación */}
          <nav className="space-y-4 p-4">
            {/* Overview */}
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">
              Overview
            </p>

            {/* Sección de Resumen */}
            <div>
              <Link
                href="/dashboard/resume"
                className={`flex items-center space-x-3 p-2 rounded-lg transition ${isActive(
                  "/dashboard/resume"
                )}`}
              >
                <FaChartPie className="text-blue-500" />
                <span className="font-medium">Resume</span>
              </Link>
            </div>

            {/* Sección de Clients */}
            <div>
              <Link
                href="/dashboard/clients"
                className={`flex items-center space-x-3 p-2 rounded-lg transition ${isActive(
                  "/dashboard/clients"
                )}`}
              >
                <FaUsers className="text-blue-500" />
                <span className="font-medium">Clients</span>
              </Link>
            </div>

            {/* Sección de Projects */}
            <div>
              <Link
                href="/dashboard/projects"
                className={`flex items-center space-x-3 p-2 rounded-lg transition ${isActive(
                  "/dashboard/projects"
                )}`}
              >
                <FaProjectDiagram className="text-blue-500" />
                <span className="font-medium">Projects</span>
              </Link>
            </div>

            {/* Sección de Delivery Notes */}
            <div>
              <Link
                href="/dashboard/delivery-notes"
                className={`flex items-center space-x-3 p-2 rounded-lg transition ${isActive(
                  "/dashboard/delivery-notes"
                )}`}
              >
                <FaFileInvoice className="text-blue-500" />
                <span className="font-medium">Delivery Notes</span>
              </Link>
            </div>

            {/* Sección de Proveedores */}
            <div>
              <Link
                href="/dashboard/suppliers"
                className={`flex items-center space-x-3 p-2 rounded-lg transition ${isActive(
                  "/dashboard/suppliers"
                )}`}
              >
                <FaWarehouse className="text-blue-500" />
                <span className="font-medium">Suppliers</span>
              </Link>
            </div>

            {/* Sección de Settings */}
            <div>
              <Link
                href="/dashboard/settings"
                className={`flex items-center space-x-3 p-2 rounded-lg transition ${isActive(
                  "/dashboard/settings"
                )}`}
              >
                <FaCog className="text-blue-500" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
