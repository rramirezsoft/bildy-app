"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProjectById,
  getClientById,
  updateProject,
  getDeliveryNotesByProject,
} from "@/app/utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import Image from "next/image";

export default function ProjectDetails({ params }) {
  const [id, setId] = useState(null);
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProject, setEditableProject] = useState({});
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchProjectAndDeliveryNotes = async () => {
      try {
        const token = getToken();

        // Llamadas simultáneas a la API
        const [projectData, deliveryNotesData] = await Promise.all([
          getProjectById(id, token),
          getDeliveryNotesByProject(id, token),
        ]);

        // Asignamos datos del proyecto
        setProject(projectData);
        setEditableProject({ ...projectData });

        // Asignamos datos de los albaranes
        setDeliveryNotes(deliveryNotesData);
        console.log("Albaranes; ", deliveryNotesData);

        // Obtenemos datos del cliente
        if (projectData.clientId) {
          const clientData = await getClientById(projectData.clientId, token);
          setClient(clientData);
          console.log("Cliente: ", clientData);
        }
      } catch (error) {
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndDeliveryNotes();
  }, [id, router]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditableProject((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setEditableProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      await updateProject(id, editableProject, token);
      setProject((prev) => ({ ...prev, ...editableProject }));
      setIsEditing(false);
    } catch (error) {
      alert(error.message || "Failed to update project");
    }
  };

  const handleCreateDeliveryNote = () => {
    localStorage.setItem("projectId", id);
    router.push("/dashboard/delivery-notes/new");
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  if (!project) {
    return <p className="text-center text-gray-600">Project not found.</p>;
  }

  return (
    <main className="flex flex-col lg:flex-row flex-1 p-6 gap-6">
      {/* Contenedor izquierdo: Proyecto y Albaranes */}
      <div className="flex flex-col flex-1 gap-6">
        {/* Panel del proyecto */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-300">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {project.name || "Project Name"}
          </h1>
          <p className="text-sm text-gray-500 mb-4">Project Details</p>
          <hr className="border-gray-300 mb-4" />

          <div className="mb-4">
            <label
              htmlFor="projectCode"
              className="block text-sm font-medium text-gray-700"
            >
              Internal Code
            </label>
            {isEditing ? (
              <input
                id="projectCode"
                name="projectCode"
                type="text"
                value={editableProject.projectCode || ""}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-2 text-gray-800">
                {project.projectCode || "N/A"}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            {isEditing ? (
              <>
                <input
                  name="address.street"
                  type="text"
                  placeholder="Street"
                  value={editableProject.address?.street || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  name="address.number"
                  type="text"
                  placeholder="Number"
                  value={editableProject.address?.number || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  name="address.postal"
                  type="text"
                  placeholder="Postal Code"
                  value={editableProject.address?.postal || ""}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </>
            ) : (
              <p className="mt-2 text-gray-800">
                {project.address?.street || "N/A"},{" "}
                {project.address?.number || "N/A"},{" "}
                {project.address?.postal || "N/A"},{" "}
                {project.address?.city || "N/A"},{" "}
                {project.address?.province || "N/A"}
              </p>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="btn-secondary text-sm px-4 py-2"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Panel de albaranes */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Delivery Notes
            </h2>
            <button
              className="btn-primary text-sm"
              onClick={handleCreateDeliveryNote}
            >
              Create Delivery Note
            </button>
          </div>

          {deliveryNotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Format</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryNotes.map((note) => (
                    <tr key={note._id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-2">
                        {note.description || "No description"}
                      </td>
                      <td className="px-4 py-2">
                        {note.format || "Unknown format"}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No delivery notes available</p>
            </div>
          )}
        </div>
      </div>

      {/* Contenedor derecho: Cliente */}
      <div className="w-full lg:w-1/3 flex-shrink-0 bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-300 flex flex-col justify-between">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Client</h2>
        {client ? (
          <div>
            <div className="flex justify-center mb-6">
              <Image
                src={client.logo || "/img/placeholder.png"}
                alt="Client Logo"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="clientName"
                type="text"
                value={client.name}
                readOnly
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="clientAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="clientAddress"
                type="text"
                value={
                  client.address
                    ? `${client.address.street}, ${client.address.number}, ${client.address.postal}, ${client.address.city}, ${client.address.province}`
                    : "Not available"
                }
                readOnly
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="clientCif"
                className="block text-sm font-medium text-gray-700"
              >
                CIF
              </label>
              <input
                id="clientCif"
                type="text"
                value={client.cif}
                readOnly
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Client information not available.</p>
        )}
      </div>
    </main>
  );
}
