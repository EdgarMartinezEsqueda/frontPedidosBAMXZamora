const DenominacionInput = ({ denominacion, value, onChange, isLoading }) => (
  <div className={`flex items-center justify-between p-4 ${denominacion.bgColor} border border-gray-200 dark:border-gray-600 rounded-lg transition-all hover:shadow-md`}>
    <span className={`font-medium ${denominacion.color}`}>{denominacion.label}</span>
    <div className="flex items-center gap-3">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(denominacion.key, e.target.value)}
        disabled={isLoading}
        className="w-16 px-2 py-1 text-center border rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent disabled:opacity-50 bg-white dark:bg-gray-800"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] text-right font-medium">
        ${(value * denominacion.value).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </span>
    </div>
  </div>
);

export default DenominacionInput;
