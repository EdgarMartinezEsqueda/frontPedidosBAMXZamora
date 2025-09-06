const RouteMetricsTable = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ruta</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pedidos</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Despensas</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Devoluciones</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Detalle Despensas</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((ruta) => (
            <tr key={ruta.id} className="block md:table-row border-b md:border-0 dark:border-gray-700">
              <td className="px-6 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 flex justify-between md:table-cell">
                <span className="font-bold md:hidden">Ruta:</span>
                {ruta.nombre}
              </td>
              <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-300 flex justify-between md:table-cell md:text-center">
                <span className="font-bold md:hidden">Pedidos:</span>
                {ruta.metricas.pedidos}
              </td>
              <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-300 flex justify-between md:table-cell md:text-center">
                <span className="font-bold md:hidden">Despensas:</span>
                {ruta.metricas.despensas}
              </td>
              <td className="px-6 py-2 text-sm flex justify-between md:table-cell md:text-center">
                <span className="font-bold md:hidden text-red-600 dark:text-red-400">Devoluciones:</span>
                <span className="text-red-500 dark:text-red-400">{ruta.metricas.devoluciones}</span>
              </td>
              <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-300 block md:table-cell">
                <div className="flex justify-center flex-wrap gap-2 mt-2 md:mt-0">
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded">C: {ruta.metricas.detalleDespensas.costo}</span>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded">MC: {ruta.metricas.detalleDespensas.medioCosto}</span>
                  <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded">SC: {ruta.metricas.detalleDespensas.sinCosto}</span>
                  <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded">A: {ruta.metricas.detalleDespensas.apadrinadas}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteMetricsTable;