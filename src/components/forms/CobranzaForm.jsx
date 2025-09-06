const FormularioCobranza = ({ datos, onChange, onSubmit, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-xl animate-fade-in">
      <h3 className="text-2xl font-semibold text-center text-verdeLogo dark:text-green-400 mb-6">
        Datos adicionales para cobranza
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arpillas - Cantidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Cantidad de Arpillas
          </label>
          <input
            type="number"
            placeholder={datos.arpillasCantidad}
            onChange={(e) => onChange("arpillasCantidad", e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeLogo"
            min="0"
          />
        </div>

        {/* Arpillas - Importe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Importe por Arpillas ($)
          </label>
          <input
            type="number"
            placeholder={datos.arpillasImporte}
            onChange={(e) => onChange("arpillasImporte", e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeLogo"
            min="0"
            step="0.01"
          />
        </div>

        {/* Excedentes - Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Excedentes
          </label>
          <input
            type="text"
            placeholder={datos.excedentes}
            onChange={(e) => onChange("excedentes", e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeLogo"
            min="0"
          />
        </div>

        {/* Excedentes - Importe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Importe por Excedentes ($)
          </label>
          <input
            type="number"
            placeholder={datos.excedentesImporte}
            onChange={(e) => onChange("excedentesImporte", e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeLogo"
            min="0"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 rounded-lg bg-verdeLogo text-white hover:bg-green-700 transition-colors"
        >
          Generar Cobranza
        </button>
      </div>
    </div>
  </div>
);

export default FormularioCobranza;