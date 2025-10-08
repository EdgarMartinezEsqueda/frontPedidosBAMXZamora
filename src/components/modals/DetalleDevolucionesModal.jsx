import { FiX } from "react-icons/fi";

const DetalleDevolucionesModal = ({ devoluciones, onClose }) => {
  if (!devoluciones) return null;

  const tieneDesglose = devoluciones.desglose !== null;
  const total = tieneDesglose 
    ? Object.values(devoluciones.desglose).reduce((a, b) => a + b, 0)
    : devoluciones.total;
console.log(devoluciones, tieneDesglose, total);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Detalle de Devoluciones
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {tieneDesglose ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <span className="text-sm">Con costo:</span>
                  <span className="font-semibold">{devoluciones.desglose.costo}</span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/30 rounded">
                  <span className="text-sm">Medio costo:</span>
                  <span className="font-semibold">{devoluciones.desglose.medioCosto}</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                  <span className="text-sm">Sin costo:</span>
                  <span className="font-semibold">{devoluciones.desglose.sinCosto}</span>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                  <span className="text-sm">Apadrinadas:</span>
                  <span className="font-semibold">{devoluciones.desglose.apadrinadas}</span>
                </div>
              </div>
              <div className="pt-3 border-t dark:border-gray-700 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-red-600 dark:text-red-400">{total}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Pedido antiguo sin desglose
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {total}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                Devoluciones totales
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleDevolucionesModal;