"use client";

import { useEffect, useState } from "react";
import { deleteClient, getClients } from "@/app/utils/api";
import getToken from "@/app/utils/auth";

export default function Projects() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch clients on initial load
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = getToken();
        const clientList = await getClients(token);
        setClients(clientList);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Delete a client by ID
  const handleDeleteClient = async (clientId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const token = getToken();
      await deleteClient(clientId, token);
      // Update the client list after deletion
      setClients((prevClients) =>
        prevClients.filter((client) => client._id !== clientId)
      );
      alert("Client deleted successfully.");
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete the client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      {loading && <p>Loading...</p>}
      <ul className="space-y-4">
        {clients.map((client) => (
          <li
            key={client._id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
          >
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className="text-sm text-gray-600">{client.email}</p>
            </div>
            <button
              onClick={() => handleDeleteClient(client._id)}
              className="btn-danger px-4 py-2 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
