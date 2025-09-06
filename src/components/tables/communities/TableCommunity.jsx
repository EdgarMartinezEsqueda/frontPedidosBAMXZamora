import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "lib/axios";
import ActionButtons from "components/buttons/ActionButtons";
import { RESOURCES } from "utils/permisos";

const TableCommunities = ({ currentPage, pageSize, filters, setTotalCommunities }) => {
  const queryClient = useQueryClient();

  // Obtiene datos paginados y filtrados del servidor
  const { data: communities, isLoading, isError } = useQuery({
    queryKey: ["comunidades", currentPage, pageSize, filters],
    queryFn: async () => {
      try{
        const params = { page: currentPage, pageSize };
      
        // Agregar filtros solo si tienen valores
        if (filters.comunidades.length > 0) {
          params.comunidades = filters.comunidades.join(',');
        }
        if (filters.rutas.length > 0) {
          params.rutas = filters.rutas.join(',');
        }
        if (filters.municipios.length > 0) {
          params.municipios = filters.municipios.join(',');
      }

      const { data } = await api.get("/comunidades/paginadas/todas", { params });
      
      // Actualizar el total de comunidades (para la paginación)
      setTotalCommunities(data.total);
      return data.communities;
    } catch (error) {
      console.error("Error al obtener las comunidades:", error);
      return [];
    }
    },
    keepPreviousData: true // Para mejor UX al cambiar de página
  });

  // Mutación para eliminar comunidades
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/comunidades/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["comunidades"]);
      toast.success("Comunidad eliminada correctamente");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error eliminando la comunidad");
    }
  });
  
  // Manejo de estados de carga y error
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-verdeLogo">Cargando las comunidades</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-rojoLogo">Error cargando las comunidades</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto m-6">
      <div className="flex flex-col items-center">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block md:min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800 hidden md:table-header-group">
                  <tr>
                    <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      ID
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Comunidad
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Municipio
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Jefa Comunidad
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Ruta
                    </th>
                    <th className="relative py-3.5 px-4">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900 text-black dark:text-white">
                  {communities && communities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                        No se encontraron comunidades con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    communities.map((item) => (
                      <tr key={item.id} className="block md:table-row border-b border-gray-200 dark:border-gray-700 mb-4 md:mb-0 bg-white dark:bg-gray-800 shadow-sm md:shadow-none">
                        <td 
                          data-th="ID"
                          className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap text-right md:text-left before:content-[attr(data-th)':_'] before:font-bold before:absolute before:left-4 before:text-gray-600 dark:before:text-gray-300 relative pl-28 md:before:content-none md:pl-4 even:bg-gray-50 dark:even:bg-gray-700/30">
                          {item.id}
                        </td>
                        <td 
                          data-th="Nombre"
                          className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap text-right md:text-left before:content-[attr(data-th)':_'] before:font-bold before:absolute before:left-4 before:text-gray-600 dark:before:text-gray-300 relative pl-28 md:before:content-none md:pl-4 even:bg-gray-50 dark:even:bg-gray-700/30">
                          {item.nombre}
                        </td>
                        <td 
                          data-th="Municipio"
                          className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap text-right md:text-left before:content-[attr(data-th)':_'] before:font-bold before:absolute before:left-4 before:text-gray-600 dark:before:text-gray-300 relative pl-28 md:before:content-none md:pl-4 even:bg-gray-50 dark:even:bg-gray-700/30">
                          {item.nombreMunicipio}
                        </td>
                        <td 
                          data-th="Jefa"
                          className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap text-right md:text-left before:content-[attr(data-th)':_'] before:font-bold before:absolute before:left-4 before:text-gray-600 dark:before:text-gray-300 relative pl-28 md:before:content-none md:pl-4 even:bg-gray-50 dark:even:bg-gray-700/30">
                          {item.jefa || "Sin jefa asignada"}
                        </td>
                        <td 
                          data-th="Ruta"
                          className="block md:table-cell py-4 px-4 text-sm whitespace-nowrap text-right md:text-left before:content-[attr(data-th)':_'] before:font-bold before:absolute before:left-4 before:text-gray-600 dark:before:text-gray-300 relative pl-28 md:before:content-none md:pl-4 even:bg-gray-50 dark:even:bg-gray-700/30">
                          {item.nombreRuta}
                        </td>
                        <td className="block md:table-cell px-4 py-4 text-sm whitespace-nowrap relative even:bg-gray-50 dark:even:bg-gray-700/30">
                          <ActionButtons 
                            item={item}
                            resource={RESOURCES.COMUNIDADES}
                            basePath="comunidades"
                            onDelete={deleteMutation.mutate}
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

export default TableCommunities;