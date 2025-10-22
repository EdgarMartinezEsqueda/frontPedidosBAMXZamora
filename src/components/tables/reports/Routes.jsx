import BadgeDevolucion from "components/badges/BadgeDevolucion";
import DetalleDevolucionesModal from "components/modals/DetalleDevolucionesModal";
import { useState } from "react";

const RouteMetricsTable = ({ data }) => {
  const [devolucionSeleccionada, setDevolucionSeleccionada] = useState(null);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ruta</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pedidos</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Despensas</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Devoluciones</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detalle Despensas</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((ruta) => (
              <tr key={ruta.id} className="block md:table-row border-b md:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 flex justify-between md:table-cell">
                  <span className="font-bold md:hidden text-gray-700 dark:text-gray-300">Ruta:</span>
                  {ruta.nombre}
                </td>
                <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-300 flex justify-between md:table-cell md:text-center">
                  <span className="font-bold md:hidden text-gray-700 dark:text-gray-300">Pedidos:</span>
                  {ruta.metricas.pedidos}
                </td>
                <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-300 flex justify-between md:table-cell md:text-center">
                  <span className="font-bold md:hidden text-gray-700 dark:text-gray-300">Despensas:</span>
                  {ruta.metricas.despensas}
                </td>
                <td className="px-6 py-2 text-sm flex justify-between md:table-cell md:text-center">
                  <span className="font-bold md:hidden text-red-600 dark:text-red-400">Devoluciones:</span>
                  <BadgeDevolucion
                    devoluciones={{
                      total: ruta.metricas.devoluciones,
                      desglose: ruta.metricas.devolucionesDesglose
                    }}
                    onClick={() => setDevolucionSeleccionada({
                      total: ruta.metricas.devoluciones,
                      desglose: ruta.metricas.devolucionesDesglose
                    })}
                  />
                </td>
                <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-300 block md:table-cell">
                  <div className="flex justify-center flex-wrap gap-2 mt-2 md:mt-0">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded">
                      C: {ruta.metricas.detalleDespensas.costo}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded">
                      MC: {ruta.metricas.detalleDespensas.medioCosto}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded">
                      SC: {ruta.metricas.detalleDespensas.sinCosto}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded">
                      A: {ruta.metricas.detalleDespensas.apadrinadas}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 rounded">
                      V: {ruta.metricas.detalleDespensas.voluntariado}
                    </span>
                  </div>
                </td>
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

export default RouteMetricsTable;