"use client";

import React, { useState, useEffect } from "react";
import { getProjects } from "../../utils/api";
import getToken from "@/app/utils/auth";

export default function Porjects() {
  const [projects, setProjects] = useState([]); // Lista de proyectos
  const [filteredProjects, setFilteredProjects] = useState([]); // Proyectos filtrados
  const [filter, setFilter] = useState(""); // Filtro en tiempo real

  useEffect(() => {
    const token = getToken();
    async function fetchProjects() {
      try {
        const data = await getProjects(token);
        setProjects(data); // Guardamos los proyectos en el estado
        setFilteredProjects(data); // Inicialmente los proyectos filtrados son los mismos
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    }
    fetchProjects();
  }, []);

  // Función para filtrar los proyectos
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Barra de filtros */}
      <div className="flex justify-between items-center mb-6 w-full max-w-full px-6">
        <h1 className="text-xl font-semibold text-gray-700">
          Todos los Proyectos
        </h1>
        <input
          type="text"
          placeholder="Buscar por código, nombre o fecha"
          value={filter}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Panel de tabla de proyectos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full mx-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Código
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Fecha
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Nombre
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Cliente
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {project.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {project.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <span>{project.clientId}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
