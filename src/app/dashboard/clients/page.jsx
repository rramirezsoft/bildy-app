"use client";

import { useEffect, useState } from "react";
import AddClientForm from "@/app/components/dashboard/clients/AddClientForm";
import UpdateClientForm from "@/app/components/dashboard/clients/UpdateClientForm";
import DeleteClientConfirmation from "@/app/components/dashboard/clients/DeleteClientConfirmation";
import Image from "next/image";
import {
  getClients,
  getClientById,
  updateClient,
  getProjectsByClient,
  updateClientLogo,
  deleteClient,
} from "@/app/utils/api";
import { useRouter } from "next/navigation";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import StatusBadge from "@/app/components/dashboard/StatusBadge";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addClientFormVisible, setAddClientFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [clientDetails, setClientDetails] = useState({});
  const [projects, setProjects] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = getToken();
        const clientList = await getClients(token);
        setClients(clientList);
        if (clientList.length > 0) {
          handleClientClick(clientList[0]._id);
          console.log(clientList);
        }
      } catch (err) {
        console.error(err, "Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientClick = async (clientId) => {
    setLoading(true);
    try {
      const token = getToken();
      const client = await getClientById(clientId, token);
      setSelectedClient(client);
      setClientDetails(client);
      setIsEditing(false);

      // Obtenemos los proyectos asociados al cliente
      const projectsList = await getProjectsByClient(clientId, token);
      const savedStatuses =
        JSON.parse(localStorage.getItem("projectStatuses")) || {};
      const projectsWithStatus = projectsList.map((project) => ({
        ...project,
        status: savedStatuses[project._id] || "pending",
      }));
      setProjects(projectsWithStatus);
    } catch (err) {
      console.error(err.message || "Failed to fetch client details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (projectId, newStatus) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === projectId ? { ...project, status: newStatus } : project
      )
    );

    const savedStatuses =
      JSON.parse(localStorage.getItem("projectStatuses")) || {};
    savedStatuses[projectId] = newStatus;
    localStorage.setItem("projectStatuses", JSON.stringify(savedStatuses));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleLogoChange = (file) => {
    setLogoFile(file);
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const fieldName = name.split(".")[1];
      setClientDetails((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [fieldName]: value,
        },
      }));
    } else {
      setClientDetails({ ...clientDetails, [name]: value });
    }
  };

  const handleSaveDetails = async () => {
    try {
      setLoading(true);
      const token = getToken();

      // Actualizamos los datos básicos del cliente
      const updatedClient = await updateClient(
        selectedClient._id,
        clientDetails,
        token
      );

      let updatedLogo = null;

      // Actualizamos el logo si se ha seleccionado uno nuevo
      if (logoFile) {
        try {
          updatedLogo = await updateClientLogo(
            logoFile,
            selectedClient._id,
            token
          );
        } catch (logoError) {
          console.error("Failed to update client logo:", logoError);
          alert("Failed to update client logo. Please try again.");
        }
      }

      // Actualizamos la lista de clientes con los datos modificados
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === updatedClient._id
            ? { ...updatedClient, logo: updatedLogo?.image || client.logo }
            : client
        )
      );

      // Actualizamos los detalles del cliente seleccionado
      setSelectedClient({
        ...updatedClient,
        logo: updatedLogo?.image || updatedClient.logo,
      });
      setClientDetails({
        ...updatedClient,
        logo: updatedLogo?.image || updatedClient.logo,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save client details:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    try {
      const token = getToken();
      const deletedClient = await deleteClient(selectedClient._id, token);

      // Actualizamos la lista de clientes eliminando el cliente borrado
      setClients((prevClients) =>
        prevClients.filter((client) => client._id !== deletedClient._id)
      );

      // Limpiamos los datos del cliente seleccionado
      setSelectedClient(null);

      // Cerramos el modal de confirmación
      setDeleteConfirmationVisible(false);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const handleAddProject = () => {
    if (selectedClient) {
      localStorage.setItem("client", JSON.stringify(selectedClient));
      router.push("/dashboard/projects/new");
    } else {
      console.error("No client selected!");
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  if (clients.length === 0 || addClientFormVisible) {
    return (
      <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
        <div className="flex-1 bg-white shadow rounded-lg p-6 border border-gray-300">
          {addClientFormVisible ? (
            <AddClientForm onClose={() => setAddClientFormVisible(false)} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="/img/menu.png"
                alt="Menu"
                className="w-1/2 max-w-sm mb-6"
                width={200}
                height={200}
              />
              <h1 className="text-2xl font-bold mb-2">
                Create your first client
              </h1>
              <p className="text-gray-600 mb-6">
                To be able to generate digital delivery notes
              </p>
              <button
                onClick={() => setAddClientFormVisible(true)}
                className="btn-primary"
              >
                Let&apos;s go!
              </button>
            </div>
          )}
        </div>

        {/* Panel derecho: Logo, Notas y Etiquetas */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
            <h3 className="text-xl font-semibold">Logo</h3>
            <div className="mt-4">
              <div className="h-24 w-24 mx-auto bg-100 rounded-lg flex items-center justify-center border border-gray-300">
                <Image
                  src={"/img/logo_placeholder.png"}
                  alt="Client logo"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
            <h3 className="text-xl font-semibold">Notes</h3>
            <textarea
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              placeholder="Add notes about your customer..."
            />
          </div>
          <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
            <h3 className="text-xl font-semibold">Tags</h3>
            <input
              type="text"
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              placeholder="Add tags to categorize customers..."
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 gap-6 p-4 lg:p-6">
      {/* Panel izquierdo (Clientes) */}
      <div className="w-full lg:w-1/4 bg-white shadow border border-gray-300 rounded-lg p-4 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-center lg:text-left">
            Clients
          </h3>
          <button
            onClick={() => setAddClientFormVisible(true)}
            className="btn-secondary px-4 py-2 text-sm"
          >
            New client
          </button>
        </div>
        {/* Lista de clientes */}
        <ul className="space-y-4">
          {clients.map((client) => (
            <li
              key={client._id}
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${
                selectedClient?._id === client._id
                  ? "bg-blue-100 border border-blue-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <div
                className="flex items-center gap-4 flex-1"
                onClick={() => handleClientClick(client._id)}
              >
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src={client.logo || "/img/placeholder.png"}
                    alt={client.name}
                    className="rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {client.name}
                </p>
              </div>
              {/* Botón de eliminar */}
              <button
                className={`text-red-500 hover:text-red-700 p-2 ${
                  selectedClient?._id === client._id
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() =>
                  selectedClient?._id === client._id &&
                  setDeleteConfirmationVisible(true)
                }
                disabled={selectedClient?._id !== client._id}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3h6m2 0h3m-4 0a2 2 0 00-2-2H9a2 2 0 00-2 2H4m4 0v2m6-2v2M5 6h14m-1 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V6m4 6v6m4-6v6"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* Componente de confirmación de eliminación */}
        {deleteConfirmationVisible && (
          <DeleteClientConfirmation
            onConfirm={() => {
              handleDeleteClient();
              setDeleteConfirmationVisible(false);
            }}
            onCancel={() => setDeleteConfirmationVisible(false)}
          />
        )}
      </div>

      {/* Panel derecho (Detalles del cliente + Proyectos) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Detalles del cliente */}
        <UpdateClientForm
          clientDetails={clientDetails}
          handleDetailsChange={handleDetailsChange}
          handleSaveDetails={handleSaveDetails}
          handleEditToggle={handleEditToggle}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleLogoChange={handleLogoChange}
        />

        {/* Proyectos */}
        <div className="p-6 bg-white shadow border border-gray-300 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Projects</h3>

            <button className="btn-primary text-sm" onClick={handleAddProject}>
              Add Project
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-4 py-2">Project Name</th>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project._id}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="px-4 py-2">{project.name}</td>
                      <td className="px-4 py-2">{project.projectCode}</td>
                      <td className="px-4 py-2">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge
                          initialStatus={project.status}
                          onChange={(newStatus) =>
                            handleStatusChange(project._id, newStatus)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No projects assigned</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
