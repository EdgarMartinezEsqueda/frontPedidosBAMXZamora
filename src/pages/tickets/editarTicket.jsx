import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TicketForm from "components/forms/TicketForm";

const EditarTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: ticket, isLoading, isError } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => (await api.get(`/tickets/${id}`)).data
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await api.patch(`/tickets/${id}`, data),
    onSuccess: () => {
      toast.success("¡Ticket actualizado!");
      navigate("/tickets");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error al actualizar ticket");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center">
          Cargando datos del ticket...
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
          Error cargando el ticket
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
          Editar Ticket #{id}
        </h2>
        
        <TicketForm 
          onSubmit={mutate}
          isSubmitting={isPending}
          existingTicket={ticket}
        />
      </main>
      <Footer />
    </div>
  );
};

export default EditarTicket;