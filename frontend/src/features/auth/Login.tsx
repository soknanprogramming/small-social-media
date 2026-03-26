import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setToken } from "./jwtSlice";
import axios from "../../libs/axios";
import { AxiosError } from "axios";
import type { LoginResponse } from "./types/login";
import type { RootState } from "../../app/store";

interface FormDate {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = React.useState<FormDate>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.jwt.token);

  useEffect(() => {
    if (token) {
      // Redirect to dashboard or home page
      window.location.href = "/"; // Change this to your desired route
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const { data } = await axios.post<LoginResponse>(
        "/api/users/login",
        payload,
      );
      setSuccessMessage("Login successful!");
      dispatch(setToken(data.token));
      console.log(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        const message = err.response?.data?.error ?? "Something went wrong";
        setApiError(message);
        console.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
