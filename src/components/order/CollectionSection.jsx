import { FaFileInvoice } from "react-icons/fa";
import { hasPermission, RESOURCES } from "utils/permisos";

const CollectionSection = ({ pedidoData, user, onGenerar, onRegenerar, onDescargar, isGenerating, isRegenerating, isDownloading }) => {
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

  const { tieneCobranza, folio, fechaGeneracion, generadoPor, puedeGenerarCobranza, puedeRegenerarCobranza } = pedidoData.infoCobranza || {};

  if (!tieneCobranza && !puedeGenerarCobranza) return null;

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      {tieneCobranza ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaFileInvoice className="text-xl text-green-600" />
            <h4 className="font-semibold text-green-800 dark:text-green-200">
              Cobranza Generada
            </h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Folio:</span>
              <span className="ml-2 font-bold text-green-700 dark:text-green-300">{folio}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Generada:</span>
              <span className="ml-2">{formatearFechaHora(fechaGeneracion)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Por:</span>
              <span className="ml-2">{generadoPor || "N/A"}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-4 space-y-2">
            {/* Botón para descargar PDF */}
            {hasPermission(user.data, RESOURCES.COBRANZAS, "read") && (
              <button
                onClick={onDescargar}
                disabled={isDownloading}
                className="w-full px-4 py-2 bg-verdeLogo text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <FaFileInvoice />
                    Descargar Cobranza (PDF)
                  </>
                )}
              </button>
            )}

            {/* Botón para regenerar */}
            {puedeRegenerarCobranza && hasPermission(user.data, RESOURCES.COBRANZAS, "update") && (
              <button
                onClick={onRegenerar}
                disabled={isRegenerating}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                {isRegenerating? "Regenerando..." : "Regenerar Cobranza"}
              </button>
            )}
          </div>
        </div>
      ) : puedeGenerarCobranza && hasPermission(user.data, RESOURCES.COBRANZAS, "create") && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaFileInvoice className="text-xl text-blue-600" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Generar Cobranza
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Este pedido está finalizado y listo para generar su cobranza.
          </p>
          <button
            onClick={onGenerar}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-verdeLogo text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FaFileInvoice />
                Generar Cobranza
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionSection;