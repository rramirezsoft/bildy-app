"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjectById, getClientById } from "@/app/utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import Image from "next/image";

export default function ProjectDetails({ params }) {
  const [id, setId] = useState(null);
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
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

    const fetchProject = async () => {
      try {
        const token = getToken();
        const projectData = await getProjectById(id, token);
        setProject(projectData);

        // Fetch client data using clientId
        if (projectData.clientId) {
          const clientData = await getClientById(projectData.clientId, token);
          setClient(clientData);
        }
      } catch (error) {
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

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
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-300">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            {project.name || "Project Name"}
          </h1>
          <p className="text-gray-600 mb-2">
            <strong>Internal Code:</strong> {project.code || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Location:</strong> {project.address?.street || "N/A"},{" "}
            {project.address?.number || "N/A"},{" "}
            {project.address?.postal || "N/A"}, {project.address?.city || "N/A"}
            , {project.address?.province || "N/A"}
          </p>
          <div className="mt-6">
            <button className="btn-secondary text-sm">Edit</button>
          </div>
        </div>
        {/* Client */}
        <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-300">
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
      </div>

      {/* Albaranes */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Delivery Notes
          </h2>
          <button className="btn-primary text-sm">Create Delivery Note</button>
        </div>
        <div className="mt-4">
          <p className="text-center text-gray-600">
            No delivery notes available.
          </p>
        </div>
      </div>
    </div>
  );
}
