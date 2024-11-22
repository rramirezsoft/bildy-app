"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Enviamos el formulario a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);

      const result = await register(formData); // Llamada a la API desde la funcion register de utils/api.js
      if (result.success) {
        document.cookie = `bytoken=${result.token}; path=/;`; // Guardamos el token generado en una cookie
        setError(null);
        setSuccess(true);
        router.push(result.redirectTo);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error registrando usuario");
    }
  };

  // Función para mostrar u ocultar la contraseña
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Create your ZoSale ID</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="w-1/2 px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className="w-1/2 px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => handleShowPassword()}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2 text-xs">
                By proceeding, you agree to the{" "}
                <a href="/terms" className="text-teal-500">
                  Terms and Conditions
                </a>
              </span>
            </label>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 mb-4">
              Register success! Check your email to verify your account
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 text-sm rounded-lg hover:bg-teal-600 transition duration-200"
          >
            Sing up with email
          </button>
        </form>
      </div>
    </div>
  );
}
