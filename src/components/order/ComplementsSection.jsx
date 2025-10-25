import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AgregarComplementoButton from "components/buttons/AddComplementButton";
import ModalComplemento from "components/modals/ModalComplemento";
import { useAuth } from "context/AuthContext";
import { useConfirmDelete } from "hooks/useConfirmDelete";
import api from "lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiCube } from "react-icons/hi";
import { hasPermission, RESOURCES } from "utils/permisos";

const ComplementosSection = ({ idPedido, pedidoFinalizado = false, puedeEditar = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [complementoAEditar, setComplementoAEditar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { confirmDelete } = useConfirmDelete();

  // Obtener complementos del pedido
  const { data: complementos, isLoading } = useQuery({
    queryKey: ["complementos", idPedido],
    queryFn: async () => {
      const data  = await api.get(`/complementos/pedido/${idPedido}`);
      return data.data;
    }
  });

  // Mutation para eliminar
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/complementos/${id}`),
    onSuccess: () => {
      toast.success("Complemento eliminado correctamente");
      queryClient.invalidateQueries(["complementos", idPedido]);
      queryClient.invalidateQueries(["pedido", idPedido]);
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || "Error al eliminar complemento";
      toast.error(message);
    }
  });

  const handleEdit = (complemento) => {
    setComplementoAEditar(complemento);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await confirmDelete(deleteMutation.mutate, id, {});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setComplementoAEditar(null);
  };

  // Calcular totales
  const totales = complementos?.reduce(
    (acc, comp) => ({
      peso: acc.peso + parseFloat(comp.pesoKg),
      costo: acc.costo + parseFloat(comp.costoTotal)
    }),
    { peso: 0, costo: 0 }
  ) || { peso: 0, costo: 0 };

  const puedeActualizarComplemento = hasPermission(user.data, RESOURCES.COMPLEMENTOS, "update", idPedido);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto my-6 p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto my-2 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {/* Header */}
<div className="border-b dark:border-gray-700 px-6 py-4">
  <div className="flex justify-between items-center flex-wrap gap-4">

    {/* Título + chip */}
    <div className="flex flex-col gap-1">
      <h3 className="text-2xl font-bold text-verdeLogo flex items-center gap-2">
        <HiCube className="w-6 h-6" />
        Complementos del Pedido
      </h3>

      {complementos?.length > 0 && (
        <span className="bg-verdeLogo/90 text-white px-3 py-0.5 w-fit rounded-full text-xs font-semibold shadow-sm">
          {complementos.length}{" "}
          {complementos.length === 1 ? "complemento" : "complementos"}
        </span>
      )}
    </div>

    {/* Botón */}
    {puedeActualizarComplemento && (
      <div className="flex-shrink-0">
        <AgregarComplementoButton idPedido={idPedido} />
      </div>
    )}

  </div>
</div>

          {/* Content */}
          {!complementos || complementos.length === 0 ? (
            <div className="p-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <HiCube className="w-16 h-16 text-gray-400" />

                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No hay complementos registrados para esta ruta
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Lista de complementos */}
              <div className="divide-y dark:divide-gray-700">
                {complementos.map((complemento) => (
                  <div key={complemento.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Info del complemento */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {complemento.tipo?.nombre}
                          </h4>
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium uppercase">
                            {complemento.tipo?.unidadMedida}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Cantidad:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {parseFloat(complemento.cantidad).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Peso:</span>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {parseFloat(complemento.pesoKg).toFixed(2)} kg
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Costo Total:</span>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              ${parseFloat(complemento.costoTotal).toFixed(2)}
                            </p>
                          </div>
                          {complemento.costoPorUnidad && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Costo/Unidad:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                ${parseFloat(complemento.costoPorUnidad).toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>

                        {complemento.observaciones && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Observaciones:</span>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                              {complemento.observaciones}
                            </p>
                          </div>
                        )}

                        {complemento.registrador && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Registrado por: {complemento.registrador.username}
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      {puedeEditar && !pedidoFinalizado && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(complemento)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(complemento.id)}
                            disabled={deleteMutation.isPending}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de totales */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t dark:border-gray-700">
                <div className="flex justify-end gap-8 text-sm">
                  <div className="text-right">
                    <span className="text-gray-500 dark:text-gray-400">Peso Total:</span>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {totales.peso.toFixed(2)} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 dark:text-gray-400">Costo Total:</span>
                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                      ${totales.costo.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <ModalComplemento
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        idPedido={idPedido}
        complementoExistente={complementoAEditar}
      />
    </>
  );
};

export default ComplementosSection;