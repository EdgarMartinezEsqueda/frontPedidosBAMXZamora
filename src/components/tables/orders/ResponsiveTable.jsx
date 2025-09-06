const ResponsiveOrderTable = ({ mode, data, handleChange }) => {
  const headers = [
    "Comunidad",
    "Encargada",
    "Contacto",
    "Con Costo",
    "Medio Costo",
    "Sin Costo",
    "Apadrinadas",
    "Comité",
    "Arpilladas",
    "Observaciones"
  ];

  const totales = {
    despensasCosto: 0,
    despensasMedioCosto: 0,
    despensasSinCosto: 0,
    despensasApadrinadas: 0,
    comite: 0,
  };

  data.pedidoComunidad.forEach(item => {
    totales.despensasCosto += item.despensasCosto || 0;
    totales.despensasMedioCosto += item.despensasMedioCosto || 0;
    totales.despensasSinCosto += item.despensasSinCosto || 0;
    totales.despensasApadrinadas += item.despensasApadrinadas || 0;
    totales.comite += item.comite || 0;
  });

  return (
    <div className="w-full overflow-hidden rounded-lg ">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-black dark:text-white">
        {/* Cabecera solo para desktop */}
        <thead className="hidden md:table-header-group bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-left text-sm font-medium md:text-center ${
                  index < 2 
                    ? "text-gray-900 dark:text-white" 
                    : "text-gray-500 dark:text-gray-300"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
            
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.pedidoComunidad.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="block md:table-row dark:bg-gray-800 rounded-lg shadow p-4 mb-4 md:p-0 md:shadow-none md:bg-transparent"
            >
              {/* Comunidad */}
              <td
                className="block md:table-cell px-4 md:py-3 text-sm md:font-medium font-bold text-gray-900 dark:text-white md:!bg-inherit bg-gray-50 dark:bg-gray-800 relative before:content-[attr(data-th)] md:before:content-none before:block before:text-xs before:text-gray-500 before:mb-1"
              >
                {item.comunidad.nombre}
              </td>

              {/* Encargada */}
              <td
                className="block md:table-cell px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 md:!bg-inherit bg-gray-50 dark:bg-gray-800 relative before:content-[attr(data-th)] md:before:content-none before:block before:text-xs before:text-gray-500 before:mb-1"
              >
                {item.comunidad.jefa}
              </td>

              {/* COntacto jefa encargada */}
              <td
                className="block md:table-cell px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 md:!bg-inherit bg-gray-50 dark:bg-gray-800 relative before:content-[attr(data-th)] md:before:content-none before:block before:text-xs before:text-gray-500 before:mb-1"
              >
                {item.comunidad.contacto}
              </td>

              {/* Campos numéricos */}
              {["despensasCosto", "despensasMedioCosto", "despensasSinCosto", "despensasApadrinadas", "comite"].map((field, index) => (
                <td
                  data-th={headers[index + 3]}
                  className="block md:table-cell px-4 py-2 text-sm relative md:text-center"
                  key={index}
                >
                 <div className="flex justify-between items-center md:block gap-2">
                  <span className="text-gray-400 md:hidden">{headers[index + 3]}</span>
                  
                  {mode !== "view" ? (
                    <input
                      type="number"
                      value={item[field]}
                      onChange={(e) => handleChange(rowIndex, field, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-white text-black md:text-center"
                      min={0}
                    />
                  ) : (
                    <span>{item[field]}</span>
                  )}
                </div>
              </td>
              ))}

              {/* Arpilladas */}
              <td
                data-th="Arpilladas"
                className="block md:table-cell px-4 py-2 text-sm relative md:text-center"
              >
                <div className="flex justify-between items-center md:block gap-2">
                  <span className="text-gray-400 md:hidden">Arpilladas</span>

                  {mode === "view" ? (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.arpilladas
                        ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500"
                        : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500"
                    }`}>
                      {item.arpilladas ? "Sí" : "No"}
                    </span>
                  ) : (
                    <label className="inline-flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        checked={item.arpilladas || false}
                        onChange={(e) =>
                          handleChange(rowIndex, "arpilladas", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600">
                      </div>
                    </label>
                  )}
                </div>
              </td>

              {/* Observaciones */}
              <td
                data-th="Observaciones"
                className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 relative before:content-[attr(data-th)] md:before:content-none before:block before:text-xs before:text-gray-500 before:mb-1 md:text-center"
              >
                {mode === "view" ? (
                  item.observaciones || "-"
                ) : (
                  <input
                    type="text"
                    value={item.observaciones || ""}
                    onChange={(e) => handleChange(rowIndex, "observaciones", e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-1 px-2 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
        {/* Totales solo para desktop */}
        <tfoot className="hidden md:table-footer-group bg-gray-100 dark:bg-gray-900 font-semibold text-sm text-gray-800 dark:text-gray-200">
          <tr>
            {/* Comunidad, Encargada, Contacto */}
            <td className="px-4 py-2 text-left" colSpan={3}>Totales</td>

            {/* Valores numéricos */}
            {[ "despensasCosto", "despensasMedioCosto", "despensasSinCosto", "despensasApadrinadas", "comite"].map((field, index) => (
              <td key={index} className="px-4 py-2 text-center">
                {totales[field]}
              </td>
            ))}

            {/* Arpilladas y Observaciones (vacíos o con guiones) */}
            <td className="px-4 py-2 text-center">-</td>
            <td className="px-4 py-2 text-center">-</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ResponsiveOrderTable;