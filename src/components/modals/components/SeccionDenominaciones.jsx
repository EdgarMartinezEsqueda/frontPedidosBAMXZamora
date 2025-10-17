import { FaCoins, FaMoneyBillWave } from "react-icons/fa";
import DenominacionInput from "./DenominacionInput";

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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{tipo}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className={`font-medium ${colorClass}`}>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
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

export default SeccionDenominaciones;
