import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { useAuth } from "context/AuthContext";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TableOrder from "components/tables/orders/TableOrder";
import AcceptButton from "components/buttons/Accept";
import Select from "components/selects/Select";

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);  // Suma 1 día
  
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  
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

    const comunidadesData = newPedido.pedidoComunidad.map(pedido => ({
      idComunidad: pedido.idComunidad,
      despensasCosto: pedido.despensasCosto || 0,
      despensasMedioCosto: pedido.despensasMedioCosto || 0,
      despensasSinCosto: pedido.despensasSinCosto || 0,
      despensasApadrinadas: pedido.despensasApadrinadas || 0,
      arpilladas: pedido.arpilladas || false,
      observaciones: pedido.observaciones || "",
      comite: pedido.comite || 0,
    }));

    mutate({
      idTs,
      idRuta: Number(selectedRutaId),
      fechaEntrega,
      comunidades: comunidadesData
    });
  };

  if (isLoadingComunidades || isLoadingRutas) return <div>Cargando...</div>;
  if (errorComunidades || errorRutas) return <div>Error al cargar los datos</div>;
  
  return (
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <h2 className="font-bold text-2xl w-full text-center pt-4 text-verdeLogo">Crear pedido para Ruta 
          <Select
            name="idRuta"
            options={rutas}
            value={selectedRutaId}
            onChange={(e) => setSelectedRutaId(Number(e.target.value))}
            placeholder="Seleccione la ruta"
          />
        </h2>
        {selectedRutaId && (
          <>
            <div className="flex justify-center items-center my-4">
              <label htmlFor="fechaEntrega" className="block text-md px-2">Fecha de entrega: </label>
              <input 
                type="date" 
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="border p-2 rounded text-center"
                required
                />
            </div>
            <TableOrder 
              mode="create"
              data={newPedido}
              comunidades={comunidadesList}
              onDataChange={setNewPedido}
              selectedRutaId={selectedRutaId}
              />
            <div className="flex justify-center items-center flex-col max-w-md m-auto">
              <h2 className="block font-bold text-2xl text-rojoLogo">Total despensas</h2>
              <h3 className="relative flex items-center text-amarilloLogo text-xl font-bold">
                {newPedido.pedidoComunidad.reduce((total, pedido) => {
                  return total + 
                  (pedido.despensasCosto || 0) + 
                  (pedido.despensasMedioCosto || 0) + 
                  (pedido.despensasSinCosto || 0) + 
                  (pedido.despensasApadrinadas || 0);
                }, 0)}
              </h3>
              <h2 className="block text-md text-grisLogo dark:text-white">
                <strong className="text-amarilloLogo">
                  {newPedido.pedidoComunidad.reduce((total, pedido) => {
                    return pedido.arpilladas 
                    ? total + 
                    (pedido.despensasCosto || 0) + 
                    (pedido.despensasMedioCosto || 0) + 
                    (pedido.despensasSinCosto || 0) + 
                    (pedido.despensasApadrinadas || 0)
                    : total;
                  }, 0)}
                </strong> Arpilladas</h2>
            </div>
            <div className="flex justify-center py-4">
              <AcceptButton disabled={false} onClick={handleSubmit}/>
            </div>
          </>
        )}
      </main>
      <Footer />
      </div>
  );
};

export default NewOrder;