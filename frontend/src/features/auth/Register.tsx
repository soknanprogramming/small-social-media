import React from "react";
import { useState } from "react";
import axios from "../../libs/axios";
import { AxiosError } from "axios";
import type { RegisterResponse, RegisterRequest } from "./types/register";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
  name: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");

    const payload: RegisterRequest = {
      email: formData.email,
      password: formData.password,
      ...(formData.name.trim() ? { name: formData.name.trim() } : {}),
    };

    try {
      const { data } = await axios.post<RegisterResponse>("/api/users/register", payload);
      setSuccessMessage("Registration successful!");
      navigate("/login");
      console.log("Registration successful!");
      console.log(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        const message = err.response?.data?.error ?? "Something went wrong";
        setApiError(message);
        console.error(message);
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{apiError}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
