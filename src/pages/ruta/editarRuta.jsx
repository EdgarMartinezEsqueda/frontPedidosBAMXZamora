import { useMutation, useQuery } from "@tanstack/react-query";
import api from "lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

import Footer from "components/footer/Footer";
import RouteForm from "components/forms/RouteForm";
import Navbar from "components/navbar/Navbar";

const EditRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Consulta para obtener los datos de la ruta
  const { data: routeData, isLoading, isError, error } = useQuery({
    queryKey: ["route", id],
    queryFn: async () => {
      const { data } = await api.get(`/rutas/${id}`);
      return data;
    }
  });

  // Mutación para actualizar la ruta
  const { mutate, isPending } = useMutation({
    mutationFn: async (routeData) => {
      const { data } = await api.patch(`/rutas/${id}`, routeData);
      return data;
    },
    onSuccess: () => {
      toast.success("¡Ruta actualizada exitosamente!");
      navigate("/rutas");
    },
    onError: (error) => {
      const message = error.response?.data?.error.message || "Error al actualizar la ruta";
      toast.error(message);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verdeLogo"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Cargando datos de la ruta...
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Error al cargar la ruta
            </p>
            <p className="text-red-500 dark:text-red-300 text-sm mt-1">
              {error.message}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo mb-6 text-center">
          Editar Ruta
        </h2>
        <RouteForm 
          onSubmit={mutate}
          isSubmitting={isPending}
          existingRoute={routeData}
        />
      </main>
      <Footer />
    </div>
  );
};

export default EditRoute;