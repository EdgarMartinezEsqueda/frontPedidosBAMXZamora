import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "context/AuthContext";
import DarkModeToggle from "components/buttons/DarkModeToggle";
import { useTheme } from "context/ThemeContext";

import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { isDark } = useTheme();  // Importar el contexto del modo light/dark

  const navigate = useNavigate();

  const rol = user.data.rol;
  const username = user.data.username;
  
  // Definición de enlaces y permisos
  const menuItems = [
    { text: "Calendario", roles: ["Direccion", "Consejo",  "Ts", "Almacen", "Coordinadora", "Contabilidad"], link: "/calendario" },
    { text: "Pedidos", roles: ["Direccion", "Consejo",  "Ts", "Almacen", "Coordinadora", "Contabilidad"], link: "/" },
    { text: "Nuevo pedido", roles: ["Direccion", "Ts", "Coordinadora"], link: "/pedido/nuevo" },
    { text: "Reportes", roles: ["Direccion", "Coordinadora", "Consejo", "Contabilidad", "Almacen", "Ts"] , link: "/reportes" },
    { text: "Usuarios", roles: ["Direccion"] , link: "/usuarios" },
    { text: "Rutas", roles: ["Direccion", "Consejo",  "Coordinadora", "Ts", "Contabilidad", "Almacen"], link: "/rutas" },
    { text: "Comunidades", roles: ["Direccion", "Consejo",  "Coordinadora", "Ts", "Contabilidad", "Almacen"], link: "/comunidades" },
    { text: "Soporte", roles: ["Direccion"] , link: "/tickets" },
  ];

  // Filtrar enlaces según el rol
  const filteredLinks = menuItems.filter(item => item.roles.includes(rol));

  return (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <a href="/">
              <img 
                className="w-auto h-7" 
                src={isDark 
                  ? "https://bamxtepatitlan.org/assets/logoModoOscuro-BZP1mUxE.png" 
                  : "https://bamxtepatitlan.org/assets/logo-B5cTjWox.png"
                } 
                alt="BAMX Tepatitlán Logo" 
              />
            </a>
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                aria-label="toggle menu" >
                { isOpen ? ( < IoMdClose /> ) : ( < HiOutlineMenuAlt4/> )}
              </button>
            </div>
          </div>
          {/* Menú dinámico */}
          <div className={`absolute inset-x-0 z-20 w-full px-6 py-4 bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center ${isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"}`}>
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
              {filteredLinks.map((link) => (
                <a
                  key={link.text}
                  href={link.link}
                  className="px-3 py-2 mx-3 mt-2 text-gray-700 rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                >
                  {link.text}
                </a>
              ))}
            </div>
            <div className="flex items-center mt-4 lg:mt-0">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none cursor-pointer"
                  aria-label="toggle profile dropdown"
                >
                  <h3 className=" text-gray-700 dark:text-gray-200">
                    Bienvenido: <strong>{username ?? "Usuario"}</strong>
                  </h3>
                </button>
                {isDropdownOpen && (
                  <dialog 
                  ref={dropdownRef}
                  open={isDropdownOpen}
                  className="absolute right-0 z-30 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                  onClose={() => setIsDropdownOpen(false)}
                  >
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => navigate(`/usuarios/${user.data.id}`)}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        role="menuitem"
                      >
                        Perfil
                      </button>
                      { rol !== "Almacen" && rol !== "Contabilidad" && rol !== "Consejo" && (
                        <button
                          onClick={() => navigate(`/pedidos/ts/${user.data.id}`)}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                          role="menuitem"
                        >
                        Mis pedidos
                        </button>)
                      }
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        role="menuitem"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </dialog>
                )}
              </div>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;