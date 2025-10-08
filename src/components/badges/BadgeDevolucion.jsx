import { FiInfo } from "react-icons/fi";

const BadgeDevolucion = ({ devoluciones, onClick }) => {
  const total = typeof devoluciones === "number" 
    ? devoluciones 
    : devoluciones?.total || 0;
  
  const tieneDesglose = devoluciones?.desglose !== null;

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300 transition-colors"
    >
      <span>{total}</span>
      {tieneDesglose && (
        <FiInfo 
          size={16} 
          className="opacity-60 group-hover:opacity-100 transition-opacity" 
        />
      )}
    </button>
  );
};

export default BadgeDevolucion;