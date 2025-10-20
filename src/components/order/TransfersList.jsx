import { useState } from "react";
import { MdOutlineAccountBalance } from "react-icons/md";

const TransfersList = ({ transferencias = [] }) => {
  const [mostrarTransferencias, setMostrarTransferencias] = useState(false);

  const formatearFechaHora = (fechaString) => {
    if (!fechaString) return "N/A";
    return new Date(fechaString).toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (transferencias.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MdOutlineAccountBalance className="text-xl text-blue-600" />
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
            Transferencias Bancarias ({transferencias.length})
          </h4>
        </div>
        <button
          onClick={() => setMostrarTransferencias(!mostrarTransferencias)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {mostrarTransferencias ? "Ocultar" : "Ver"}
        </button>
      </div>

      {mostrarTransferencias && (
        <div className="space-y-3">
          {transferencias.map((t) => (
            <div 
              key={t.id} 
              className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Monto:</span>
                  <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">
                    ${parseFloat(t.monto).toLocaleString('es-MX')}
                  </span>
                </div>
                {t.folio && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Folio:</span>
                    <span className="ml-2 font-medium">{t.folio}</span>
                  </div>
                )}
                {t.banco && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Banco:</span>
                    <span className="ml-2 font-medium">{t.banco}</span>
                  </div>
                )}
                {t.fechaTransferencia && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                    <span className="ml-2 font-medium">{formatearFechaHora(t.fechaTransferencia)}</span>
                  </div>
                )}
                {t.nombreRemitente && (
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Remitente:</span>
                    <span className="ml-2 font-medium">{t.nombreRemitente}</span>
                  </div>
                )}
                {t.observaciones && (
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Observaciones:</span>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{t.observaciones}</p>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Registrada por: {t.usuario?.nombre || t.usuario?.username || "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransfersList;