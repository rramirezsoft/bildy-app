"use client";

import {
  FaUsers,
  FaProjectDiagram,
  FaFileInvoice,
  FaCog,
} from "react-icons/fa";

import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside>
      {/* Botón para abrir/cerrar el menú en móviles y tablets */}
      <button
        className="bg-blue-700 text-white p-2 fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Menú lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static lg:min-h-screen`}
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
  );
}
