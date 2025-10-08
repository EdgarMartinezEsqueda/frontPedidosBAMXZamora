import BadgeDevolucion from "components/badges/BadgeDevolucion";
import DetalleDevolucionesModal from "components/modals/DetalleDevolucionesModal";
import { useState } from "react";

const TSMetricsTable = ({ data }) => {
  const [devolucionSeleccionada, setDevolucionSeleccionada] = useState(null);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TS</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pedidos</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pendientes</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Despensas</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Devoluciones</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contribución (pedidos)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">% Devoluciones</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Último Pedido</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((ts) => (
              <tr key={ts.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  <div className="flex flex-col">
                    <span className="font-semibold">{ts.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">ID: {ts.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">{ts.metricas.pedidos}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600 dark:text-yellow-400 font-medium">{ts.metricas.pedidosPendientes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">{ts.metricas.despensas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <BadgeDevolucion
                    devoluciones={{
                      total: ts.metricas.devoluciones,
                      desglose: ts.metricas.devolucionesDesglose
                    }}
                    onClick={() => setDevolucionSeleccionada({
                      total: ts.metricas.devoluciones,
                      desglose: ts.metricas.devolucionesDesglose
                    })}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">{ts.metricas.porcentajeContribucion}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">{ts.metricas.porcentajeDevoluciones}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-gray-300">{new Date(ts.metricas.ultimaActividad).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {devolucionSeleccionada && (
        <DetalleDevolucionesModal
          devoluciones={devolucionSeleccionada}
          onClose={() => setDevolucionSeleccionada(null)}
        />
      )}
    </>
  );
};

export default TSMetricsTable;