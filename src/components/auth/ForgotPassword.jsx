import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "lib/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (email) => api.post("/auth/forgotPassword", { email }),
    onSuccess: () => {
      toast.success("Si el correo existe, se ha enviado un enlace de recuperación");
      navigate("/login");
    },
    onError: (error) => {
      toast.success("Si el correo existe, se ha enviado un enlace de recuperación");
      navigate("/login");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(email);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Recordaste tu contraseña?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;