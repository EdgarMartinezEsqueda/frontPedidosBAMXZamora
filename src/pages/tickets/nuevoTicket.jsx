import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TicketForm from "components/forms/TicketForm";

const NuevoTicket = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (newTicket) => {
      const { data } = await api.post("/tickets", newTicket);
      return data;
    },
    onSuccess: () => {
      toast.success("¡Ticket creado con éxito!");
      navigate("/tickets");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error al crear ticket");
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo mb-6 text-center">
          Crear Nuevo Ticket
        </h2>
        <TicketForm 
          onSubmit={mutate}
          isSubmitting={isPending}
        />
      </main>
      <Footer />
    </div>
  );
};

export default NuevoTicket;