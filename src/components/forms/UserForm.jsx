import AcceptButton from "components/buttons/Accept";
import { useEffect, useState } from "react";

import { useAuth } from "context/AuthContext";

const UserForm = ({ onSubmit, isSubmitting, existingUser, newUser = false }) => {
  const initialData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificado: false
  };

  const { user } = useAuth();

  const [userData, setUserData] = useState(initialData);
  const [clientErrors, setClientErrors] = useState({});

  // Inicializar con datos existentes
  useEffect(() => {
    if (existingUser) {
      setUserData({
        ...existingUser,
        password: "",
        confirmPassword: ""
      });
    } else {
      setUserData(initialData);
    }
  }, [existingUser]);

  const validateForm = () => {
    const errors = {};
    
    if (!userData.username) errors.username = "Nombre requerido";
    if (!userData.email) {
      errors.email = "Email requerido";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Email inválido";
    }
    
    if (!existingUser && !userData.password) {
      errors.password = "Contraseña requerida";
    }
    
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Preparar datos para enviar
    const payload = { ...userData };
    
    // Si es edición y no hay cambios en la contraseña, eliminar campos
    if (existingUser) {
      if (!payload.password) {
        delete payload.password;
        delete payload.confirmPassword;
      }
      
      // Eliminar campos no modificados
      const originalData = { ...existingUser, password: "", confirmPassword: "" };
      Object.keys(payload).forEach(key => {
        if (payload[key] === originalData[key]) delete payload[key];
      });
    }

    onSubmit(payload);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nombre de usuario
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={userData.username}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo transition-colors"
          autoComplete="off"
        />
        {clientErrors.username && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{clientErrors.username}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={userData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo transition-colors"
          autoComplete="off"
        />
        {clientErrors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{clientErrors.email}</p>}
      </div>

      { !newUser && user.data.rol === "Direccion" && 
        (<div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Rol
          </label>
          <select 
            name="rol" 
            id="rol"
            value={userData.rol}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo transition-colors"
            autoComplete="off">
              <option value="Almacen">Almacen</option>
              <option value="Consejo">Consejo</option>
              <option value="Contabilidad">Contabilidad</option>
              <option value="Coordinadora">Coordinadora</option>
              <option value="Direccion">Dirección</option>
              <option value="Ts">Trabajador Social</option>
            </select>
        </div>) }

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {existingUser ? "Nueva contraseña" : "Contraseña"}
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={userData.password}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo transition-colors"
          autoComplete="new-password"
        />
        {clientErrors.password && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{clientErrors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Confirmar contraseña
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo transition-colors"
          autoComplete="new-password"
        />
        {clientErrors.confirmPassword && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{clientErrors.confirmPassword}</p>
        )}
      </div>

      {!newUser && user.data.rol === "Direccion" && 
        (<div className="flex items-center">
          <input
            type="checkbox"
            name="verificado"
            id="verificado"
            checked={userData.verificado}
            onChange={handleInputChange}
            className="h-4 w-4 text-verdeLogo focus:ring-verdeLogo border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
          />
          <label htmlFor="verificado" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
            Verificado
          </label>
        </div>) 
      }

      <div className="flex justify-center">
        <AcceptButton 
          disabled={isSubmitting || Object.keys(clientErrors).length > 0}
          type="submit"
          label={isSubmitting 
            ? (existingUser ? "Actualizando..." : "Creando...") 
            : (existingUser ? "Actualizar Usuario" : "Crear Usuario")}
        />
      </div>
    </form>
  );
};

export default UserForm;