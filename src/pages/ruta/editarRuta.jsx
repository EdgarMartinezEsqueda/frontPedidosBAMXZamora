import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import RouteForm from "components/forms/RouteForm";

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
    mutationFn: async (nombreRuta) => {
      const { data } = await api.patch(`/rutas/${id}`, { nombre: nombreRuta });
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
          Cargando datos de la ruta...
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center text-red-500">
          Error: {error.message}
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