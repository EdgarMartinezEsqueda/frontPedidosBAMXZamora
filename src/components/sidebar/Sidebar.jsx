import { useAuth } from "context/AuthContext";
import { useState } from "react";
import { FaBoxOpen, FaHeart, FaHome, FaMapMarked, FaMoneyBill, FaTruck, FaUsers } from "react-icons/fa";
import { HiCube } from "react-icons/hi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const rol = user?.data?.rol;

  const allNavItems = [
    { label: "Resumen", icon: <FaHome />, to: "/reportes" },
    { label: "Despensas", icon: <FaBoxOpen />, to: "/reportes/despensas" },
    { label: "Rutas", icon: <FaTruck />, to: "/reportes/rutas" },
    { label: "Trabajadores Sociales", icon: <FaUsers />, to: "/reportes/ts" },
    { label: "Comunidades", icon: <FaMapMarked />, to: "/reportes/comunidades" },
    { label: "Apadrinadas", icon: <FaHeart />, to: "/reportes/apadrinadas" },
    { label: "Económico", icon: <FaMoneyBill />, to: "/reportes/economico" },
    { label: "Complementos", icon: <HiCube />, to: "/reportes/complementos" },
  ];

  const getFilteredItems = () => {
    switch(rol) {
      case "Direccion":
      case "Consejo":
        return allNavItems;
      
      case "Coordinadora":
        return allNavItems.filter(item => item.label !== "Económico");
      
      case "Contabilidad":
        return allNavItems.filter(item => item.label !== "Trabajadores Sociales");

      case "Ts":
        return allNavItems.filter(item => item.label !== "Económico" && item.label !== "Trabajadores Sociales" );
      
      case "Almacen":
        return allNavItems.filter(item => 
          ["Resumen", "Comunidades", "Rutas", "Despensas"].includes(item.label)
        );
      
      default:
        return [];
    }
  };

  const filteredNavItems = getFilteredItems();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-20 left-4 z-50 text-2xl bg-bgClaro/50 rounded-full p-2 ${
          isOpen ? "left-68" : "left-4"
        }`}
      >
        {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block w-64 fixed lg:static h-full bg-white dark:bg-gray-800 shadow z-10`}
      >
        <div className="p-4 space-y-4">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`px-4 py-3 flex items-center space-x-4 rounded-md transition-colors ${
                  isActive
                    ? "text-white bg-gradient-to-r from-sky-600 to-cyan-400"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;