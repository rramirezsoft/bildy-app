"use client";

import { useEffect, useState } from "react";
import { getProjectsByClient } from "@/app/utils/api";
import getToken from "@/app/utils/auth";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  // Client ID de Real Madrid, por ejemplo
  const realMadridClientId = "674ef41955ea1909c6096a06";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = getToken(); // Asegúrate de obtener el token
        console.log("Token obtenido:", token); // Verifica el token

        // Llamada para obtener los proyectos
        const fetchedProjects = await getProjectsByClient(
          realMadridClientId,
          token
        );

        // Verifica la respuesta
        console.log("Proyectos obtenidos:", fetchedProjects);

        // Asignar proyectos al estado
        if (fetchedProjects && fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
        } else {
          setError("No se encontraron proyectos para este cliente.");
        }
      } catch (err) {
        console.error("Error al obtener proyectos:", err);
        setError(err.message || "Error al obtener proyectos.");
      }
    };

    fetchProjects();
  }, []); // Solo se ejecuta una vez cuando se monta el componente

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Proyectos del Cliente
      </h1>

      {/* Mostrar error si no se encuentran proyectos */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Mostrar los proyectos si están disponibles */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {project.name}
              </h2>
              <p className="text-gray-600">{project.projectCode}</p>
              <p className="text-gray-600">{project.email}</p>
              <p className="text-gray-600">
                {project.address.street}, {project.address.number} -{" "}
                {project.address.city}
              </p>
              <p className="text-gray-600">{project.address.province}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No hay proyectos disponibles.</div>
      )}
    </div>
  );
}
