"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  // Función para volver al dashboard
  const handleGoHome = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white shadow-xl rounded-lg p-8 w-96 border border-gray-300">
        <Image
          src="/img/logo_bildy.png"
          alt="Bildy Logo"
          width={150}
          height={50}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          The page you are looking for doesn&apos;t exist. Please check the URL
          or go back to the dashboard.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
