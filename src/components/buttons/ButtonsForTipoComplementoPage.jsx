import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";

const NewTipoComplementoButton = () => {
  return (
    <div className="flex justify-center my-4">
      <Link
        to="/tiposComplemento/nuevo"
        className="bg-verdeLogo text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors duration-200 font-medium inline-flex items-center gap-2"
      >
        <HiPlus className="w-5 h-5" />
        Nuevo Tipo de Complemento
      </Link>
    </div>
  );
};

export default NewTipoComplementoButton;