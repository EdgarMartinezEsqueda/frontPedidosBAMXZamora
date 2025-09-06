import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "lib/axios";
import { RxUpdate } from "react-icons/rx";

const ReturnToEditButton = ({ id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(`/pedidos/rollback/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Pedido regresado a edición");
      queryClient.invalidateQueries(["pedido", id]);
    },
    onError: (error) => {
      console.error(error);
      toast.error("No se pudo regresar el pedido a edición");
    },
  });

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-amarilloLogo text-black rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <RxUpdate className="text-lg" />
        {mutation.isLoading ? "Cargando..." : "Regresar a edición"}
      </button>
    </div>
  );
};

export default ReturnToEditButton;
