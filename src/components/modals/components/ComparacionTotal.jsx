const ComparacionTotal = ({ expectedTotal, totalEfectivo, totalTransferencias }) => {
  const totalGeneral = totalEfectivo + totalTransferencias;
  const diferencia = totalGeneral - expectedTotal;
  const faltante = expectedTotal - totalGeneral;

  return (
    <div className={`border p-4 rounded-lg mb-6 ${
      diferencia >= 0 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }`}>
      <h3 className={`font-medium mb-2 ${diferencia >= 0 ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
        Comparación con Total Esperado:
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Total esperado:</span>
          <span className="font-medium">${expectedTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Efectivo:</span>
          <span className="font-medium">${totalEfectivo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Transferencias:</span>
          <span className="font-medium">${totalTransferencias.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-semibold">
          <span className="text-gray-700 dark:text-gray-300">Total registrado:</span>
          <span className="font-bold">${totalGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-700 dark:text-gray-300">Diferencia:</span>
          <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {diferencia === 0 ? '✓ Exacto' : (diferencia > 0 ? '+' : '-') + '$' + Math.abs(diferencia).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
        {faltante > 0 && (
          <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-medium text-center">
              ⚠️ Falta registrar ${faltante.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparacionTotal;
