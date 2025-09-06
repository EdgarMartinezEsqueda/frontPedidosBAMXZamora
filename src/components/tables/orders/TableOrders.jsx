import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "lib/axios";
import ActionButtons from "components/buttons/ActionButtons";
import { RESOURCES } from "utils/permisos";

const TableComponent = ({ currentPage, pageSize, filters, setTotalOrders }) => {
  const queryClient = useQueryClient();

  // Obtiene datos paginados y filtrados del servidor
  const { data: ordersData, isLoading, isError } = useQuery({
    queryKey: ["pedidos", currentPage, pageSize, filters],
    queryFn: async () => {
      try {
        const params = { page: currentPage, pageSize };
      
        // Agregar filtros
        if (filters.usuarios && filters.usuarios.length > 0) {
          params.trabajadores = filters.usuarios.join(',');
        }
        if (filters.rutas && filters.rutas.length > 0) {
          params.rutas = filters.rutas.join(',');
        }
        if (filters.estatusPedido && filters.estatusPedido.length > 0) {
          params.estatus = filters.estatusPedido.join(',');
        }
        if (filters.rangoFechas) {
          params.fechaInicio = filters.rangoFechas.startDate;
          params.fechaFin = filters.rangoFechas.endDate;
        }

        const { data } = await api.get("/pedidos", { params });
        setTotalOrders(data.total);
        
        return data.pedidos;
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        return [];
      }
    },
    keepPreviousData: true // Para mejor UX al cambiar de página
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/pedidos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pedidos"]);
      toast.success("Pedido eliminado correctamente");
    },
    onError: () => {
      toast.error("Error eliminando el pedido");
    }
  });

  const getStatusStyle = (estado) => {
    const styles = {
      finalizado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    };
    return styles[estado] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-verdeLogo">Cargando los pedidos</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-rojoLogo">Error cargando los pedidos</p>
      </div>
    );
  }

  const pedidos = ordersData || [];

  return (
    <section className="container mx-auto m-6">
      <div className="w-full overflow-hidden rounded-lg lg:border lg:border-gray-200 lg:dark:border-gray-700">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-black dark:text-white">
          <thead className="hidden lg:table-header-group bg-gray-50 dark:bg-gray-800">
            <tr>
              {["ID", "Ruta", "Fecha", "Estatus", "Trabajador social", "Opciones"].map((header) => (
                <th key={header} className="px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y lg:divide-gray-200 lg:dark:divide-gray-700 lg:dark:bg-gray-900">
            {pedidos.length === 0 ? (
              <tr className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent">
                <td colSpan="6" className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400 block lg:table-cell">
                  No se encontraron pedidos con los filtros seleccionados
                </td>
              </tr>
            ) : (
              pedidos.map((item) => (
                <tr key={item.id} className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent">
                  {/* ID */}
                  <td 
                    data-th="ID"
                    className="hidden lg:table-cell px-4 py-4 text-sm text-center">
                    {item.id}
                  </td>

                  {/* Ruta */}
                  <td 
                    data-th="Ruta"
                    className="block lg:table-cell px-4 py-4 text-sm text-center">
                    {item.ruta.nombre}
                  </td>

                  {/* Fecha */}
                  <td 
                    data-th="Fecha"
                    className="block lg:table-cell px-4 py-4 text-sm text-center">
                    {item.fechaEntrega}
                  </td>

                  {/* Estatus */}
                  <td 
                    data-th="Estatus"
                    className="block lg:table-cell px-4 py-4 text-sm text-center">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(item.estado)}`}>
                      {item.estado}
                    </span>
                  </td>

                  {/* Trabajador */}
                  <td 
                    data-th="Trabajador"
                    className="block lg:table-cell px-4 py-4 text-sm text-center">
                    {item.usuario.username}
                  </td>

                  {/* Opciones */}
                  <td className="block md:table-cell px-4 py-4 text-sm text-center">
                    <ActionButtons
                      item={item}
                      resource={RESOURCES.PEDIDOS}
                      basePath="pedido"
                      onDelete={deleteMutation.mutate}
                      getEditCondition={(item) => item.estado === "finalizado"}
                      getDeleteCondition={(item) => item.estado === "finalizado"}
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

export default TableComponent;