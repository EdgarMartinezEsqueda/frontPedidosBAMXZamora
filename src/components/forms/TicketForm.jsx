import { useState, useEffect } from "react";
import AcceptButton from "components/buttons/Accept";
import Select from "components/selects/Select";
import { useAuth } from "context/AuthContext";
import { hasPermission, RESOURCES } from "utils/permisos";

const TicketForm = ({ onSubmit, isSubmitting, existingTicket }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    descripcion: "",
    comentarios: "",
    prioridad: "baja",
    estatus: "abierto" // Nuevo campo para el estatus
  });

  // Inicializar datos si estamos editando
  useEffect(() => {
    if (existingTicket) {
      setFormData({
        descripcion: existingTicket.descripcion || "",
        comentarios: existingTicket.comentarios || "",
        prioridad: existingTicket.prioridad || "baja",
        estatus: existingTicket.estatus || "abierto"
      });
    }
  }, [existingTicket]);

  // Verificar si es usuario de Dirección
  const canEditStatus = hasPermission(user.data, RESOURCES.TICKETS, "update");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      idUsuario: user.data.id
    };
    
    // Si no es dirección, no enviar el estatus
    if (!canEditStatus) {
      delete submitData.estatus;
    }

    onSubmit(submitData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Campo Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción del problema
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 h-32 focus:border-verdeLogo focus:ring-verdeLogo"
            required
            disabled={!canEditStatus && !!existingTicket}
          />
        </div>

        {/* Selector de Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prioridad
          </label>
          <Select
            name="prioridad"
            options={[
              { id: "baja", nombre: "Baja" },
              { id: "media", nombre: "Media" },
              { id: "alta", nombre: "Alta" }
            ]}
            value={formData.prioridad}
            onChange={handleChange}
            isDisabled={!canEditStatus && !!existingTicket}
            placeholder="Seleccione la prioridad"
          />
        </div>

        {/* Selector de Estatus (solo para Dirección) */}
        {canEditStatus && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estatus
            </label>
            <Select
              name="estatus"
              options={[
                { id: "abierto", nombre: "Abierto" },
                { id: "en_proceso", nombre: "En proceso" },
                { id: "cerrado", nombre: "Cerrado" },
                { id: "cancelado", nombre: "Cancelado" }
              ]}
              value={formData.estatus}
              onChange={handleChange}
              placeholder="Seleccione el estatus"
            />
            <label className="block text-sm font-medium text-gray-700">
              Comentarios finales
            </label>
            <textarea
              name="comentarios"
              value={formData.comentarios ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 h-32 focus:border-verdeLogo focus:ring-verdeLogo"
              disabled={!canEditStatus && !!existingTicket}
            />
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <AcceptButton
          disabled={isSubmitting || (!canEditStatus && !!existingTicket)}
          type="submit"
          label={isSubmitting 
            ? (existingTicket ? "Actualizando..." : "Creando...") 
            : (existingTicket ? "Actualizar Ticket" : "Crear Ticket")}
        />
      </div>
    </form>
  );
};

export default TicketForm;