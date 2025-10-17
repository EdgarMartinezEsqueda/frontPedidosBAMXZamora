import { MdAdd, MdOutlineAccountBalance } from "react-icons/md";
import TransferenciaItem from "./TransferenciaItem";

const SeccionTransferencias = ({ transferencias, onAdd, onUpdate, onDelete, isLoading, total }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <MdOutlineAccountBalance className="text-xl text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transferencias Bancarias</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-medium text-blue-600">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          </p>
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <MdAdd className="text-xl" />
        Agregar
      </button>
    </div>

    {transferencias.length === 0 ? (
      <div className="bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <MdOutlineAccountBalance className="text-4xl text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 dark:text-gray-400">No hay transferencias registradas</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Haz clic en "Agregar" si recibiste pagos por transferencia</p>
      </div>
    ) : (
      <div className="space-y-3">
        {transferencias.map((t) => (
          <TransferenciaItem key={t.id} transferencia={t} onUpdate={onUpdate} onDelete={onDelete} isLoading={isLoading} />
        ))}
      </div>
    )}
  </div>
);

export default SeccionTransferencias;
