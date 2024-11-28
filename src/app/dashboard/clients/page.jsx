"use client";

import { useState } from "react";
import ClientForm from "@/app/components/dashboard/clients/ClientForm";
import Image from "next/image";

export default function Clients() {
  const [clientFormVisible, setClientFormVisible] = useState(false);

  const handleShowClientForm = () => {
    setClientFormVisible(true);
  };

  const handleCloseClientForm = () => {
    setClientFormVisible(false);
  };

  return (
    <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
      {/* Bloque izquierdo: Formulario */}
      <div className="flex-1 bg-white shadow rounded-lg p-6 border border-gray-300 flex flex-col items-center justify-center text-center">
        <Image
          src="/img/menu.png"
          alt="Menu"
          className="w-1/2 max-w-sm mb-6"
          width={200}
          height={200}
        />
        <h1 className="text-2xl font-bold mb-2">Create your first client</h1>
        <p className="text-gray-600 mb-6">
          To be able to generate digital delivery notes
        </p>
        <button
          onClick={handleShowClientForm}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Let's go!
        </button>
      </div>
      {clientFormVisible && <ClientForm onClose={handleCloseClientForm} />}

      {/* Bloque derecho: Detalles */}
      <div className="w-full md:w-1/3 space-y-6">
        <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
          <h3 className="text-xl font-semibold">Logo</h3>
          <div className="mt-4">
            <div className="h-24 w-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
              <p className="text-gray-500">Logo</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
          <h3 className="text-xl font-semibold">Notes</h3>
          <textarea
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            placeholder="Add notes about your customer..."
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
          <h3 className="text-xl font-semibold">Tags</h3>
          <input
            type="text"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            placeholder="Add tags to categorize customers..."
          />
        </div>
      </div>
    </main>
  );
}
