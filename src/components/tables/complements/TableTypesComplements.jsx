import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import ActionButtons from "components/buttons/ActionButtons";
import api from "lib/axios";
import { RESOURCES } from "utils/permisos";

const TablaTiposComplemento = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tiposComplemento"],
    queryFn: async () => {
      const data  = await api.get("/tiposComplemento");
      return data.data;
    },
    onError: () => toast.error("Error cargando tipos de complemento")
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tiposComplemento/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposComplemento"]);
      toast.success("Tipo de complemento desactivado correctamente");
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || "Error al desactivar el tipo de complemento";
      toast.error(message);
    }
  });

  // Mapeo de unidades para mostrar más legible
  const unidadMedidaLabel = {
    kg: "Kilogramos (kg)",
    pz: "Piezas (pz)",
    lt: "Litros (lt)",
    caja: "Cajas"
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error al cargar los tipos de complemento
      </div>
    );
  }

  return (
    <section className="container mx-auto m-6">
      <div className="w-full overflow-hidden rounded-lg lg:border lg:border-gray-200 lg:dark:border-gray-700">
        <table className="w-full divide-y lg:divide-gray-200 lg:dark:divide-gray-700 text-black dark:text-white">
          {/* Cabecera solo para desktop */}
          <thead className="hidden lg:table-header-group dark:bg-gray-800">
            <tr>
              {["ID", "Nombre", "Unidad de Medida", "Acciones"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className=" divide-y divide-gray-200 dark:divide-gray-600 lg:dark:divide-gray-700 lg:dark:bg-gray-900">
            {!data || data.length === 0 ? (
              <tr className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent">
                <td 
                  colSpan="5" 
                  className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400 block lg:table-cell"
                >
                  No hay tipos de complemento registrados.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr 
                  key={item.id}
                  className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent"
                >
                  {/* ID */}
                  <td className="hidden lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit dark:bg-gray-800 text-center">
                    <div className="flex justify-between items-center lg:block gap-2">
                      <span className="text-gray-400 lg:hidden">ID</span>
                      <span className="dark:text-white">{item.id}</span>
                    </div>
                  </td>

                  {/* Nombre */}
                  <td className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit dark:bg-gray-800 text-center">
                    <div className="flex justify-between items-center lg:block gap-2">
                      <span className="text-gray-400 lg:hidden">Nombre</span>
                      <span className="dark:text-white font-medium">{item.nombre}</span>
                    </div>
                  </td>

                  {/* Unidad de Medida */}
                  <td className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit dark:bg-gray-800 text-center">
                    <div className="flex justify-between items-center lg:block gap-2">
                      <span className="text-gray-400 lg:hidden">Unidad de Medida</span>
                      <span className="dark:text-white">
                        {unidadMedidaLabel[item.unidadMedida] || item.unidadMedida}
                      </span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit dark:bg-gray-800 text-center">
                    <ActionButtons
                      item={item}
                      resource={RESOURCES.TIPOS_COMPLEMENTO}
                      basePath="tiposComplemento"
                      onDelete={deleteMutation.mutate}
                      deleteDisabled={!item.activo}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TablaTiposComplemento;