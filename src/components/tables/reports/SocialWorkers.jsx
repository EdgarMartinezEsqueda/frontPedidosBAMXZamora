const TSMetricsTable = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TS</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pedidos</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pendientes</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Despensas</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Devoluciones</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Contribución (pedidos)</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Devoluciones</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Último Pedido</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((ts) => (
            <tr key={ts.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex flex-col">
                  <span className="font-semibold">{ts.username}</span>
                  <span className="text-xs text-gray-500">ID: {ts.id}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{ts.metricas.pedidos}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600">{ts.metricas.pedidosPendientes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{ts.metricas.despensas}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600">{ts.metricas.devoluciones}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{ts.metricas.porcentajeContribucion}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{ts.metricas.porcentajeDevoluciones}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{new Date(ts.metricas.ultimaActividad).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TSMetricsTable;