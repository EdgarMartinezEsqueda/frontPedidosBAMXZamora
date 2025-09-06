import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import CommunityForm from "components/forms/CommunityForm";

const EditarComunidad = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: comunidad, isLoading, isError } = useQuery({
    queryKey: ["comunidad", id],
    queryFn: async () => (await api.get(`/comunidades/${id}`)).data
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await api.patch(`/comunidades/${id}`, data),
    onSuccess: () => {
      toast.success("¡Comunidad actualizada!");
      navigate("/comunidades");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error al actualizar");
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
          Editar Comunidad
        </h2>
        
        <CommunityForm 
          onSubmit={mutate}
          isSubmitting={isPending}
          existingCommunity={comunidad}
        />
      </main>
      <Footer />
    </div>
  );
};

export default EditarComunidad;