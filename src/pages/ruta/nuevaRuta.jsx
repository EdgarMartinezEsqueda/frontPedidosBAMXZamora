import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import NewRoute from "components/forms/RouteForm";

const NuevaRuta = () => {
  const navigate = useNavigate();

  // Mutación para crear la ruta
  const { mutate, isPending } = useMutation({
    mutationFn: async (nombreRuta) => {
      const { data } = await api.post("/rutas", { nombre: nombreRuta });
      return data;
    },
    onSuccess: () => {
      toast.success("¡Ruta creada exitosamente!");
      navigate("/rutas");
    },
    onError: (error) => {
      const message = error.response?.data?.error.message || "Error al crear la ruta";
      toast.error(message);
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo mb-6 text-center">
          Crear Nueva Ruta
        </h2>
        <NewRoute 
          onSubmit={mutate}
          isSubmitting={isPending}
        />
      </main>
      <Footer />
    </div>
  );
};

export default NuevaRuta;