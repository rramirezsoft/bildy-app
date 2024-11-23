"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(email, password);
      if (result.token) {
        document.cookie = `bytoken=${result.token}; path=/;`;
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Error logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login to your account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-between text-sm mb-6">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="form-checkbox" />
              <label htmlFor="remember" className="text-gray-600 text-xs">
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-teal-500 text-xs hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 text-sm rounded-lg hover:bg-teal-600 transition duration-200"
          >
            Sign in with email
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-xs text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-teal-500 hover:underline font-medium"
            >
              Get Started
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
