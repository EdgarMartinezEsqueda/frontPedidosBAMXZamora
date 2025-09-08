import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCoins, FaMoneyBillWave } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { IoIosDoneAll } from "react-icons/io";
import { IoClose } from "react-icons/io5";

// Configuración de denominaciones
const DENOMINACIONES = {
  billetes: [
    { key: "billetes1000", label: "Billetes de $1,000", value: 1000, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
    { key: "billetes500", label: "Billetes de $500", value: 500, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
    { key: "billetes200", label: "Billetes de $200", value: 200, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
    { key: "billetes100", label: "Billetes de $100", value: 100, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20" },
    { key: "billetes50", label: "Billetes de $50", value: 50, color: "text-pink-600", bgColor: "bg-pink-50 dark:bg-pink-900/20" },
    { key: "billetes20", label: "Billetes de $20", value: 20, color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" }
  ],
  monedas: [
    { key: "monedas20", label: "Monedas de $20", value: 20, color: "text-gray-600", bgColor: "bg-gray-50 dark:bg-gray-700" },
    { key: "monedas10", label: "Monedas de $10", value: 10, color: "text-yellow-700", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
    { key: "monedas5", label: "Monedas de $5", value: 5, color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
    { key: "monedas2", label: "Monedas de $2", value: 2, color: "text-gray-500", bgColor: "bg-gray-50 dark:bg-gray-700" },
    { key: "monedas1", label: "Monedas de $1", value: 1, color: "text-yellow-800", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" },
    { key: "monedas50C", label: "Monedas de $0.50", value: 0.5, color: "text-gray-400", bgColor: "bg-gray-50 dark:bg-gray-600/20" }
  ]
};

// Estado inicial
const getInitialState = () => 
  [...DENOMINACIONES.billetes, ...DENOMINACIONES.monedas].reduce((acc, denominacion) => {
    acc[denominacion.key] = 0;
    return acc;
  }, { observaciones: "" });

// Componente para cada input de denominación
const DenominacionInput = ({ denominacion, value, onChange, isLoading }) => (
  <div className={`flex items-center justify-between p-4 ${denominacion.bgColor} border border-gray-200 dark:border-gray-600 rounded-lg transition-all hover:shadow-md`}>
    <div className="flex items-center gap-2">
      <span className={`font-medium ${denominacion.color}`}>
        {denominacion.label}
      </span>
    </div>
    <div className="flex items-center gap-3">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(denominacion.key, e.target.value)}
        disabled={isLoading}
        className="w-16 px-2 py-1 text-center border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
        aria-label={`Cantidad de ${denominacion.label}`}
      />
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] text-right font-medium">
        ${(value * denominacion.value).toLocaleString()}
      </span>
    </div>
  </div>
);

// Componente para sección de denominaciones
const SeccionDenominaciones = ({ tipo, denominaciones, data, onChange, isLoading, total }) => {
  const Icon = tipo === "billetes" ? FaMoneyBillWave : FaCoins;
  const colorClass = tipo === "billetes" ? "text-green-600" : "text-yellow-600";
  const bgClass = tipo === "billetes" ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${bgClass} rounded-lg`}>
          <Icon className={`text-xl ${colorClass}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {tipo}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className={`font-medium ${colorClass}`}>${total.toLocaleString()}</span>
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {denominaciones.map((denominacion) => (
          <DenominacionInput
            key={denominacion.key}
            denominacion={denominacion}
            value={data[denominacion.key]}
            onChange={onChange}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

// Componente para comparación con total esperado
const ComparacionTotal = ({ expectedTotal, totalEfectivo }) => {
  const diferencia = totalEfectivo - expectedTotal;
  const getDiferenciaColor = () => {
    if (Math.abs(diferencia) <= 1) return "text-green-600";
    return diferencia > 0 ? "text-orange-600" : "text-red-600";
  };

  const getDiferenciaTexto = () => {
    if (diferencia === 0) return "✓ Exacto";
    return diferencia > 0 
      ? `+${diferencia.toLocaleString()}` 
      : `-${Math.abs(diferencia).toLocaleString()}`;
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
      <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
        Comparación con Total Esperado:
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-blue-700 dark:text-blue-300">Total esperado:</span>
          <span className="font-medium">${expectedTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-700 dark:text-blue-300">Efectivo registrado:</span>
          <span className="font-medium">${totalEfectivo.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2">
          <span className="text-blue-700 dark:text-blue-300">Diferencia:</span>
          <span className={`font-bold ${getDiferenciaColor()}`}>
            {getDiferenciaTexto()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const EfectivoModal = ({ show, onClose, onConfirm, isLoading = false, expectedTotal }) => {
  const [efectivoData, setEfectivoData] = useState(getInitialState);

  // Cálculos memoizados
  const totales = useMemo(() => {
    const calcularTotal = (denominaciones) => 
      denominaciones.reduce((sum, den) => sum + (efectivoData[den.key] * den.value), 0);

    const totalBilletes = calcularTotal(DENOMINACIONES.billetes);
    const totalMonedas = calcularTotal(DENOMINACIONES.monedas);
    const totalEfectivo = totalBilletes + totalMonedas;

    return { totalBilletes, totalMonedas, totalEfectivo };
  }, [efectivoData]);

  // Handlers optimizados
  const handleInputChange = useCallback((field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setEfectivoData(prev => ({ ...prev, [field]: numValue }));
  }, []);

  const validateAndConfirm = useCallback(() => {
    const { totalEfectivo } = totales;
    
    // Validación para efectivo = 0
    if (totalEfectivo === 0) {
      if (!window.confirm("¿Confirmar pedido sin efectivo registrado?")) return;
    }
    
    // Validación para diferencias con el total esperado
    if (expectedTotal > 0 && totalEfectivo !== expectedTotal) {
      const diferencia = totalEfectivo - expectedTotal;
      const esSobrante = diferencia > 0;
      const mensaje = esSobrante 
        ? `SOBRANTE DETECTADO: El efectivo registrado (${totalEfectivo.toLocaleString()}) es ${Math.abs(diferencia).toLocaleString()} mayor al total esperado (${expectedTotal.toLocaleString()}).\n\n¿Deseas continuar de todas formas?`
        : `FALTANTE DETECTADO: El efectivo registrado (${totalEfectivo.toLocaleString()}) es ${Math.abs(diferencia).toLocaleString()} menor al total esperado (${expectedTotal.toLocaleString()}).\n\n¿Deseas continuar de todas formas?`;
      
      if (!window.confirm(mensaje)) return;
    }
    
    onConfirm({ ...efectivoData, total_efectivo: totalEfectivo });
  }, [efectivoData, totales, expectedTotal, onConfirm]);

  const handleClose = useCallback(() => {
    if (!isLoading) onClose();
  }, [isLoading, onClose]);

  // Reset cuando se cierra el modal
  useEffect(() => {
    if (!show) {
      setEfectivoData(getInitialState());
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FiDollarSign className="text-2xl text-verdeLogo" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Registro de Efectivo
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Registra la cantidad de billetes y monedas recaudados en este pedido:
          </p>

          {/* Grid principal: Billetes y Monedas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <SeccionDenominaciones
              tipo="billetes"
              denominaciones={DENOMINACIONES.billetes}
              data={efectivoData}
              onChange={handleInputChange}
              isLoading={isLoading}
              total={totales.totalBilletes}
            />
            
            <SeccionDenominaciones
              tipo="monedas"
              denominaciones={DENOMINACIONES.monedas}
              data={efectivoData}
              onChange={handleInputChange}
              isLoading={isLoading}
              total={totales.totalMonedas}
            />
          </div>

          {/* Observaciones */}
          <div className="mb-6">
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observaciones (opcional)
            </label>
            <textarea
              id="observaciones"
              value={efectivoData.observaciones}
              onChange={(e) => setEfectivoData(prev => ({ ...prev, observaciones: e.target.value }))}
              disabled={isLoading}
              placeholder="Notas adicionales sobre el efectivo..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50"
              rows="3"
            />
          </div>

          {/* Comparación con total esperado */}
          {expectedTotal > 0 && (
            <ComparacionTotal 
              expectedTotal={expectedTotal} 
              totalEfectivo={totales.totalEfectivo} 
            />
          )}

          {/* Resumen total */}
          <div className="bg-gradient-to-r from-verdeLogo to-amarilloLogo text-white p-6 rounded-lg mb-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <p className="text-sm opacity-90">Billetes</p>
                <p className="text-lg font-bold">${totales.totalBilletes.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Monedas</p>
                <p className="text-lg font-bold">${totales.totalMonedas.toLocaleString()}</p>
              </div>
              <div className="text-center border-l border-white/20 md:border-l-2">
                <p className="text-sm opacity-90">Total Efectivo</p>
                <p className="text-2xl font-bold">${totales.totalEfectivo.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={validateAndConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-amarilloLogo text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
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