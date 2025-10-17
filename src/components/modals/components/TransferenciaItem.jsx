import { MdDelete } from "react-icons/md";

const TransferenciaItem = ({ transferencia, onUpdate, onDelete, isLoading }) => {
  const handleChange = (field, value) => {
    onUpdate(transferencia.id, { ...transferencia, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900 dark:text-white">Transferencia</h4>
        <button
          onClick={() => onDelete(transferencia.id)}
          disabled={isLoading}
          className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
        >
          <MdDelete className="text-xl" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={transferencia.monto}
            onChange={(e) => handleChange('monto', e.target.value)}
            disabled={isLoading}
            placeholder="0.00"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banco</label>
          <input
            type="text"
            value={transferencia.banco}
            onChange={(e) => handleChange('banco', e.target.value)}
            disabled={isLoading}
            placeholder="BBVA, Santander, etc."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folio/Referencia</label>
          <input
            type="text"
            value={transferencia.folio}
            onChange={(e) => handleChange('folio', e.target.value)}
            disabled={isLoading}
            placeholder="Número de referencia"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
          <input
            type="datetime-local"
            value={transferencia.fechaTransferencia}
            onChange={(e) => handleChange('fechaTransferencia', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del remitente</label>
          <input
            type="text"
            value={transferencia.nombreRemitente}
            onChange={(e) => handleChange('nombreRemitente', e.target.value)}
            disabled={isLoading}
            placeholder="Quien realizó la transferencia"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
          <textarea
            value={transferencia.observaciones}
            onChange={(e) => handleChange('observaciones', e.target.value)}
            disabled={isLoading}
            placeholder="Notas adicionales..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
            rows="2"
          />
        </div>
      </div>
    </div>
  );
};

export default TransferenciaItem;
