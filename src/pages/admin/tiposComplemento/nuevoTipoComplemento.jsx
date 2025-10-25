import { useMutation } from "@tanstack/react-query";
import Footer from "components/footer/Footer";
import TipoComplementoForm from "components/forms/TypeComplementForm";
import Navbar from "components/navbar/Navbar";
import api from "lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const NuevoTipoComplemento = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (tipoData) => {
      const { data } = await api.post("/tiposComplemento", tipoData);
      return data;
    },
    onSuccess: () => {
      toast.success("¡Tipo de complemento creado exitosamente!");
      navigate("/tiposComplemento");
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || "Error al crear el tipo de complemento";
      toast.error(message);
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo mb-6 text-center">
          Crear Nuevo Tipo de Complemento
        </h2>
        <TipoComplementoForm onSubmit={mutate} isSubmitting={isPending} />
      </main>
      <Footer />
    </div>
  );
};

export default NuevoTipoComplemento;