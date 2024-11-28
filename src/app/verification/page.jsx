"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateEmail } from "../utils/api";

// Función para formatear el correo con asteriscos
const maskEmail = (email) => {
  const [name, domain] = email.split("@");
  const maskedName = name.slice(0, 3) + "****"; // mostramos las 3 primeras letras
  return `${maskedName}@${domain}`;
};

export default function Verification() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Recuperamos el correo desde localStorage
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Si no hay correo almacenado, redirigimos a la página de registro
      router.push("/register");
    }
  }, [router]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

    // Enfocar el siguiente input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      if (code[index] === "" && event.target.previousSibling) {
        // Si el input actual está vacío, retrocede al anterior
        event.target.previousSibling.focus();
      }
      setCode([...code.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bytoken="))
      .split("=")[1];
    const verificationCode = code.join("");

    try {
      await validateEmail(verificationCode, token);
      setSuccess(true);
      // Solo eliminamos el correo después de que la verificación sea exitosa
      localStorage.removeItem("email");
      router.push("/dashboard/clients");
    } catch (error) {
      setError("Invalid verification code");
    }
  };

  const maskedEmail = maskEmail(email); // Aplicamos el formato enmascarado

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-4">
          Enter verification code
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          We have just sent a verification code to{" "}
          <span className="font-medium">{maskedEmail}</span>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex space-x-2 justify-center mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm mb-4">
              Verification successful! Redirecting...
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 text-sm rounded-lg hover:bg-teal-600 transition duration-200"
          >
            Verify
          </button>
        </form>
        <div className="text-center mt-4">
          <button className="text-sm text-teal-500 hover:underline">
            Send the code again
          </button>
        </div>
      </div>
    </div>
  );
}
