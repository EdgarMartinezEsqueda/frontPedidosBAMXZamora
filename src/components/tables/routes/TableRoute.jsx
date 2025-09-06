import React from "react";

const TableRoute = ({ mode, data, handleChange }) => {
  const headers = ["ID", "Comunidad", "Encargada", "Contacto", "Dirección", "Municipio"];

  return (
    <div className="w-full overflow-hidden rounded-lg lg:border lg:border-gray-700 lg:dark:border-gray-700">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-black dark:text-white">
        <thead className="hidden lg:table-header-group bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white lg:text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 lg:dark:divide-gray-700 lg:dark:bg-gray-900">
          {!data || data.length === 0 ? (
            <tr className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent">
            <td colSpan="6" className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400 block lg:table-cell" >
              No hay datos disponibles.
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={index} className="block lg:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 lg:p-0 lg:shadow-none lg:bg-transparent" >
              {/* ID */}
              <td data-th="ID" className="hidden lg:table-cell px-4 py-4 text-sm whitespace-nowrap dark:text-white lg:!bg-inherit bg-gray-50 dark:bg-gray-800" >
                <div className="flex justify-between items-center lg:block gap-2 text-center">
                  <span className="text-gray-400 lg:hidden">ID</span>
                  <span>{item.id}</span>
                </div>
              </td>
              
              {/* Comunidad */}
              <td data-th="Comunidad" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap dark:text-white lg:!bg-inherit bg-gray-50 dark:bg-gray-800" >
                <div className="flex justify-between items-center lg:block gap-2 text-center">
                  <span className="text-gray-400 lg:hidden">Comunidad</span>
                  <span>{item.nombre}</span>
                </div>
              </td>

              {/* Encargada */}
              <td data-th="Encargada" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap dark:text-white lg:!bg-inherit bg-gray-50 dark:bg-gray-800" >
                <div className="flex justify-between items-center lg:block gap-2 text-center">
                  <span className="text-gray-400 lg:hidden">Encargada</span>
                  <span>{item.jefa}</span>
                </div>
              </td>

              {/* Contacto */}
              <td data-th="Contacto" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap dark:text-white lg:!bg-inherit bg-gray-50 dark:bg-gray-800" >
                <div className="flex justify-between items-center lg:block gap-2 text-center">
                  <span className="text-gray-400 lg:hidden">Contacto</span>
                  <span>{item.contacto}</span>
                </div>
              </td>

              {/* Dirección */}
              <td data-th="Dirección" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap dark:text-white lg:!bg-inherit bg-gray-50 dark:bg-gray-800" >
                <div className="flex justify-between items-center lg:block gap-2 text-center">
                  <span className="text-gray-400 lg:hidden">Dirección</span>
                  <span>{item.direccion ?? "-"}</span>
                </div>
              </td>

              {/* Municipio */}
              <td data-th="Municipio" className="block lg:table-cell px-4 py-4 text-sm whitespace-nowrap dark:text-white lg:!bg-inherit bg-gray-50 dark:bg-gray-800" >
                <div className="flex justify-between items-center lg:block gap-2 text-center">
                  <span className="text-gray-400 lg:hidden">Municipio</span>
                  <span>{item.nombreMunicipio}</span>
                </div>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableRoute;