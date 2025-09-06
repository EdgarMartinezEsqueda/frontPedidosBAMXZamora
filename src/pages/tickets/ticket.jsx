import { useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "lib/axios";
import { useAuth } from "context/AuthContext";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";

const VerTicket = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: ticket, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => (await api.get(`/tickets/${id}`)).data
  });

  const { mutate: updateTicket, isPending } = useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(`/tickets/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Ticket actualizado");
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error actualizando ticket");
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-verdeLogo">Cargando el ticket</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-rojoLogo">Error cargando el ticket</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo dark:text-green-400 mb-6 text-center">
          Ticket #{ticket.id}
        </h2>

        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <InfoRow label="Estado" value={ticket.estatus} />
          <InfoRow label="Usuario que levantó el ticket" value={ticket.usuario.username} />
          <InfoRow label="Prioridad" value={ticket.prioridad} />
          <InfoRow label="Descripción del problema" value={ticket.descripcion} />
          <InfoRow label="Comentarios del encargado de soporte" value={ticket.comentarios ?? "No se han escrito comentarios"} />
          <InfoRow label="Fecha de creación" value={new Date(ticket.createdAt).toLocaleDateString()} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Componentes auxiliares (reutilizables)
const LoadingState = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center">
      Cargando ticket...
    </main>
    <Footer />
  </div>
);

const ErrorState = ({ error }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center text-red-600">
      Error: {error.message}
    </main>
    <Footer />
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 break-words">{value}</dd>
  </div>
);

export default VerTicket;