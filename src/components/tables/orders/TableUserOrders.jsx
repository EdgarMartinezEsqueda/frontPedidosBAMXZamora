import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "lib/axios";
import ActionButtons from "components/buttons/ActionButtons";
import { RESOURCES } from "utils/permisos";
import { useAuth } from "context/AuthContext";

const TableComponent = ({  currentPage, pageSize, filters, setTotalOrders }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Obtiene TODOS los datos paginados del servidor
  const { data: allOrders, isLoading } = useQuery({
    queryKey: ["pedidos", currentPage, pageSize],
    queryFn: async () => {
      const { data } = await api.get(`/pedidos/ts/${user.data.id}`, {
        params: { page: currentPage, pageSize }
      });
      setTotalOrders(data.length);
      return data;
    }
  });

  // Filtrar datos localmente
  const filteredData = useMemo(() => {
    if (!allOrders) return [];
    
    return allOrders.filter(order => {
      const matchesRoute = filters.rutas.length === 0 ||  filters.rutas.includes(order.ruta.nombre);
      const matchesStatus = filters.estatusPedido.length === 0 || filters.estatusPedido.includes(order.estado);
      
      const { startDate, endDate } = filters.rangoFechas || {};
      const orderDate = order.fechaEntrega;  // formato "YYYY-MM-DD"
      const matchesDate = (!startDate || orderDate >= startDate) &&  (!endDate || orderDate <= endDate);
    
      return matchesStatus && matchesRoute && matchesDate;
    });
  }, [allOrders, filters]);

  // Paginación local
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  
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
  
  return (
    <section className="container mx-auto m-6">
      <div className="w-full overflow-hidden rounded-lg lg:border lg:border-gray-200 lg:dark:border-gray-700">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-black dark:text-white">
          {/* Cabecera solo para desktop */}
          <thead className="hidden lg:table-header-group bg-gray-50 dark:bg-gray-800">
            <tr>
              {["ID", "Ruta", "Fecha", "Estatus", "Opciones"].map((header) => (
                <th key={header} className="px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white text-center"> {header}</th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y lg:divide-gray-200 lg:dark:divide-gray-700 lg:dark:bg-gray-900">
            {paginatedData.length === 0 ? (
              <tr className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent">
                <td 
                  colSpan="6" 
                  className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400 block lg:table-cell"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr 
                  key={index}
                  className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent"
                >
                  {/* ID */}
                  <td data-th="ID" className="hidden lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit bg-gray-50 dark:bg-gray-800 text-center" >
                    <div className="flex justify-between items-center lg:block gap-2">
                      <span className="text-gray-400 lg:hidden">ID</span>
                      <span className="dark:text-white">{item.id}</span>
                    </div>
                  </td>

                  {/* Ruta */}
                  <td data-th="Ruta" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit bg-gray-50 dark:bg-gray-800 text-center" >
                    <div className="flex justify-between items-center lg:block gap-2">
                      <span className="text-gray-400 lg:hidden">Ruta</span>
                      <span className="dark:text-white">{item.ruta.nombre}</span>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td data-th="Fecha" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit bg-gray-50 dark:bg-gray-800 text-center" >
                    <div className="flex justify-between items-center lg:block gap-2">
                      <span className="text-gray-400 lg:hidden">Fecha</span>
                      <span className="dark:text-white">{item.fechaEntrega}</span>
                    </div>
                  </td>

                  {/* Estatus */}
                  <td data-th="Estatus" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap lg:!bg-inherit bg-gray-50 dark:bg-gray-800 text-center" >
                    <div className="flex justify-between items-center lg:block gap-2">
                      <span className="text-gray-400 lg:hidden">Estatus</span>
                      <span className={`px-2 py-1 rounded-full dark:text-white`}>
                        {item.estado}
                      </span>
                    </div>
                  </td>

                  {/* Opciones */}
                  <td className="block md:table-cell px-4 py-4 text-sm whitespace-nowrap relative even:bg-gray-50 dark:even:bg-gray-700/30">
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