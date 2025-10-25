import { HiCash, HiClipboardList, HiReceiptTax, HiScale } from "react-icons/hi";

const ComplementosMetricsCards = ({ data }) => {
  const cards = [
    {
      title: "Pedidos con Complementos",
      value: data.pedidosConComplementos,
      subtitle: `${data.porcentajePedidosConComplementos}% del total`,
      icon: <HiClipboardList className="w-8 h-8" />,
      color: "blue"
    },
    {
      title: "Peso Total Distribuido",
      value: `${data.pesoTotalKg.toFixed(2)} kg`,
      subtitle: `${data.pesoPromedioComplemento.toFixed(2)} kg promedio`,
      icon: <HiScale className="w-8 h-8" />,
      color: "green"
    },
    {
      title: "Costo Total",
      value: `$${data.costoTotal.toFixed(2)}`,
      subtitle: `$${data.costoPromedioComplemento.toFixed(2)} promedio`,
      icon: <HiCash className="w-8 h-8" />,
      color: "purple"
    },
    {
      title: "Costo por Kilogramo",
      value: `$${data.costoPorKg}`,
      subtitle: "Promedio general",
      icon: <HiReceiptTax className="w-8 h-8" />,
      color: "yellow"
    }
  ];


  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {card.subtitle}
              </p>
            </div>
            <div className={`${colorClasses[card.color]} p-3 rounded-lg text-white`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplementosMetricsCards;