"use client";

import { useEffect, useState } from "react";
import ClientForm from "@/app/components/dashboard/clients/ClientForm";
import Image from "next/image";
import { getClients, getClientById, updateClient } from "@/app/utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientFormVisible, setClientFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [clientDetails, setClientDetails] = useState({});
  const token = getToken();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientList = await getClients(token);
        setClients(clientList);
        if (clientList.length > 0) {
          handleClientClick(clientList[0]._id); // Seleccionamos el primer cliente
        }
      } catch (err) {
        console.error(err, "Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientClick = async (clientId) => {
    setLoading(true);
    try {
      const token = getToken();
      const client = await getClientById(clientId, token);
      setSelectedClient(client);
      setClientDetails(client);
      setIsEditing(false);
    } catch (err) {
      console.error(err.message || "Failed to fetch client details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const fieldName = name.split(".")[1];
      setClientDetails((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [fieldName]: value,
        },
      }));
    } else {
      setClientDetails({ ...clientDetails, [name]: value });
    }
  };

  const handleSaveDetails = async () => {
    try {
      setLoading(true);
      const updatedClient = await updateClient(
        selectedClient._id,
        clientDetails,
        token
      );

      // Actualizamos la lista de clientes con los datos modificados
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === updatedClient._id ? updatedClient : client
        )
      );

      // Actualizamos los detalles del cliente seleccionado
      setSelectedClient(updatedClient);
      setClientDetails(updatedClient);

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save client details:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  if (clients.length === 0 || clientFormVisible) {
    return (
      <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
        <div className="flex-1 bg-white shadow rounded-lg p-6 border border-gray-300">
          {clientFormVisible ? (
            <ClientForm onClose={() => setClientFormVisible(false)} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="/img/menu.png"
                alt="Menu"
                className="w-1/2 max-w-sm mb-6"
                width={200}
                height={200}
              />
              <h1 className="text-2xl font-bold mb-2">
                Create your first client
              </h1>
              <p className="text-gray-600 mb-6">
                To be able to generate digital delivery notes
              </p>
              <button
                onClick={() => setClientFormVisible(true)}
                className="btn-primary"
              >
                Let&apos;s go!
              </button>
            </div>
          )}
        </div>

        {/* Panel derecho: Logo, Notas y Etiquetas */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
            <h3 className="text-xl font-semibold">Logo</h3>
            <div className="mt-4">
              <div className="h-24 w-24 mx-auto bg-100 rounded-lg flex items-center justify-center border border-gray-300">
                <Image
                  src={"/img/logo_placeholder.png"}
                  alt="Client logo"
                  width={200}
                  height={200}
                />
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

  return (
    <main className="flex flex-col lg:flex-row flex-1 gap-6 p-4 lg:p-6">
      {/* Panel izquierdo (Clientes) */}
      <div className="w-full lg:w-1/4 bg-white shadow border border-gray-300 rounded-lg p-4 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-center lg:text-left">
            Clients
          </h3>
          <button
            onClick={() => setClientFormVisible(true)}
            className="btn-secondary px-4 py-2 text-sm"
          >
            New client
          </button>
        </div>
        <ul className="space-y-4">
          {clients.map((client) => (
            <li
              key={client._id}
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${
                selectedClient?._id === client._id
                  ? "bg-blue-100 border border-blue-500"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleClientClick(client._id)}
            >
              <div className="w-12 h-12 flex-shrink-0">
                <Image
                  src={client.logo || "/img/placeholder.png"}
                  alt={client.name}
                  className="rounded-full object-cover"
                  width={48}
                  height={48}
                />
              </div>
              <p className="text-sm font-medium text-gray-700 truncate">
                {client.name}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel derecho (Detalles del cliente + Proyectos) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Detalles del cliente */}
        <div className="p-6 bg-white shadow border border-gray-300 rounded-lg">
          {/* Titulo y logo */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2">
              <h2 className="text-3xl font-bold">{selectedClient?.name}</h2>
              <p className="text-sm text-gray-500">Client Data</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Image
                src={selectedClient?.logo || "/img/logo_placeholder.png"}
                alt={selectedClient?.name || "Client Logo"}
                className="rounded object-cover mx-auto sm:mx-0"
                width={128}
                height={128}
              />
            </div>
          </div>

          {/* Campos de edición */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                type="text"
                name="address.street"
                value={clientDetails?.address?.street || ""}
                onChange={handleDetailsChange}
                disabled={!isEditing}
                className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number
              </label>
              <input
                type="text"
                name="address.number"
                value={clientDetails?.address?.number || ""}
                onChange={handleDetailsChange}
                disabled={!isEditing}
                className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="address.postalCode"
                value={clientDetails?.address?.postal || ""}
                onChange={handleDetailsChange}
                disabled={!isEditing}
                className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CIF
              </label>
              <input
                type="text"
                name="cif"
                value={clientDetails.cif || ""}
                onChange={handleDetailsChange}
                disabled={!isEditing}
                className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary w-full sm:w-auto p-3 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="btn-primary w-full sm:w-auto p-3 rounded-md"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="btn-secondary w-full sm:w-auto p-3 rounded-md"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Proyectos asociados */}
        <div className="p-6 bg-white shadow border border-gray-300 rounded-lg mt-6">
          <h3 className="text-xl font-semibold mb-4">Associated Projects</h3>
          <ul className="space-y-4">
            {selectedClient?.projects?.map((project) => (
              <li
                key={project._id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <p className="text-sm font-medium text-gray-700 truncate">
                  {project.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
