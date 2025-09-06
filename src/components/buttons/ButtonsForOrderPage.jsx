import { useNavigate } from "react-router";
import { CiEdit } from "react-icons/ci";

const ButtonGroup = ({ disabled, id }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/pedido/editar/${id}`); // Redirige a la ruta relativa "editar"
  };

  return (
    <div className="flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-900 dark:border-gray-700 dark:divide-gray-700">
      <button 
        disabled={disabled} 
        className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 gap-x-3
          ${
            disabled
              ? "text-gray-400 cursor-not-allowed opacity-50 dark:text-gray-500"
              : "text-gray-600 dark:text-white cursor-pointer hover:bg-amarilloLogo hover:text-black"
          }`}
        onClick={handleClick}>
        < CiEdit className="text-2xl"/>
        <span>Editar</span>
      </button>
    </div>
  );
};

export default ButtonGroup;