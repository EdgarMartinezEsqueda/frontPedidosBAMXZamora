import { Link } from "react-router";
import { CiEdit } from "react-icons/ci";

const ButtonGroup = () => {
  return (
    <Link 
    className=" flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:bg-gray-900 dark:border-gray-700 dark:divide-gray-700 w-xs m-auto justify-center items-center px-4 py-2 text-sm font-medium transition-colors duration-200 sm:text-base sm:px-6 gap-x-3 text-gray-600 dark:text-white cursor-pointer hover:bg-amarilloLogo hover:text-black"
      to="/comunidades/nuevo" 
      label="Crear nueva comunidad" >
        < CiEdit className="text-2xl"/>
        Crear nueva comunidad
    </Link>
  );
};

export default ButtonGroup;