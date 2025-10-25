import AcceptButton from "components/buttons/Accept";
import { useEffect, useState } from "react";

const TipoComplementoForm = ({ onSubmit, isSubmitting, existingTipo }) => {
  const [nombre, setNombre] = useState(existingTipo?.nombre || "");
  const [unidadMedida, setUnidadMedida] = useState(existingTipo?.unidadMedida || "kg");
  const [activo, setActivo] = useState(existingTipo?.activo !== undefined ? existingTipo.activo : true);

  // Si recibes datos existentes (para edición)
  useEffect(() => {
    if (existingTipo) {
      setNombre(existingTipo.nombre);
      setUnidadMedida(existingTipo.unidadMedida);
      setActivo(existingTipo.activo);
    }
  }, [existingTipo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      nombre: nombre.trim(),
      unidadMedida
    };
    
    // Solo incluir 'activo' si estamos editando
    if (existingTipo) {
      data.activo = activo;
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Nombre */}
      <div>
        <label 
          htmlFor="nombre" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nombre del Complemento
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogo dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Ej: Frutas, Verduras, Latas..."
          autoComplete="off"
          required
          minLength={3}
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Ingresa el nombre del tipo de complemento (mínimo 3 caracteres)
        </p>
      </div>

      {/* Campo Unidad de Medida */}
      <div>
        <label 
          htmlFor="unidadMedida" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
          Unidad de Medida
        </label>
        
        <div className="space-y-3">
          {/* Opción Kilogramos */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-verdeLogo has-[:checked]:border-verdeLogo has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
            <input
              type="radio"
              name="unidadMedida"
              value="kg"
              checked={unidadMedida === "kg"}
              onChange={(e) => setUnidadMedida(e.target.value)}
              className="mt-1 h-4 w-4 text-verdeLogo focus:ring-verdeLogo"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900 dark:text-white">
                Kilogramos (kg)
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para alimentos que se pesan (frutas, verduras, granos, etc.)
              </p>
            </div>
          </label>

          {/* Opción Piezas */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-verdeLogo has-[:checked]:border-verdeLogo has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
            <input
              type="radio"
              name="unidadMedida"
              value="pz"
              checked={unidadMedida === "pz"}
              onChange={(e) => setUnidadMedida(e.target.value)}
              className="mt-1 h-4 w-4 text-verdeLogo focus:ring-verdeLogo"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900 dark:text-white">
                Piezas (pz)
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para productos que se cuentan individualmente
              </p>
            </div>
          </label>

          {/* Opción Litros */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-verdeLogo has-[:checked]:border-verdeLogo has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
            <input
              type="radio"
              name="unidadMedida"
              value="lt"
              checked={unidadMedida === "lt"}
              onChange={(e) => setUnidadMedida(e.target.value)}
              className="mt-1 h-4 w-4 text-verdeLogo focus:ring-verdeLogo"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900 dark:text-white">
                Litros (lt)
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para líquidos (leche, aceite, agua, etc.)
              </p>
            </div>
          </label>

          {/* Opción Cajas */}
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-verdeLogo has-[:checked]:border-verdeLogo has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/20">
            <input
              type="radio"
              name="unidadMedida"
              value="caja"
              checked={unidadMedida === "caja"}
              onChange={(e) => setUnidadMedida(e.target.value)}
              className="mt-1 h-4 w-4 text-verdeLogo focus:ring-verdeLogo"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900 dark:text-white">
                Cajas (caja)
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para productos empaquetados en cajas o contenedores
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Campo Estado (solo en modo edición) */}
      {existingTipo && (
        <div>
          <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-verdeLogo">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="h-5 w-5 text-verdeLogo focus:ring-verdeLogo rounded"
            />
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                Tipo de complemento activo
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activo 
                  ? "Este tipo está disponible para agregar a pedidos" 
                  : "Este tipo no aparecerá en las opciones de complementos"}
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Botón Submit */}
      <div className="flex justify-center pt-2">
        <AcceptButton
          disabled={isSubmitting || !nombre.trim()}
          type="submit"
          label={
            isSubmitting
              ? (existingTipo ? "Actualizando..." : "Creando...")
              : (existingTipo ? "Actualizar Tipo" : "Crear Tipo")
          }
        />
      </div>
    </form>
  );
};

export default TipoComplementoForm;