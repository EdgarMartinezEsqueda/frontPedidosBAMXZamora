import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import CommunityForm from "components/forms/CommunityForm";

const NuevaComunidad = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (NewCommunity) => {
      const { data } = await api.post("/comunidades", NewCommunity);
      return data;
    },
    onSuccess: () => {
      toast.success("¡Comunidad creada!");
      navigate("/comunidades");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error al crear comunidad");
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo mb-6 text-center">
          Crear Nueva Comunidad
        </h2>
        <CommunityForm 
          onSubmit={mutate}
          isSubmitting={isPending}
        />
      </main>
      <Footer />
    </div>
  );
};

export default NuevaComunidad;