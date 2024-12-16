import React from "react";
import Image from "next/image";

export default function DeliveryNoteAdded({ clientName, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-96">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          <Image
            src={"/img/success.png"}
            alt="Success"
            width={80}
            height={80}
            className="my-8"
          />

          <h2 className="text-md font-semibold text-gray-800 mb-4">Success!</h2>

          <div className="w-full border-t border-gray-200 my-3"></div>

          <p className="text-xs text-gray-600 mb-4">
            The delivery note for the client &quot;
            {clientName}&quot; has been successfully created.
          </p>

          <button
            onClick={onClose}
            className="btn-secondary px-4 py-2 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
