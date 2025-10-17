export const DENOMINACIONES = {
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

export const getInitialEfectivoState = () =>
  [...DENOMINACIONES.billetes, ...DENOMINACIONES.monedas].reduce((acc, denominacion) => {
    acc[denominacion.key] = 0;
    return acc;
  }, { observaciones: "" });

export const getInitialTransferencia = () => ({
  id: Date.now() + Math.random(),
  folio: "",
  monto: "",
  banco: "",
  fechaTransferencia: "",
  nombreRemitente: "",
  observaciones: ""
});
