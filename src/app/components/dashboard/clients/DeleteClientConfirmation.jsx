import React from "react";

export default function DeleteClientConfirmation({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative transform transition-all scale-95 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Are you sure?
        </h2>
        <p className="text-gray-700 mb-6 text-sm leading-relaxed">
          Are you sure you want to delete this client? This action is
          irreversible, and all associated data will be permanently removed.
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
        {/* Icono de cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
