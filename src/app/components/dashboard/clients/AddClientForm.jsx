"use client";

import { useState } from "react";
import { addClient } from "@/app/utils/api";
import getToken from "@/app/utils/auth";
import Loading from "@/app/components/Loading";
import ClientAdded from "./ClientAdded";

export default function AddClientForm({ onClose }) {
  const [clientData, setClientData] = useState({
    name: "",
    cif: "",
    address: {
      street: "",
      number: "",
      postal: "",
      city: "",
      province: "",
    },
  });
  const [clientAdded, setClientAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    setClientAdded(true);
  };

  const handleClose = () => {
    setClientAdded(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const fieldName = name.split(".")[1];
      setClientData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [fieldName]: value,
        },
      }));
    } else {
      setClientData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      const response = await addClient(clientData, token);

      if (response) {
        handleSuccess();
        console.log("Client added successfully", response);
      }
    } catch (error) {
      console.error("Error submitting client:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">New Client</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client or Company Name*
            </label>
            <input
              type="text"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter the client or company name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CIF (optional)
            </label>
            <input
              type="text"
              name="cif"
              value={clientData.cif}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter the CIF"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street*
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={clientData.address.street}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter the street name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number*
                </label>
                <input
                  type="number"
                  name="address.number"
                  value={clientData.address.number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter the number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code*
                </label>
                <input
                  type="number"
                  name="address.postal"
                  value={clientData.address.postal}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter the postal code"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={clientData.address.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter the city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province*
                </label>
                <input
                  type="text"
                  name="address.province"
                  value={clientData.address.province}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter the province"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary px-6 py-3">
              Save
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading-overlay">
            <Loading />
          </div>
        )}
        {clientAdded && <ClientAdded onClose={handleClose} />}
      </div>
    </div>
  );
}
