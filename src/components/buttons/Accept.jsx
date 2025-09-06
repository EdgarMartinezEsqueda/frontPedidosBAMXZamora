import { FaCheck } from "react-icons/fa";

const Button = ({ disabled, onClick }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform
      ${ disabled
        ? "text-gray-400 cursor-not-allowed opacity-50 bg-verdeLogo"
        : `bg-verdeLogo rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80 cursor-pointer`
      }`}>
      < FaCheck />
      <span className="mx-1">Aceptar</span>
    </button>
  );
};

export default Button;