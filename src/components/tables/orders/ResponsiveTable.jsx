const ResponsiveOrderTable = ({ mode, data, handleChange, esRutaVoluntariado = false }) => {
  // Headers dinámicos según el tipo de ruta
  const headersNormal = [
    "Comunidad",
    "Encargada",
    "_",
    "Con Costo",
    "Medio Costo",
    "Sin Costo",
    "Apadrinadas",
    "Comité",
    "Observaciones"
  ];

  const headersVoluntariado = [
    "Comunidad",
    "Encargada",
    "_",
    "Voluntariado",
    "Comité",
    "Observaciones"
  ];

  const headers = esRutaVoluntariado ? headersVoluntariado : headersNormal;

  // Campos numéricos según el tipo
  const fieldsNormal = ["despensasCosto", "despensasMedioCosto", "despensasSinCosto", "despensasApadrinadas", "comite"];
  const fieldsVoluntariado = ["despensasVoluntariado", "comite"];
  const numericFields = esRutaVoluntariado ? fieldsVoluntariado : fieldsNormal;

  // Calcular totales
  const totales = esRutaVoluntariado 
    ? {
        despensasVoluntariado: 0,
        comite: 0,
      }
    : {
        despensasCosto: 0,
        despensasMedioCosto: 0,
        despensasSinCosto: 0,
        despensasApadrinadas: 0,
        comite: 0,
      };

  data.pedidoComunidad.forEach(item => {
    if (esRutaVoluntariado) {
      totales.despensasVoluntariado += item.despensasVoluntariado || 0;
      totales.comite += item.comite || 0;
    } else {
      totales.despensasCosto += item.despensasCosto || 0;
      totales.despensasMedioCosto += item.despensasMedioCosto || 0;
      totales.despensasSinCosto += item.despensasSinCosto || 0;
      totales.despensasApadrinadas += item.despensasApadrinadas || 0;
      totales.comite += item.comite || 0;
    }
  });

  // Mapeo de labels para mobile
  const fieldLabels = esRutaVoluntariado
    ? {
        despensasVoluntariado: "Voluntariado",
        comite: "Comité"
      }
    : {
        despensasCosto: "Con Costo",
        despensasMedioCosto: "Medio Costo",
        despensasSinCosto: "Sin Costo",
        despensasApadrinadas: "Apadrinadas",
        comite: "Comité"
      };

  return (
    <div className="w-full overflow-hidden rounded-lg">
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
                }
                ${["Observaciones"].includes(header) && "print:hidden"}`}
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
              <td className="block md:table-cell px-4 md:py-3 text-sm md:font-medium font-bold text-gray-900 dark:text-white md:!bg-inherit bg-gray-50 dark:bg-gray-800">
                {item.comunidad.nombre}
              </td>

              {/* Encargada */}
              <td className="block md:table-cell px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 md:!bg-inherit bg-gray-50 dark:bg-gray-800">
                {item.comunidad.jefa}
              </td>

              {/* Espacio para la firma */}
              <td className="block md:table-cell px-4 md:py-3 text-sm text-gray-600 dark:text-gray-300 md:!bg-inherit bg-gray-50 dark:bg-gray-800">
              </td>

              {/* Campos numéricos dinámicos */}
              {numericFields.map((field) => (
                <td
                  key={field}
                  className="block md:table-cell px-4 py-2 text-sm relative md:text-center"
                >
                  <div className="flex justify-between items-center md:block gap-2">
                    <span className="text-gray-400 md:hidden">{fieldLabels[field]}</span>
                    
                    {mode !== "view" ? (
                      <input
                        type="number"
                        value={item[field] || 0}
                        onChange={(e) => handleChange(rowIndex, field, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 rounded bg-white dark:bg-gray-700 text-black dark:text-white md:text-center border border-gray-300 dark:border-gray-600"
                        min={0}
                      />
                    ) : (
                      <span>{item[field] || 0}</span>
                    )}
                  </div>
                </td>
              ))}

              {/* Observaciones */}
              <td className="block md:table-cell px-4 py-2 md:py-3 text-sm text-gray-600 dark:text-gray-300 md:text-center print:hidden">
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
            {/* Comunidad, Encargada, Firma */}
            <td className="px-4 py-2 text-left" colSpan={3}>Totales</td>

            {/* Valores numéricos */}
            {numericFields.map((field) => (
              <td key={field} className="px-4 py-2 text-center">
                {totales[field]}
              </td>
            ))}

            {/* Observaciones */}
            <td className="px-4 py-2 text-center print:hidden">-</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ResponsiveOrderTable;