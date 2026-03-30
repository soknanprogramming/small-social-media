import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { setLoggedIn } from "../loginSlice";
import axios from "../../../libs/axios";
import type { LoginResponse } from "../types/login";
import type FormData from "../types/FormData";

export const useLogin = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");

    try {
      const response = await axios.post<LoginResponse>("/api/users/login", formData);
      // Store the token in localStorage for authentication
      if (response.data.token) {
        console.log("Received token:", response.data.token); // Debug log
        localStorage.setItem("token", response.data.token);
      }
      dispatch(setLoggedIn(true));
      navigate("/");
    } catch (err: any) {
      setApiError(err.response?.data?.error ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    apiError,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword: () => setShowPassword((v) => !v),
  };
};