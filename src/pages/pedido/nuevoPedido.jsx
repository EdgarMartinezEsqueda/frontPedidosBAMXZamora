import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { useAuth } from "context/AuthContext";
import api from "lib/axios";

import AcceptButton from "components/buttons/Accept";
import Footer from "components/footer/Footer";
import Navbar from "components/navbar/Navbar";
import Select from "components/selects/Select";
import TableOrder from "components/tables/orders/TableOrder";

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
};

const NewOrder = () => {
  const { user } = useAuth();
  const idTs = user.data?.id;
  const navigate = useNavigate();

  const [selectedRutaId, setSelectedRutaId] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState(getTomorrowDate());
  const [newPedido, setNewPedido] = useState({ pedidoComunidad: [] });

  // Obtener comunidades desde la API
  const { data: comunidadesList = [], isLoading: isLoadingComunidades, error: errorComunidades } = useQuery({
    queryKey: ["comunidades"],
    queryFn: async () => {
      const { data } = await api.get("/comunidades");
      return data;
    },
    onError: () => toast.error("Error cargando comunidades")
  });

  // Obtener rutas desde la API
  const { data: rutas = [], isLoading: isLoadingRutas, error: errorRutas } = useQuery({
    queryKey: ["rutas"],
    queryFn: async () => {
      const { data } = await api.get("/rutas");
      return data;
    },
    onError: () => toast.error("Error cargando rutas")
  });

  // Determinar si la ruta seleccionada es de voluntariado
  const rutaSeleccionada = useMemo(() => {
    return rutas.find(r => r.id === selectedRutaId);
  }, [rutas, selectedRutaId]);

  const esRutaVoluntariado = rutaSeleccionada?.tipo === 'voluntariado';

  // Mutación para crear el pedido
  const { mutate, isPending } = useMutation({
    mutationFn: async (newOrder) => {
      const { data } = await api.post("/pedidos", newOrder);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Pedido creado exitosamente");
      navigate(`/pedido/${data.id}`);
    },
    onError: (error) => {
      const message = error.response?.data?.error.message || "Error al crear pedido";
      toast.error(message);
    }
  });

  // Función de envío
  const handleSubmit = () => {
    if (!idTs || !selectedRutaId || !fechaEntrega) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    // Estructura según tipo de ruta
    const comunidadesData = newPedido.pedidoComunidad.map((pedido) => {
      const baseData = {
        idComunidad: pedido.idComunidad,
        arpilladas: pedido.arpilladas || false,
        observaciones: pedido.observaciones || "",
        comite: pedido.comite || 0,
      };

      const rutaData = esRutaVoluntariado
        ? { despensasVoluntariado: pedido.despensasVoluntariado || 0 }
        : {
            despensasCosto: pedido.despensasCosto || 0,
            despensasMedioCosto: pedido.despensasMedioCosto || 0,
            despensasSinCosto: pedido.despensasSinCosto || 0,
            despensasApadrinadas: pedido.despensasApadrinadas || 0,
          };
      return {
        ...baseData,
        ...rutaData,
      };
    });


    mutate({
      idTs,
      idRuta: Number(selectedRutaId),
      fechaEntrega,
      comunidades: comunidadesData
    });
  };

  // Calcular total según tipo de ruta
  const totalDespensas = useMemo(() => {
    return newPedido.pedidoComunidad.reduce((total, pedido) => {
      if (esRutaVoluntariado) {
        return total + (pedido.despensasVoluntariado || 0);
      } else {
        return total + 
          (pedido.despensasCosto || 0) + 
          (pedido.despensasMedioCosto || 0) + 
          (pedido.despensasSinCosto || 0) + 
          (pedido.despensasApadrinadas || 0);
      }
    }, 0);
  }, [newPedido.pedidoComunidad, esRutaVoluntariado]);

  if (isLoadingComunidades || isLoadingRutas) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verdeLogo"></div>
      </div>
    );
  }

  if (errorComunidades || errorRutas) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error al cargar los datos</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800">
      <Navbar />
      <main className="flex-1">
        <h2 className="font-bold text-2xl w-full text-center pt-4 text-verdeLogo dark:text-green-400">
          Crear pedido para Ruta 
          <Select
            name="idRuta"
            options={rutas}
            value={selectedRutaId}
            onChange={(e) => setSelectedRutaId(Number(e.target.value))}
            placeholder="Seleccione la ruta"
          />
        </h2>

        {/* Indicador de tipo de ruta */}
        {selectedRutaId && rutaSeleccionada && (
          <div className="text-center mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              esRutaVoluntariado 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {esRutaVoluntariado ? '🤝 Ruta de Voluntariado' : '📦 Ruta Normal'}
            </span>
          </div>
        )}

        {selectedRutaId && (
          <>
            <div className="flex justify-center items-center my-4">
              <label 
                htmlFor="fechaEntrega" 
                className="block text-md px-2 text-gray-700 dark:text-gray-200"
              >
                Fecha de entrega: 
              </label>
              <input 
                type="date" 
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded text-center focus:border-verdeLogo focus:ring-2 focus:ring-verdeLogo focus:outline-none transition-colors"
                required
              />
            </div>

            <TableOrder 
              mode="create"
              data={newPedido}
              comunidades={comunidadesList}
              onDataChange={setNewPedido}
              selectedRutaId={selectedRutaId}
              esRutaVoluntariado={esRutaVoluntariado}
            />

            <div className="flex justify-center items-center flex-col max-w-md m-auto">
              <h2 className="block font-bold text-2xl text-rojoLogo dark:text-red-400">
                Total despensas
              </h2>
              <h3 className="relative flex items-center text-amarilloLogo dark:text-yellow-400 text-xl font-bold">
                {totalDespensas}
              </h3>
              {esRutaVoluntariado && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  (Despensas de voluntariado - sin costo)
                </p>
              )}
            </div>

            <div className="flex justify-center py-4">
              <AcceptButton 
                disabled={isPending} 
                onClick={handleSubmit}
                label={isPending ? "Creando..." : "Crear Pedido"}
              />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewOrder;