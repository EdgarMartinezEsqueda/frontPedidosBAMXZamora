import React, { useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from "lib/axios";
import ActionButtons from "components/buttons/ActionButtons";
import { RESOURCES } from "utils/permisos";

const TableTicket = ({ currentPage, pageSize, filters, setTotalTickets }) => {
  const queryClient = useQueryClient();

  // Obtener tickets paginados del servidor
   const { data: allTickets, isLoading } = useQuery({
    queryKey: ["tickets", currentPage, pageSize],
    queryFn: async () => {
      const { data } = await api.get("/tickets", {
        params: { page: currentPage, pageSize }
      });
      return data;
    }
  });

  // Filtrar datos localmente
  const filteredData = useMemo(() => {
    if (!allTickets) return [];
    
    return allTickets.filter(ticket => {
      const matchesStatus = filters.estatus.length === 0 || 
        filters.estatus.includes(ticket.estatus);
      
      const matchesPriority = filters.prioridad.length === 0 || 
        filters.prioridad.includes(ticket.prioridad);
      
      return matchesStatus && matchesPriority;
    });
  }, [allTickets, filters]);

  // Paginación local
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Actualizar el total de tickets cuando cambian los datos filtrados
  useEffect(() => {
    setTotalTickets(filteredData.length);
  }, [filteredData, setTotalTickets]);

  // Mutación para eliminar tickets
  const deleteMutation = useMutation({
    mutationFn: (id) => api.patch(`/tickets/${id}`, { estatus: "cancelado" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("Ticket cancelado correctamente");
    },
    onError: () => {
      toast.error("Error eliminando el ticket");
    }
  });


  // Estilos para los badges
  const getPriorityStyle = (priority) => {
    const styles = {
      baja: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      alta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    };
    return styles[priority] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  };

  const getStatusStyle = (status) => {
    const styles = {
      abierto: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      en_proceso: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      cerrado: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
      cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    };
    return styles[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  };

  return (
    <section className="container mx-auto m-6">
      <div className="flex flex-col items-center">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block md:min-w-full py-2 align-middle md:px-6 lg:px-8">
            {/* 🌱 overflow-x-auto para hacer la tabla responsiva */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 md:rounded-lg max-w-full">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 hidden md:table-header-group">
                  <tr>
                    <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400 md:w-[80px]">ID</th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400 md:w-1/3 max-w-[300px]">Descripción</th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400 md:w-[120px]">Prioridad</th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400 md:w-[120px]">Estado</th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400 md:w-[180px]">Fecha</th>
                    <th className="relative py-3.5 px-4 md:w-[100px]">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 text-black dark:text-white">
                  {!paginatedData || paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                        {isLoading ? "Cargando..." : "No se encontraron tickets con los filtros seleccionados"}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((ticket) => (
                      <tr key={ticket.id} className="block md:table-row border-b border-gray-200 dark:border-gray-700 mb-4 md:mb-0 bg-white dark:bg-gray-800 shadow-sm md:shadow-none">
                        <td data-th="ID" className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap md:text-left relative pl-28 md:pl-4 md:before:content-none even:bg-gray-50 dark:even:bg-gray-700/30 max-md:hidden">
                          <Link to={`/tickets/${ticket.id}`} className="text-verdeLogo hover:underline">
                            #{ticket.id}
                          </Link>
                        </td>
                        <td data-th="Descripción" className="block md:table-cell py-4 px-4 text-sm md:text-left relative pl-28 md:pl-4 md:max-w-[300px] md:before:content-none even:bg-gray-50 dark:even:bg-gray-700/30">
                          <span className="line-clamp-2 md:line-clamp-none md:overflow-hidden md:whitespace-nowrap md:text-ellipsis">
                            {ticket.descripcion}
                          </span>
                        </td>
                        <td data-th="Prioridad" className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap md:text-left relative pl-28 md:pl-4 md:before:content-none even:bg-gray-50 dark:even:bg-gray-700/30">
                          <span className={`px-2 py-1 rounded-full text-sm ${getPriorityStyle(ticket.prioridad)}`}>
                            {ticket.prioridad}
                          </span>
                        </td>
                        <td data-th="Estado" className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap md:text-left relative pl-28 md:pl-4 md:before:content-none even:bg-gray-50 dark:even:bg-gray-700/30">
                          <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(ticket.estatus)}`}>
                            {ticket.estatus}
                          </span>
                        </td>
                        <td data-th="Fecha" className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap md:text-left relative pl-28 md:pl-4 md:before:content-none even:bg-gray-50 dark:even:bg-gray-700/30">
                          { new Date(ticket.createdAt).toLocaleString("es-MX", {hour12: false}) }
                        </td>
                        <td className="block md:table-cell px-4 py-4 text-sm whitespace-nowrap relative even:bg-gray-50 dark:even:bg-gray-700/30">
                          <ActionButtons 
                            item={ticket}
                            resource={RESOURCES.TICKETS}
                            basePath="tickets"
                            onDelete={deleteMutation.mutate}
                            getEditCondition={ (ticket) => ["cerrado", "cancelado"].includes(ticket.estatus) }
                            getDeleteCondition={ (ticket) => ["cerrado", "cancelado"].includes(ticket.estatus) }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

};

export default TableTicket;