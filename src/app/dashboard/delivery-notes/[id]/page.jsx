"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDeliveryNoteById,
  updateDeliveryNote,
  downloadDeliveryNotePDF,
} from "@/app/utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import { FaDownload } from "react-icons/fa";

export default function DeliveryNoteDetails({ params }) {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState(null);
  const [client, setClient] = useState(null);
  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableNote, setEditableNote] = useState({});
  const clientId = localStorage.getItem("noteClientId");
  const projectId = localStorage.getItem("noteProjectId");
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

    setLoading(true);

    const token = getToken();

    const fetchData = async () => {
      try {
        const note = await getDeliveryNoteById(id, token);

        if (!note) {
          throw new Error("Delivery note not found");
        }

        setDeliveryNote(note);
        setProject(note.projectName);
        setClient(note.client);

        setEditableNote({
          ...note,
          material: note.material || "",
          description: note.description || "",
          hours: note.hours || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
        if (error.message.includes("Delivery note")) {
          router.push("/dashboard/delivery-notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      const updatedDeliveryNote = {
        clientId: clientId,
        projectId: projectId,
        format: editableNote.hours ? "hours" : "material",
        material: editableNote.material || "",
        hours: editableNote.hours || 0,
        description: editableNote.description || "",
        workdate:
          deliveryNote.workdate || new Date().toISOString().split("T")[0],
      };

      console.log(updatedDeliveryNote);

      // llamamos a la API para actualizar el albarán
      await updateDeliveryNote(id, updatedDeliveryNote, token);

      // Actualizamos el estado con los cambios realizados
      setDeliveryNote((prev) => ({
        ...prev,
        ...editableNote,
      }));
      setIsEditing(false);
    } catch (error) {
      alert(error.message || "Failed to update delivery note");
    }
  };

  const handleDownloadPDF = async () => {
    const token = getToken();
    try {
      const blob = await downloadDeliveryNotePDF(id, token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `albaran_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Loading />
      </div>
    );
  }

  if (!deliveryNote || !client || !project) {
    return <div className="p-4 text-center text-gray-700">Data not found</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Cliente y Proyecto */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Client & Project Information
          </h2>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">{client.name}</p>
            <p className="text-sm text-gray-500">{client.cif}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Project:</h3>
            <p className="text-sm text-gray-600">{project}</p>
            <p className="text-sm text-gray-600">
              {deliveryNote?.projectAddress?.street},{" "}
              {deliveryNote?.projectAddress?.city}
            </p>
          </div>
        </div>

        {/* Panel de Albarán */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Delivery Note Details
          </h2>

          {/* Material & Hours */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Material:
            </label>
            {isEditing ? (
              <input
                type="text"
                name="material"
                value={editableNote.material || ""}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-sm text-gray-600">{deliveryNote?.material}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Hours:
            </label>
            {isEditing ? (
              <input
                type="text"
                name="hours"
                value={editableNote.hours || ""}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-sm text-gray-600">{deliveryNote?.hours}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={editableNote.description || ""}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-sm text-gray-600">
                {deliveryNote?.description}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="btn-secondary flex items-center"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="btn-secondary flex items-center"
              >
                Edit
              </button>
            )}

            <button
              onClick={handleDownloadPDF}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <FaDownload className="mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
