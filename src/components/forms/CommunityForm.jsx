import { useQuery } from "@tanstack/react-query";
import AcceptButton from "components/buttons/Accept";
import Select from "components/selects/Select";
import api from "lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CommunityForm = ({ onSubmit, isSubmitting, existingCommunity }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    idMunicipio: "",
    jefa: "",
    contacto: "",
    direccion: "",
    idRuta: "",
    notas: "",
    costoPaquete: 0
  });

  // Inicializar datos si estamos editando
  useEffect(() => {
    if (existingCommunity) {
      setFormData({
        nombre: existingCommunity.nombre || "",
        idMunicipio: existingCommunity.idMunicipio || "",
        jefa: existingCommunity.jefa || "",
        contacto: existingCommunity.contacto || "",
        direccion: existingCommunity.direccion || "",
        idRuta: existingCommunity.idRuta || "",
        costoPaquete: existingCommunity.costoPaquete || "",
        notas: existingCommunity.notas || ""
      });
    }
  }, [existingCommunity]);
  // Obtener rutas y municipios
  const { data: rutas = [] } = useQuery({
    queryKey: ["rutas"],
    queryFn: async () => {
      const { data } = await api.get("/rutas");
      return data;
    },
    onError: () => toast.error("Error cargando rutas")
  });

  const { data: municipios = [] } = useQuery({
    queryKey: ["municipios"],
    queryFn: async () => {
      const { data } = await api.get("/municipios");
      return data;
    },
    onError: () => toast.error("Error cargando municipios")
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nombre de la comunidad
          </label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-verdeLogo focus:ring-verdeLogo focus:ring-2 focus:outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
          />
        </div>

        {/* Selector de Municipio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Municipio perteneciente
          </label>
          <Select
            name="idMunicipio"
            options={municipios}
            value={formData.idMunicipio}
            onChange={handleChange}
            placeholder="Selecciona un municipio"
          />
        </div>

        {/* Selector de Ruta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Ruta asociada
          </label>
          <Select
            name="idRuta"
            options={rutas}
            value={formData.idRuta}
            onChange={handleChange}
            placeholder="Selecciona una ruta"
          />
        </div>

        {/* Costo de Paquete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Costo de paquete alimentario
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 select-none">
              $
            </span>
            <input
              type="number"
              min={0}
              name="costoPaquete"
              onChange={handleChange}
              value={formData.costoPaquete}
              required
              className="pl-7 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-verdeLogo focus:ring-2 focus:ring-verdeLogo focus:outline-none transition-colors rounded-md"
            />
          </div>
        </div>

        {/* Campos restantes */}
        {["jefa", "contacto", "direccion", "notas"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{
                jefa: "Jefa de comunidad",
                contacto: "Contacto de la jefa",
                direccion: "Dirección o enlace de mapa",
                notas: "Notas adicionales"
              }[field]}
            </label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:border-verdeLogo focus:ring-verdeLogo focus:ring-2 focus:outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <AcceptButton
          disabled={isSubmitting}
          type="submit"
          label={isSubmitting 
            ? (existingCommunity ? "Actualizando..." : "Creando...") 
            : (existingCommunity ? "Actualizar Comunidad" : "Crear Comunidad")}
        />
      </div>
    </form>
  );
};

export default CommunityForm;