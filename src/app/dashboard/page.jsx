"use client";

import { useEffect, useState } from "react";
import {
  FaUsers,
  FaProjectDiagram,
  FaFileInvoice,
  FaWarehouse,
} from "react-icons/fa";
import Link from "next/link";
import { getClients, getProjects, getDeliveryNotes } from "@/app/utils/api";
import getToken from "@/app/utils/auth";

export default function Dashboard() {
  const [activeClients, setActiveClients] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [deliveryNotes, setDeliveryNotes] = useState(0);

  useEffect(() => {
    // Llamada para obtener el número de clientes activos
    const fetchClients = async () => {
      try {
        const token = getToken();
        const response = await getClients(token);
        setActiveClients(response?.length || 0);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    // Llamada para obtener el número de proyectos activos
    const fetchProjects = async () => {
      try {
        const token = getToken();
        const response = await getProjects(token);
        setActiveProjects(response?.length || 0);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    // Llamada para obtener el número de albaranes
    const fetchDeliveryNotes = async () => {
      try {
        const token = getToken();
        const response = await getDeliveryNotes(token);
        setDeliveryNotes(response?.length || 0);
      } catch (error) {
        console.error("Failed to fetch delivery notes:", error);
      }
    };

    fetchClients();
    fetchProjects();
    fetchDeliveryNotes();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6 gap-6">
      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 rounded-lg">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-300 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Bildy Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage your clients, projects, delivery notes, and reports from
            here.
          </p>

          {/* Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Clientes */}
            <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg p-6 shadow-md">
              <FaUsers className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Clients
              </h3>
              <p className="text-gray-600">
                Manage all your clients and their information.
              </p>
              <p className="text-gray-800 font-bold mt-2">{activeClients}</p>
              <Link href="/dashboard/clients">
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  View Clients
                </button>
              </Link>
            </div>

            {/* Proyectos */}
            <div className="flex flex-col items-center justify-center bg-green-100 rounded-lg p-6 shadow-md">
              <FaProjectDiagram className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Projects
              </h3>
              <p className="text-gray-600">
                Manage all your projects and their information.
              </p>
              <p className="text-gray-800 font-bold mt-2">{activeProjects}</p>
              <Link href="/dashboard/projects">
                <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                  View Projects
                </button>
              </Link>
            </div>

            {/* Albaranes */}
            <div className="flex flex-col items-center justify-center bg-yellow-100 rounded-lg p-6 shadow-md">
              <FaFileInvoice className="text-4xl text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Delivery Notes
              </h3>
              <p className="text-gray-600">
                Manage all your notes and their information.
              </p>
              <p className="text-gray-800 font-bold mt-2">{deliveryNotes}</p>
              <Link href="/dashboard/delivery-notes">
                <button className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition">
                  View Delivery Notes
                </button>
              </Link>
            </div>

            {/* Proveedores (sin implementar) */}
            <div className="flex flex-col items-center justify-center bg-teal-100 rounded-lg p-6 shadow-md">
              <FaWarehouse className="text-4xl text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Suppliers
              </h3>
              <p className="text-gray-600">
                Manage all your Suppliers and their information.
              </p>
              <p className="text-gray-800 font-bold mt-2">N/A</p>
              <Link href="/dashboard/suppliers">
                <button className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">
                  View Suppliers
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            General Statistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-medium text-gray-700">
                Active Clients
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {activeClients}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-medium text-gray-700">
                Active Projects
              </h4>
              <p className="text-3xl font-bold text-green-600">
                {activeProjects}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-medium text-gray-700">
                Delivery Notes
              </h4>
              <p className="text-3xl font-bold text-yellow-600">
                {deliveryNotes}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-medium text-gray-700">Suppliers</h4>
              <p className="text-3xl font-bold text-teal-600">N/A</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
