import { useState, useEffect } from "react";
import AcceptButton from "components/buttons/Accept";

const RouteForm = ({ onSubmit, isSubmitting, existingRoute }) => {
  const [nombreRuta, setNombreRuta] = useState(existingRoute?.nombre || "");

  // Si recibes datos existentes (para edición)
  useEffect(() => {
    if(existingRoute) {
      setNombreRuta(existingRoute.nombre);
    }
  }, [existingRoute]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nombreRuta.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nombreRuta" className="block text-sm font-medium text-gray-700">
          Nombre de la ruta
        </label>
        <input
          type="text"
          id="nombreRuta"
          value={nombreRuta}
          onChange={(e) => setNombreRuta(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo"
          placeholder="Ej: Ruta Norte"
          autoComplete="off"
        />
      </div>

      <div className="flex justify-center">
        <AcceptButton 
          disabled={isSubmitting}
          type="submit"
          label={isSubmitting 
            ? (existingRoute ? "Actualizando..." : "Creando...") 
            : (existingRoute ? "Actualizar Ruta" : "Crear Ruta")}
        />
      </div>
    </form>
  );
};

export default RouteForm;