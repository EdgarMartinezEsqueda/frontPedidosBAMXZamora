import DarkModeToggle from "components/buttons/DarkModeToggle";
import { useAuth } from "context/AuthContext";
import { useTheme } from "context/ThemeContext";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import { FiChevronDown, FiUser } from "react-icons/fi";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

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
    { text: "Complementos", roles: ["Direccion", "Almacen"], link: "/tiposComplemento" },
    { text: "Soporte", roles: ["Direccion"] , link: "/tickets" },
  ];

  // Filtrar enlaces según el rol
  const filteredLinks = menuItems.filter(item => item.roles.includes(rol));

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img 
                className="w-auto h-9 sm:h-10" 
                src={isDark 
                  ? "https://bamxzamora.org/assets/images/logoOscuro.webp" 
                  : "https://bamxzamora.org/assets/images/zamora.webp"
                } 
                alt="BAMX Zamora Logo" 
              />
            </a>
          </div>

          {/* Desktop Navigation - Centrado */}
          <div className="hidden lg:flex lg:items-center lg:justify-center flex-1 px-4">
            <div className="flex items-center space-x-1">
              {filteredLinks.map((link) => (
                <a
                  key={link.text}
                  href={link.link}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white whitespace-nowrap"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* User Menu & Dark Mode - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            <DarkModeToggle />
            
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="toggle profile dropdown"
              >
                <FiUser className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{username ?? "Usuario"}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <dialog 
                  ref={dropdownRef}
                  open={isDropdownOpen}
                  className="absolute right-0 z-30 w-48 mt-2 origin-top-right bg-white rounded-lg shadow-xl dark:bg-gray-800 ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700"
                  onClose={() => setIsDropdownOpen(false)}
                >
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => navigate(`/usuarios/${user.data.id}`)}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                      role="menuitem"
                    >
                      Perfil
                    </button>
                    {rol !== "Almacen" && rol !== "Contabilidad" && rol !== "Consejo" && (
                      <button
                        onClick={() => navigate(`/pedidos/ts/${user.data.id}`)}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                        role="menuitem"
                      >
                        Mis pedidos
                      </button>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-150"
                      role="menuitem"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </dialog>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              aria-label="toggle menu"
            >
              {isOpen ? <IoMdClose className="w-6 h-6" /> : <HiOutlineMenuAlt4 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {filteredLinks.map((link) => (
            <a
              key={link.text}
              href={link.link}
              className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
            >
              {link.text}
            </a>
          ))}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{username ?? "Usuario"}</strong>
              </span>
              <DarkModeToggle />
            </div>
            
            <button
              onClick={() => navigate(`/usuarios/${user.data.id}`)}
              className="block w-full px-3 py-2 text-left text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Perfil
            </button>
            
            {rol !== "Almacen" && rol !== "Contabilidad" && rol !== "Consejo" && (
              <button
                onClick={() => navigate(`/pedidos/ts/${user.data.id}`)}
                className="block w-full px-3 py-2 text-left text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Mis pedidos
              </button>
            )}
            
            <button
              onClick={logout}
              className="block w-full px-3 py-2 text-left text-base font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;