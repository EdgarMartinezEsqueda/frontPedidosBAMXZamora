import AcceptButton from "components/buttons/Accept";
import { useEffect, useState } from "react";

const RouteForm = ({ onSubmit, isSubmitting, existingRoute }) => {
  const [nombreRuta, setNombreRuta] = useState(existingRoute?.nombre || "");
  const [tipoRuta, setTipoRuta] = useState(existingRoute?.tipo || "normal");

  // Si recibes datos existentes (para edición)
  useEffect(() => {
    if (existingRoute) {
      setNombreRuta(existingRoute.nombre);
      setTipoRuta(existingRoute.tipo || "normal");
    }
  }, [existingRoute]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre: nombreRuta.trim(),
      tipo: tipoRuta
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Nombre de la Ruta */}
      <div>
        <label 
          htmlFor="nombreRuta" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nombre de la ruta
        </label>
        <input
          type="text"
          id="nombreRuta"
          value={nombreRuta}
          onChange={(e) => setNombreRuta(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ej: Ruta Norte"
          autoComplete="off"
          required
        />
      </div>

      {/* Campo Tipo de Ruta */}
      <div>
        <label 
          htmlFor="tipoRuta" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
          Tipo de ruta
        </label>
        
        <div className="space-y-3">
          {/* Opción Normal */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-verdeLogo has-[:checked]:border-verdeLogo has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
            <input
              type="radio"
              name="tipoRuta"
              value="normal"
              checked={tipoRuta === "normal"}
              onChange={(e) => setTipoRuta(e.target.value)}
              className="mt-1 h-4 w-4 text-verdeLogo focus:ring-verdeLogo"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900 dark:text-white">
                Ruta Normal
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Maneja despensas con costo, medio costo, sin costo y apadrinadas.
              </p>
            </div>
          </label>

          {/* Opción Voluntariado */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-verdeLogo has-[:checked]:border-verdeLogo has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
            <input
              type="radio"
              name="tipoRuta"
              value="voluntariado"
              checked={tipoRuta === "voluntariado"}
              onChange={(e) => setTipoRuta(e.target.value)}
              className="mt-1 h-4 w-4 text-verdeLogo focus:ring-verdeLogo"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900 dark:text-white">
                Ruta de Voluntariado
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Solo maneja despensas de voluntariado (sin costos).
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Botón Submit */}
      <div className="flex justify-center pt-2">
        <AcceptButton
          disabled={isSubmitting || !nombreRuta.trim()}
          type="submit"
          label={
            isSubmitting
              ? (existingRoute ? "Actualizando..." : "Creando...")
              : (existingRoute ? "Actualizar Ruta" : "Crear Ruta")
          }
        />
      </div>
    </form>
  );
};

export default RouteForm;