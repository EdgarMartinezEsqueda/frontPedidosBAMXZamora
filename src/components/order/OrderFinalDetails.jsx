import ReturnToEditButton from "components/buttons/ReturnToEditButton";
import { FaCoins, FaMoneyBillWave } from "react-icons/fa";
import { MdOutlineAccountBalance } from "react-icons/md";
import { hasPermission, RESOURCES } from "utils/permisos";
import CashBreakdown from "./CashBreakdown";
import ReturnsBreakdown from "./ReturnsBreakdown";
import TransfersList from "./TransfersList";

const OrderFinalDetails = ({ pedidoData, user, id }) => {
  const formatearHora = (horaString) => {
    return horaString 
      ? new Date(`2000-01-01T${horaString}`)
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;
  };

  const efectivo = pedidoData.efectivo?.[0];
  const totalesRegistrados = pedidoData.totalesRegistrados || {};
  const totalEfectivo = totalesRegistrados.efectivo || 0;
  const totalTransferencias = totalesRegistrados.transferencias || 0;
  const totalRegistrado = totalesRegistrados.total || 0;
  const diferencia = totalesRegistrados.diferencia || 0;
  const tieneDiferencia = Math.abs(diferencia) > 1;

  const puedeVerCobranzas = hasPermission(user.data, RESOURCES.COBRANZAS, "read", pedidoData.idTs);
  const puedeRevertir = hasPermission(user.data, RESOURCES.PEDIDOS, "revert", pedidoData.idTs);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm mt-4">
      <h3 className="text-center text-xl font-bold text-verdeLogo dark:text-green-400 mb-4">
        Detalles finales
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <ReturnsBreakdown pedidoData={pedidoData} />
        
        <div className="flex items-center gap-2 justify-center">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Hora de llegada:</span>
          <span className="text-amarilloLogo dark:text-yellow-400 font-bold text-lg">
            {formatearHora(pedidoData.horaLlegada) || 
              <span className="text-gray-400 dark:text-gray-500">N/A</span>}
          </span>
        </div>

        {puedeVerCobranzas && (
          <>
            <div className="flex items-center gap-2 justify-center">
              <FaCoins className="text-green-600" />
              <span className="font-semibold text-gray-600 dark:text-gray-400">Efectivo:</span>
              <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                ${totalEfectivo.toLocaleString('es-MX')}
              </span>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <MdOutlineAccountBalance className="text-blue-600" />
              <span className="font-semibold text-gray-600 dark:text-gray-400">Transferencias:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                ${totalTransferencias.toLocaleString('es-MX')}
              </span>
            </div>

            <div className="flex items-center gap-2 justify-center md:col-span-2">
              <FaMoneyBillWave className="text-verdeLogo" />
              <span className="font-semibold text-gray-600 dark:text-gray-400">Total registrado:</span>
              <span className="text-verdeLogo dark:text-green-400 font-bold text-xl">
                ${totalRegistrado.toLocaleString('es-MX')}
              </span>
            </div>

            <div className="flex items-center gap-2 justify-center md:col-span-2">
              <span className="font-semibold text-gray-600 dark:text-gray-400">Total esperado:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                ${pedidoData.total?.toLocaleString('es-MX')}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Diferencia */}
      {puedeVerCobranzas && tieneDiferencia && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-yellow-800 dark:text-yellow-300">Diferencia:</span>
            <span className={`font-bold ${
              diferencia > 0 
                ? "text-orange-600 dark:text-orange-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {diferencia > 0 ? "+" : ""}${diferencia.toLocaleString('es-MX')}
            </span>
          </div>
        </div>
      )}

      {/* Desglose efectivo */}
      {puedeVerCobranzas && <CashBreakdown efectivo={efectivo} />}

      {/* Transferencias */}
      {puedeVerCobranzas && <TransfersList transferencias={pedidoData.transferencias} />}

      {/* Botón revertir */}
      {puedeRevertir && <ReturnToEditButton id={id} />}
    </div>
  );
};

export default OrderFinalDetails;