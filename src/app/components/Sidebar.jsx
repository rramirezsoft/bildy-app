"use client";

import {
  FaUsers,
  FaProjectDiagram,
  FaFileInvoice,
  FaCog,
} from "react-icons/fa";

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
          className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform lg:translate-x-0 lg:static lg:min-h-screen z-40`}
        >
          {/* Título */}
          <h2 className="text-2xl font-bold p-4">Bildy</h2>

          {/* Navegación */}
          <nav className="space-y-4 p-4">
            <a href="#" className="flex items-center space-x-2">
              <FaUsers />
              <span>Clientes</span>
            </a>
            <a href="#" className="flex items-center space-x-2">
              <FaProjectDiagram />
              <span>Proyectos</span>
            </a>
            <a href="#" className="flex items-center space-x-2">
              <FaFileInvoice />
              <span>Albaranes</span>
            </a>
            <a href="#" className="flex items-center space-x-2">
              <FaCog />
              <span>Ajustes</span>
            </a>
          </nav>
        </div>
      </aside>
    </>
  );
}
