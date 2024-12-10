"use client";

import { useEffect, useState } from "react";
import { getClients, createProject } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import getToken from "@/app/utils/auth";
import ProjectAdded from "@/app/components/dashboard/projects/ProjectAdded";
import Loading from "@/app/components/Loading";
import Image from "next/image";

export default function NewProject() {
  const [client, setClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdProject, setCreatedProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedClient = localStorage.getItem("client");
    if (storedClient) {
      setClient(JSON.parse(storedClient));
    } else {
      setLoading(true);
      fetchClients();
    }
  }, []);

  const fetchClients = async () => {
    try {
      const token = getToken();
      const clientData = await getClients(token);
      setClients(clientData);
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (e) => {
    setSelectedClientId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const projectData = {
      name: formData.get("projectName"),
      code: formData.get("projectCode"),
      email: formData.get("email"),
      address: {
        street: formData.get("street"),
        number: formData.get("number"),
        postal: formData.get("postal"),
        city: formData.get("city"),
        province: formData.get("province"),
      },
      clientId: client ? client._id : selectedClientId,
    };

    try {
      const token = getToken();
      await createProject(projectData, token);
      localStorage.removeItem("client");

      setIsSuccess(true);
      setCreatedProject({
        name: projectData.name,
        code: projectData.code,
      });
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const handleDiscard = () => {
    localStorage.removeItem("client");
    router.push("/dashboard/projects");
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <ProjectAdded
        projectName={createdProject.name}
        projectCode={createdProject.code}
        onClose={() => router.push("/dashboard/projects")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 p-4 md:p-8 w-full">
      {/*Panel Izquierdo */}
      <div className="w-full bg-white shadow-lg p-6 rounded-lg border border-gray-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          New Project
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700"
            >
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="projectCode"
              className="block text-sm font-medium text-gray-700"
            >
              Project Code
            </label>
            <input
              type="text"
              id="projectCode"
              name="projectCode"
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <input
                type="text"
                name="street"
                placeholder="Street"
                className="block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
              <input
                type="text"
                name="number"
                placeholder="Number"
                className="block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
              <input
                type="text"
                name="postal"
                placeholder="Postal Code"
                className="block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
              <input
                type="text"
                name="province"
                placeholder="Province"
                className="block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleDiscard}
              className="btn-secondary text-sm"
            >
              Discard
            </button>
            <button type="submit" className="btn-primary text-sm">
              Save Project
            </button>
          </div>
        </form>
      </div>

      <div className="w-full bg-white shadow-lg p-6 rounded-lg border border-gray-300">
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
          <div>
            <label
              htmlFor="clientSelect"
              className="block text-sm font-medium text-gray-700"
            >
              Select Client
            </label>
            <select
              id="clientSelect"
              className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleClientSelect}
              value={selectedClientId || ""}
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
