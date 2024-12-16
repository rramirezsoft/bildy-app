"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProjectById,
  getClientById,
  createDeliveryNote,
} from "@/app/utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import Image from "next/image";
import DeliveryNoteAdded from "@/app/components/dashboard/delivery-notes/DeliveryNoteAdded";

export default function CreateDeliveryNote() {
  const [id, setId] = useState("");
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState({
    clientId: "",
    projectId: "",
    format: "",
    material: "",
    hours: "",
    description: "",
    workDate: "",
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const projectId = localStorage.getItem("projectId");
      setId(projectId); // Update state with the projectId from localStorage
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProjectAndClient = async () => {
      try {
        const token = getToken();
        const projectData = await getProjectById(id, token);
        setProject(projectData);

        if (projectData.clientId) {
          const clientData = await getClientById(projectData.clientId, token);
          setClient(clientData);
          console.log(clientData);
        }
      } catch (error) {
        console.error(error);
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndClient();
  }, [id, router]);

  useEffect(() => {
    if (client && client._id) {
      setDeliveryNote((prev) => ({
        ...prev,
        clientId: client._id,
      }));
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      await createDeliveryNote(
        {
          ...deliveryNote,
          projectId: id,
        },
        token
      );

      setModalVisible(true);
    } catch (error) {
      alert("Failed to create delivery note: " + error.message);
    }
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
      {/* Contenedor izquierdo: Proyecto y Cliente */}
      <div className="flex flex-col lg:w-1/3 gap-6">
        {/* Panel del proyecto */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {project.name || "Project Name"}
          </h1>
          <p className="text-sm text-gray-500 mb-4">Project Details</p>
          <hr className="border-gray-300 mb-4" />
          <p>
            <strong>Internal Code:</strong> {project.projectCode || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {project.address?.street || "N/A"}
          </p>
        </div>

        {/* Panel del cliente */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Client</h2>
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
            <p className="text-gray-600">No client data available.</p>
          )}
        </div>
      </div>

      {/* Contenedor derecho: Formulario de albarán */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create Delivery Note
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Formato */}
          <div>
            <label
              htmlFor="format"
              className="block text-sm font-medium text-gray-700"
            >
              Format
            </label>
            <select
              id="format"
              name="format"
              value={deliveryNote.format || ""}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select format</option>
              <option value="material">Material</option>
              <option value="hours">Hours</option>
            </select>
          </div>

          {/* Material */}
          {deliveryNote.format === "material" && (
            <div>
              <label
                htmlFor="material"
                className="block text-sm font-medium text-gray-700"
              >
                Material
              </label>
              <input
                id="material"
                name="material"
                required
                type="text"
                value={deliveryNote.material || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Horas */}
          {deliveryNote.format === "hours" && (
            <div>
              <label
                htmlFor="hours"
                className="block text-sm font-medium text-gray-700"
              >
                Hours
              </label>
              <input
                id="hours"
                required
                name="hours"
                type="number"
                value={deliveryNote.hours || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Descripción (Opcional) */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={deliveryNote.description || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Fecha del trabajo */}
          <div>
            <label
              htmlFor="workDate"
              className="block text-sm font-medium text-gray-700"
            >
              Work Date
            </label>
            <input
              id="workDate"
              name="workDate"
              type="date"
              required
              value={deliveryNote.workDate || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button type="submit" className="btn-primary px-4 py-2">
            Submit
          </button>
        </form>
      </div>

      {/* Modal de éxito */}
      {isModalVisible && (
        <DeliveryNoteAdded
          clientName={client?.name || "Unknown Client"}
          onClose={() => {
            setModalVisible(false);
            router.push(`/dashboard/projects/${id}`);
          }}
        />
      )}
    </main>
  );
}
