"use client";

import { useState } from "react";

export default function ClientForm({ onClose }) {
  const [clientData, setClientData] = useState({
    name: "",
    address: "",
    cif: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client Data Submitted:", clientData);
    // Aquí podrías agregar la lógica para guardar el cliente en la base de datos
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Nuevo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Cliente o Empresa*
            </label>
            <input
              type="text"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Domicilio Fiscal
            </label>
            <input
              type="text"
              name="address"
              value={clientData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Si te sabes el CIF, añádelo aquí
            </label>
            <input
              type="text"
              name="cif"
              value={clientData.cif}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Descartar
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
