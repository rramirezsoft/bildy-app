"use client";

import React, { useState, useEffect } from "react";
import { getDeliveryNotes, getClients } from "../../utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import StatusBadge from "@/app/components/dashboard/StatusBadge";
import { useRouter } from "next/navigation";

export default function DeliveryNotes() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const token = getToken();

    async function fetchData() {
      try {
        // Obtenemos albaranes y clientes en paralelo
        const [notesData, clientsData] = await Promise.all([
          getDeliveryNotes(token),
          getClients(token),
        ]);

        // Mapeamos clientes por su _id
        const clientsMap = clientsData.reduce((map, client) => {
          map[client._id] = client;
          return map;
        }, {});

        setDeliveryNotes(notesData);
        setClientsMap(clientsMap);
        setFilteredNotes(notesData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);

    const filtered = deliveryNotes.filter((note) => {
      return (
        note.deliveryCode.toLowerCase().includes(value) ||
        note.date.includes(value) ||
        note.clientName?.toLowerCase().includes(value)
      );
    });

    setFilteredNotes(filtered);
  };

  const handleStatusChange = (noteId, newStatus) => {
    setDeliveryNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteId ? { ...note, status: newStatus } : note
      )
    );
    setFilteredNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteId ? { ...note, status: newStatus } : note
      )
    );
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Barra de filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full max-w-full px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
            Delivery Notes
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search delivery notes..."
              value={filter}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg shadow-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="btn-primary text-sm">New Delivery Note</button>
          </div>
        </div>
      </div>

      {/* Tabla de albaranes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] table-auto border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                  Delivery Code
                </th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map((note) => {
                const client = clientsMap[note.clientId];
                return (
                  <tr
                    key={note._id}
                    className="border-b hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() =>
                      router.push(`/dashboard/delivery-notes/${note._id}`)
                    }
                  >
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      {note.deliveryCode}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      {`${new Date(note.date).toLocaleDateString()} ${new Date(
                        note.date
                      ).toLocaleTimeString()}`}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      {client ? client.name : "Unknown Client"}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      <StatusBadge
                        initialStatus={note.status}
                        onChange={(newStatus) => {
                          handleStatusChange(note._id, newStatus);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
