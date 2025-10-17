import ComparacionTotal from "components/modals/components/ComparacionTotal";
import SeccionDenominaciones from "components/modals/components/SeccionDenominaciones";
import SeccionTransferencias from "components/modals/components/SeccionTransferencias";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import { IoIosDoneAll } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { DENOMINACIONES, getInitialEfectivoState, getInitialTransferencia } from "utils/denominaciones";

const EfectivoModal = ({ show, onClose, onConfirm, isLoading = false, expectedTotal = 0 }) => {
  const [efectivoData, setEfectivoData] = useState(getInitialEfectivoState);
  const [transferencias, setTransferencias] = useState([]);

  const totales = useMemo(() => {
    const calcularTotal = (denominaciones) => 
      denominaciones.reduce((sum, den) => sum + (efectivoData[den.key] * den.value), 0);

    const totalBilletes = calcularTotal(DENOMINACIONES.billetes);
    const totalMonedas = calcularTotal(DENOMINACIONES.monedas);
    const totalEfectivo = totalBilletes + totalMonedas;
    const totalTransferencias = transferencias.reduce((sum, t) => sum + (parseFloat(t.monto) || 0), 0);
    const totalGeneral = totalEfectivo + totalTransferencias;

    return { totalBilletes, totalMonedas, totalEfectivo, totalTransferencias, totalGeneral };
  }, [efectivoData, transferencias]);

  const handleInputChange = useCallback((field, value) => {
    setEfectivoData(prev => ({ ...prev, [field]: Math.max(0, parseInt(value) || 0) }));
  }, []);

  const handleAddTransferencia = useCallback(() => {
    setTransferencias(prev => [...prev, getInitialTransferencia()]);
  }, []);

  const handleUpdateTransferencia = useCallback((id, updated) => {
    setTransferencias(prev => prev.map(t => t.id === id ? updated : t));
  }, []);

  const handleDeleteTransferencia = useCallback((id) => {
    if (window.confirm("¿Eliminar esta transferencia?")) {
      setTransferencias(prev => prev.filter(t => t.id !== id));
    }
  }, []);

  const validateAndConfirm = useCallback(() => {
    const { totalEfectivo, totalTransferencias, totalGeneral } = totales;
    
    if (expectedTotal > 0 && totalGeneral < expectedTotal) {
      const faltante = expectedTotal - totalGeneral;
      alert(
        `⚠️ NO SE PUEDE FINALIZAR\n\n` +
        `Total esperado: $${expectedTotal.toLocaleString("es-MX")}\n` +
        `Total registrado: $${totalGeneral.toLocaleString("es-MX")}\n\n` +
        `Falta: $${faltante.toLocaleString("es-MX")}`
      );
      return;
    }
    
    if (totalGeneral === 0) {
      if (!window.confirm("⚠️ No hay efectivo ni transferencias.\n\n¿Confirmar sin ingresos?")) return;
    }
    
    if (expectedTotal > 0 && totalGeneral > expectedTotal) {
      const sobrante = totalGeneral - expectedTotal;
      if (!window.confirm(
        `SOBRANTE: $${sobrante.toLocaleString("es-MX")}\n\n¿Continuar?`
      )) return;
    }

    const transferenciasValidas = transferencias.filter(t => (parseFloat(t.monto) || 0) > 0);
    
    onConfirm({ 
      efectivo: efectivoData,
      transferencias: transferenciasValidas,
      totales: { totalEfectivo, totalTransferencias, totalGeneral }
    });
  }, [efectivoData, transferencias, totales, expectedTotal, onConfirm]);

  const handleClose = useCallback(() => {
    if (!isLoading) onClose();
  }, [isLoading, onClose]);

  useEffect(() => {
    if (!show) {
      setEfectivoData(getInitialEfectivoState());
      setTransferencias([]);
    }
  }, [show]);

  if (!show) return null;

  const puedeFinalizarse = expectedTotal === 0 || totales.totalGeneral >= expectedTotal;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center gap-3">
            <FiDollarSign className="text-2xl text-verdeLogo" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registro de Efectivo y Transferencias</h2>
          </div>
          <button onClick={handleClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Registra el efectivo y las transferencias bancarias recibidas:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <SeccionDenominaciones tipo="billetes" denominaciones={DENOMINACIONES.billetes} data={efectivoData} onChange={handleInputChange} isLoading={isLoading} total={totales.totalBilletes} />
            <SeccionDenominaciones tipo="monedas" denominaciones={DENOMINACIONES.monedas} data={efectivoData} onChange={handleInputChange} isLoading={isLoading} total={totales.totalMonedas} />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones sobre efectivo (opcional)</label>
            <textarea
              value={efectivoData.observaciones}
              onChange={(e) => setEfectivoData(prev => ({ ...prev, observaciones: e.target.value }))}
              disabled={isLoading}
              placeholder="Notas adicionales..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo disabled:opacity-50"
              rows="3"
            />
          </div>

          <div className="mb-8">
            <SeccionTransferencias
              transferencias={transferencias}
              onAdd={handleAddTransferencia}
              onUpdate={handleUpdateTransferencia}
              onDelete={handleDeleteTransferencia}
              isLoading={isLoading}
              total={totales.totalTransferencias}
            />
          </div>

          {expectedTotal > 0 && (
            <ComparacionTotal expectedTotal={expectedTotal} totalEfectivo={totales.totalEfectivo} totalTransferencias={totales.totalTransferencias} />
          )}

          <div className="bg-gradient-to-r from-verdeLogo to-amarilloLogo text-white p-6 rounded-lg mb-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="text-center">
                <p className="text-sm opacity-90">Billetes</p>
                <p className="text-lg font-bold">${totales.totalBilletes.toLocaleString("es-MX")}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Monedas</p>
                <p className="text-lg font-bold">${totales.totalMonedas.toLocaleString("es-MX")}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Transferencias</p>
                <p className="text-lg font-bold">${totales.totalTransferencias.toLocaleString("es-MX")}</p>
              </div>
              <div className="text-center border-l border-white/20 md:border-l-2">
                <p className="text-sm opacity-90">Total General</p>
                <p className="text-2xl font-bold">${totales.totalGeneral.toLocaleString("es-MX")}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={validateAndConfirm}
              disabled={isLoading || !puedeFinalizarse}
              className="flex items-center gap-2 px-6 py-2 bg-amarilloLogo text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={!puedeFinalizarse ? "Debes registrar el monto completo" : ""}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <IoIosDoneAll className="text-xl" />
                  Finalizar Pedido
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfectivoModal;