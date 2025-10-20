import { useState } from "react";

const ReturnsBreakdown = ({ pedidoData }) => {
  const [mostrarDesglose, setMostrarDesglose] = useState(false);

  const tieneDesglose = 
    (pedidoData.devolucionesCosto || 0) > 0 ||
    (pedidoData.devolucionesMedioCosto || 0) > 0 ||
    (pedidoData.devolucionesSinCosto || 0) > 0 ||
    (pedidoData.devolucionesApadrinadas || 0) > 0;

  const totalDevoluciones = tieneDesglose
    ? (pedidoData.devolucionesCosto || 0) +
      (pedidoData.devolucionesMedioCosto || 0) +
      (pedidoData.devolucionesSinCosto || 0) +
      (pedidoData.devolucionesApadrinadas || 0)
    : (pedidoData.devoluciones ?? 0);

  return (
    <>
      <div className="flex items-center gap-2 justify-center">
        <span className="font-semibold text-gray-600 dark:text-gray-400">Despensas retornadas:</span>
        <span className="text-rojoLogo dark:text-red-400 font-bold text-lg">
          {totalDevoluciones}
        </span>
        {tieneDesglose && (
          <button
            onClick={() => setMostrarDesglose(!mostrarDesglose)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {mostrarDesglose ? "Ocultar" : "Ver"}
          </button>
        )}
      </div>

      {mostrarDesglose && tieneDesglose && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg md:col-span-2">
          <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Desglose de devoluciones:</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
              <span>Con costo:</span>
              <span className="font-semibold">{pedidoData.devolucionesCosto || 0}</span>
            </div>
            <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/30 rounded">
              <span>Medio costo:</span>
              <span className="font-semibold">{pedidoData.devolucionesMedioCosto || 0}</span>
            </div>
            <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
              <span>Sin costo:</span>
              <span className="font-semibold">{pedidoData.devolucionesSinCosto || 0}</span>
            </div>
            <div className="flex justify-between p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
              <span>Apadrinadas:</span>
              <span className="font-semibold">{pedidoData.devolucionesApadrinadas || 0}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReturnsBreakdown;