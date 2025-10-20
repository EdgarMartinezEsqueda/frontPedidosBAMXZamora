import { useState } from "react";

const DENOMINATIONS_CONFIG = [
  { key: "billetes1000", value: 1000, label: "Billetes $1,000", bgColor: "bg-purple-50 dark:bg-purple-900/30" },
  { key: "billetes500", value: 500, label: "Billetes $500", bgColor: "bg-blue-50 dark:bg-blue-900/30" },
  { key: "billetes200", value: 200, label: "Billetes $200", bgColor: "bg-green-50 dark:bg-green-900/30" },
  { key: "billetes100", value: 100, label: "Billetes $100", bgColor: "bg-red-50 dark:bg-red-900/30" },
  { key: "billetes50", value: 50, label: "Billetes $50", bgColor: "bg-pink-50 dark:bg-pink-900/30" },
  { key: "billetes20", value: 20, label: "Billetes $20", bgColor: "bg-yellow-50 dark:bg-yellow-900/30" },
  { key: "monedas20", value: 20, label: "Monedas $20", bgColor: "bg-gray-50 dark:bg-gray-700/50" },
  { key: "monedas10", value: 10, label: "Monedas $10", bgColor: "bg-yellow-100 dark:bg-yellow-900/40" },
  { key: "monedas5", value: 5, label: "Monedas $5", bgColor: "bg-orange-50 dark:bg-orange-900/30" },
  { key: "monedas2", value: 2, label: "Monedas $2", bgColor: "bg-gray-100 dark:bg-gray-700/60" },
  { key: "monedas1", value: 1, label: "Monedas $1", bgColor: "bg-yellow-200 dark:bg-yellow-900/50" },
  { key: "monedas50C", value: 0.5, label: "Monedas $0.50", bgColor: "bg-gray-100 dark:bg-gray-700/60" },
];

const DenominationItem = ({ denomination, cantidad }) => {
  if (cantidad <= 0) return null;
  
  return (
    <div className={`flex justify-between p-2 ${denomination.bgColor} rounded text-gray-800 dark:text-gray-200`}>
      <span>{denomination.label}:</span>
      <span className="font-medium">
        {cantidad} × ${denomination.value.toLocaleString()}
      </span>
    </div>
  );
};

const CashBreakdown = ({ efectivo }) => {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  if (!efectivo) return null;

  const usuarioEfectivo = efectivo.usuario?.username;

  return (
    <>
      <div className="mt-4 text-center">
        <button
          onClick={() => setMostrarDetalle(!mostrarDetalle)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
        >
          {mostrarDetalle ? "Ocultar" : "Ver"} desglose de efectivo
        </button>
      </div>

      {mostrarDetalle && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Desglose del efectivo, reportado por{" "}
            <strong className="text-cyan-950 dark:text-cyan-400">{usuarioEfectivo}</strong>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {DENOMINATIONS_CONFIG.map(denomination => (
              <DenominationItem 
                key={denomination.key}
                denomination={denomination}
                cantidad={efectivo[denomination.key]}
              />
            ))}
          </div>

          {efectivo.observaciones && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Observaciones:</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{efectivo.observaciones}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CashBreakdown;