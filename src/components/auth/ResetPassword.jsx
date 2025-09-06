import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "lib/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.post(`/auth/resetPassword/${token}`, data),
    onSuccess: () => {
      toast.success("Contraseña actualizada exitosamente");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || "Error al actualizar contraseña");
      navigate("/login");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    mutate({ password: formData.password, confirmPassword: formData.confirmPassword });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
          Restablecer contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nueva contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength="6"
              autoComplete=""
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength="6"
              autoComplete=""
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Actualizando..." : "Restablecer contraseña"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;