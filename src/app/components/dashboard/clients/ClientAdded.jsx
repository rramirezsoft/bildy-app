import React from "react";
import Image from "next/image";

export default function ClientAdded({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-96">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Success Image */}
          <Image
            src={"/img/success.png"}
            alt="Success"
            width={80}
            height={80}
            className="my-8"
          />

          {/* Title */}
          <h2 className="text-md font-semibold text-gray-800 mb-4">
            Client saved and created successfully!
          </h2>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 my-3"></div>

          {/* Informative Text */}
          <p className="text-xs text-blue-600 mb-4">
            Do you want to associate a project with this client?
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="btn-secondary px-4 py-2 text-sm font-medium"
          >
            Yes, Let&apos;s go!
          </button>
        </div>
      </div>
    </div>
  );
}
