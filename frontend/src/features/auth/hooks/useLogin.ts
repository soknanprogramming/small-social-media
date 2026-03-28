// features/login/hooks/useLogin.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { setLoggedIn } from "../loginSlice";
import axios from "../../../libs/axios";
import { AxiosError } from "axios";
import type { LoginResponse } from "../types/login";
import type FormData from "../types/FormData";

export const useLogin = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // debugger;
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setApiError("");

    try {
      await axios.post<LoginResponse>("/api/users/login", formData);
      setSuccessMessage("Login successful!");
      dispatch(setLoggedIn(true));
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        setApiError(err.response?.data?.error ?? "Something went wrong");
      } else {
        setApiError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    apiError,
    successMessage,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword: () => setShowPassword((v) => !v),
  };
};