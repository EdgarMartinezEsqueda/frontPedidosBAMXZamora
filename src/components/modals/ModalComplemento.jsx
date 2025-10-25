import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AcceptButton from "components/buttons/Accept";
import api from "lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiX } from "react-icons/hi";

const ModalComplemento = ({ isOpen, onClose, idPedido, complementoExistente = null }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    idTipoComplemento: "",
    cantidad: "",
    pesoKg: "",
    costoTotal: "",
    costoPorUnidad: "",
    observaciones: ""
  });

  // Obtener tipos de complemento activos
  const { data: tiposComplemento } = useQuery({
    queryKey: ["tiposComplemento"],
    queryFn: async () => {
      const { data } = await api.get("/tiposComplemento");
      return data.filter(tipo => tipo.activo);
    },
    enabled: isOpen
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (complementoExistente) {
      setFormData({
        idTipoComplemento: complementoExistente.idTipoComplemento,
        cantidad: complementoExistente.cantidad,
        pesoKg: complementoExistente.pesoKg,
        costoTotal: complementoExistente.costoTotal,
        costoPorUnidad: complementoExistente.costoPorUnidad || "",
        observaciones: complementoExistente.observaciones || ""
      });
    } else {
      // Reset form si es nuevo
      setFormData({
        idTipoComplemento: "",
        cantidad: "",
        pesoKg: "",
        costoTotal: "",
        costoPorUnidad: "",
        observaciones: ""
      });
    }
  }, [complementoExistente, isOpen]);

  // Calcular costo por unidad automáticamente
  useEffect(() => {
    if (formData.cantidad && formData.costoTotal) {
      const cantidad = parseFloat(formData.cantidad);
      const costo = parseFloat(formData.costoTotal);
      if (cantidad > 0 && costo >= 0) {
        setFormData(prev => ({
          ...prev,
          costoPorUnidad: (costo / cantidad).toFixed(2)
        }));
      }
    }
  }, [formData.cantidad, formData.costoTotal]);

  // Mutation para crear
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post("/complementos", {
        ...data,
        idPedido
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Complemento agregado exitosamente");
      queryClient.invalidateQueries(["complementos", idPedido]);
      queryClient.invalidateQueries(["pedido", idPedido]);
      onClose();
    },
    onError: (error) => {
      console.log(error);
      const message = error.response?.data?.error?.message || "Error al agregar complemento";
      toast.error(message);
    }
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.patch(
        `/complementos/${complementoExistente.id}`,
        data
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Complemento actualizado exitosamente");
      queryClient.invalidateQueries(["complementos", idPedido]);
      queryClient.invalidateQueries(["pedido", idPedido]);
      onClose();
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || "Error al actualizar complemento";
      toast.error(message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.idTipoComplemento || !formData.cantidad || !formData.pesoKg || !formData.costoTotal) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const dataToSend = {
      idTipoComplemento: parseInt(formData.idTipoComplemento),
      cantidad: parseFloat(formData.cantidad),
      pesoKg: parseFloat(formData.pesoKg),
      costoTotal: parseFloat(formData.costoTotal),
      costoPorUnidad: formData.costoPorUnidad ? parseFloat(formData.costoPorUnidad) : null,
      observaciones: formData.observaciones.trim() || null
    };

    if (complementoExistente) {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Obtener unidad de medida del tipo seleccionado
  const tipoSeleccionado = tiposComplemento?.find(
    tipo => tipo.id === parseInt(formData.idTipoComplemento)
  );

  if (!isOpen) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-verdeLogo">
            {complementoExistente ? "Editar Complemento" : "Agregar Complemento"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Complemento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Tipo de Complemento <span className="text-red-500">*</span>
            </label>
            <select
              name="idTipoComplemento"
              value={formData.idTipoComplemento}
              onChange={handleChange}
              disabled={complementoExistente}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">Selecciona un tipo</option>
              {tiposComplemento?.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre} ({tipo.unidadMedida})
                </option>
              ))}
            </select>
            {complementoExistente && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                El tipo de complemento no se puede cambiar al editar
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Cantidad
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                step="1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ej: 50"
                required
              />
            </div>

            {/* Peso en KG */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Peso Total (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pesoKg"
                value={formData.pesoKg}
                onChange={handleChange}
                step="1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ej: 45.5"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Peso total en kilogramos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Costo Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Costo Total ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="costoTotal"
                value={formData.costoTotal}
                onChange={handleChange}
                step="1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ej: 1500.00"
                required
              />
            </div>

            {/* Costo por Unidad (calculado automáticamente) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Costo por Unidad ($)
              </label>
              <input
                type="number"
                name="costoPorUnidad"
                value={formData.costoPorUnidad}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white cursor-not-allowed"
                placeholder="Calculado automáticamente"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Se calcula automáticamente
              </p>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-verdeLogo focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Notas adicionales sobre el complemento..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <AcceptButton
              type="submit"
              disabled={isPending}
              label={isPending ? "Guardando..." : complementoExistente ? "Actualizar" : "Agregar"}
            />
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalComplemento;