import Image from "next/image";

export default function UpdateClientForm({
  clientDetails,
  handleDetailsChange,
  handleSaveDetails,
  handleEditToggle,
  isEditing,
  setIsEditing,
  handleLogoChange,
}) {
  return (
    <div className="p-6 bg-white shadow border border-gray-300 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-2">
          <h2 className="text-3xl font-bold">{clientDetails?.name}</h2>
          <p className="text-sm text-gray-500">Client Data</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <label htmlFor="logo-upload" className="cursor-pointer">
            <Image
              src={clientDetails?.logo || "/img/logo_placeholder.png"}
              alt={clientDetails?.name || "Client Logo"}
              className="rounded object-cover mx-auto sm:mx-0"
              width={128}
              height={128}
              unoptimized
            />
          </label>

          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={!isEditing}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleLogoChange(file);
            }}
          />
        </div>
      </div>

      {/* Campos de edición */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Street
          </label>
          <input
            type="text"
            name="address.street"
            value={clientDetails?.address?.street || ""}
            onChange={handleDetailsChange}
            disabled={!isEditing}
            className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number
          </label>
          <input
            type="text"
            name="address.number"
            value={clientDetails?.address?.number || ""}
            onChange={handleDetailsChange}
            disabled={!isEditing}
            className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            name="address.postalCode"
            value={clientDetails?.address?.postal || ""}
            onChange={handleDetailsChange}
            disabled={!isEditing}
            className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CIF</label>
          <input
            type="text"
            name="cif"
            value={clientDetails.cif || ""}
            onChange={handleDetailsChange}
            disabled={!isEditing}
            className="input-primary bg-gray-100 w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary w-full sm:w-auto p-3 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDetails}
              className="btn-primary w-full sm:w-auto p-3 rounded-md"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="btn-secondary w-full sm:w-auto p-3 rounded-md"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
