"use client";

import React, { useState, useEffect } from "react";
import { getProjects, getClients } from "../../utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import StatusBadge from "@/app/components/dashboard/StatusBadge";
import { useRouter } from "next/navigation";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargamos los estados desde localStorage
  useEffect(() => {
    const savedStatuses =
      JSON.parse(localStorage.getItem("projectStatuses")) || {};
    setProjects((prevProjects) =>
      prevProjects.map((project) => ({
        ...project,
        status: savedStatuses[project._id] || "pending",
      }))
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    const token = getToken();

    async function fetchData() {
      try {
        // Obtenemos los proyectos y clientes en paralelo
        const [projectsData, clientsData] = await Promise.all([
          getProjects(token),
          getClients(token),
        ]);

        // Mapeo de clientes por su _id
        const clientsMap = clientsData.reduce((map, client) => {
          map[client._id] = client;
          return map;
        }, {});

        // Actualizar proyectos con estados desde localStorage
        const savedStatuses =
          JSON.parse(localStorage.getItem("projectStatuses")) || {};
        const projectsWithStatus = projectsData.map((project) => ({
          ...project,
          status: savedStatuses[project._id] || "pending",
        }));

        setProjects(projectsWithStatus);
        setClientsMap(clientsMap);
        setFilteredProjects(projectsWithStatus);
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

    const filtered = projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(value) ||
        project.projectCode.toLowerCase().includes(value) ||
        project.createdAt.includes(value)
      );
    });

    setFilteredProjects(filtered);
  };

  const handleStatusChange = (projectId, newStatus) => {
    // Actualizar estado en local
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === projectId ? { ...project, status: newStatus } : project
      )
    );
    setFilteredProjects((prevFiltered) =>
      prevFiltered.map((project) =>
        project._id === projectId ? { ...project, status: newStatus } : project
      )
    );

    // Guardar el nuevo estado en localStorage
    const savedStatuses =
      JSON.parse(localStorage.getItem("projectStatuses")) || {};
    savedStatuses[projectId] = newStatus;
    localStorage.setItem("projectStatuses", JSON.stringify(savedStatuses));
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen w-full">
      {/* Barra de filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full max-w-full px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-0">
            All Projects
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              value={filter}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg shadow-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => router.push("/dashboard/projects/new")}
              className="btn-primary text-sm"
            >
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Panel de tabla de proyectos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] table-auto border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                  Code
                </th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">
                  Name
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
              {filteredProjects.map((project) => {
                const client = clientsMap[project.clientId];
                return (
                  <tr
                    key={project._id}
                    className="border-b hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() =>
                      router.push(`/dashboard/projects/${project._id}`)
                    }
                  >
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      {project.projectCode}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      {`${new Date(
                        project.createdAt
                      ).toLocaleDateString()} ${new Date(
                        project.createdAt
                      ).toLocaleTimeString()}`}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      {project.name}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700 flex items-center">
                      {client ? (
                        <div className="flex items-center">
                          <img
                            src={client.logo}
                            alt={client.name}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 mr-2"
                          />
                          <span>{client.name}</span>
                        </div>
                      ) : (
                        <span>Unknown Client</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs sm:text-sm text-gray-700">
                      <StatusBadge
                        initialStatus={project.status}
                        onChange={(newStatus) => {
                          handleStatusChange(project._id, newStatus);
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
