"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Barra lateral */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        {/* Barra superior */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Contenido principal */}
        <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
          {/* Bloque izquierdo: Formulario */}
          <div className="flex-1 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold">Formulario</h3>
            {/* Aquí iría el formulario */}
          </div>

          {/* Bloque derecho: Detalles */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">Logo Cliente</h3>
              <div className="mt-4">
                <div className="h-24 w-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Logo</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">Notas</h3>
              <textarea
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder="Add notes about your customer..."
              />
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">Tags</h3>
              <input
                type="text"
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder="Add tags to categorize customers..."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
