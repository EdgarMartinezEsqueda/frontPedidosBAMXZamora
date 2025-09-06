import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "context/AuthContext";
import toast from "react-hot-toast";
import api from "lib/axios";
import { hasPermission, RESOURCES } from "utils/permisos";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TableOrder from "components/tables/orders/TableOrder";
import GroupButtons from "components/buttons/ButtonsForOrderEdit";

const EditOrder = ( ) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  //Fetch para obtener los datos del pedido
  const { data: pedido, isLoading: isLoadingPedido, isError: isErrorPedido, error: errorPedido } = useQuery({
    queryKey: ["pedido"],
    queryFn: async () => {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    },
    retry: false, // Evitar reintentos automáticos
  });

  // Estado editable
  const [editableData, setEditableData] = useState({
    fechaEntrega: "",
    estado: "pendiente",
    devoluciones: 0,
    pedidoComunidad: [],
  });
  
  useEffect(() => {
    if (pedido) {
      setEditableData({
        fechaEntrega: pedido.fechaEntrega || "",
        estado: pedido.estado || "pendiente",
        devoluciones: pedido.devoluciones ?? 0, // Previene null
        horaLlegada: pedido.horaLlegada ?? "",
        idRuta: pedido.idRuta,
        pedidoComunidad: pedido.pedidoComunidad.map((comunidad) => ({
          ...comunidad,
          despensasCosto: comunidad.despensasCosto ?? 0,
          despensasMedioCosto: comunidad.despensasMedioCosto ?? 0,
          despensasSinCosto: comunidad.despensasSinCosto ?? 0,
          despensasApadrinadas: comunidad.despensasApadrinadas ?? 0,
          observaciones: comunidad.observaciones ?? ""
        })),
      });
    }
  }, [pedido]);  

  // Mutaciones
  const updateMutation = useMutation({
    mutationFn: (data) => {
      return api.patch(`/pedidos/${id}`, {
        fechaEntrega: data.fechaEntrega,
        pedidoComunidad: data.pedidoComunidad,
        devoluciones: data.devoluciones
      })
    },
    retry:0,
    onSuccess: (res) => {
      toast.success("Cambios guardados");
      navigate(`/pedido/${id}`);
    },
    onError: (error) => toast.error(error.response?.data?.error.message || "Error guardando el pedido") ,
  });

  const finalizeMutation = useMutation({
    mutationFn: ( data ) => api.patch(`/pedidos/${id}`, {
      fechaEntrega: data.fechaEntrega,
      pedidoComunidad: data.pedidoComunidad,
      devoluciones: data.devoluciones,
      horaLlegada: data.horaLlegada,
      estado: "finalizado"
    }),
    onSuccess: () => {
      toast.success("Pedido finalizado");
      setEditableData(prev => ({ ...prev, estado: "finalizado" }));
      navigate(`/pedido/${id}`);
    },
    onError: (error) => {toast.error(error.response?.data?.error.message || "Error finalizando pedido"); console.error(error);},
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/pedidos/${id}`),
    onSuccess: () => {
      toast.success("Pedido eliminado");
      navigate(`/`);
    },
  });

  // Verifica permisos del usuario
  useEffect(() => {
    if (pedido && user.data) {
      if(pedido.estado === "finalizado") navigate(`/pedido/${id}`); // Evita editar pedidos finalizados

      const isAdmin = user.data.rol === "Direccion";
      const isOwner = pedido.idTs === user.data.id;
      
      if (!isAdmin && !isOwner) navigate("/404", { replace: true });
    }
  }, [pedido, user.data, navigate]);

  // Handlers
  const handleSave = () => updateMutation.mutate(editableData);

  const handleFinalize = () => {
    if (editableData.devoluciones < 0) {
      toast.error("Las despensas regresadas no pueden ser negativas");
      return;
    }
    if (!editableData.horaLlegada) {
      toast.error("Debe ingresar la hora de llegada");
      return;
    }

    const totalOriginal = pedido.pedidoComunidad.reduce((total, com) => (
      total + 
      (com.despensasCosto || 0) + 
      (com.despensasMedioCosto || 0) + 
      (com.despensasSinCosto || 0) + 
      (com.despensasApadrinadas || 0)
    ), 0);

    const totalActual = editableData.pedidoComunidad.reduce((total, com) => (
      total + 
      (com.despensasCosto || 0) + 
      (com.despensasMedioCosto || 0) + 
      (com.despensasSinCosto || 0) + 
      (com.despensasApadrinadas || 0)
    ), 0);

    const totalEntregado = totalActual + editableData.devoluciones;

    if (totalEntregado !== totalOriginal) {
      toast.error(`Las despensas no coinciden. Original: ${totalOriginal}, Entregadas: ${totalActual}, Devueltas: ${editableData.devoluciones}`);
      return;
    }

    finalizeMutation.mutate(editableData);
  };

  const handleDelete = () => {
    if (window.confirm("¿Borrar pedido permanentemente?")) {
      deleteMutation.mutate();
    }
  };

  const isProcessing = updateMutation.isPending || finalizeMutation.isPending || deleteMutation.isPending;
  const disabled = isLoadingPedido || isProcessing;

  
  if (isLoadingPedido) return <div>Cargando...</div>;
  if (isErrorPedido) return <div>Error: {errorPedido.message}</div>;
  
  return (
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <h2 className="font-bold text-2xl w-full text-center pt-4 text-verdeLogo"> Editar pedido #{ id }</h2>
        
        {/* Campos principales */}
        <div className="max-w-md mx-auto my-2 space-y-4 p-4">

          <div className="flex flex-col gap-2">
            <label>Fecha de entrega</label>
            <input
              type="date"
              value={editableData.fechaEntrega}
              onChange={(e) => setEditableData({ ...editableData, fechaEntrega: e.target.value })}
              className="p-2 border rounded"
              disabled={disabled}
            />
          </div>
        </div>

        <TableOrder
          mode="edit"
          data={editableData}
          onDataChange={(newComunidades) =>
            setEditableData({ ...newComunidades })
          }
        />
        <div className="flex justify-center items-center flex-col max-w-md m-auto">
          <h2 htmlFor="devueltas" className="block font-bold text-2xl text-rojoLogo">Total despensas</h2>
          <h3 className="relative flex items-center text-amarilloLogo text-xl font-bold">
            {editableData.pedidoComunidad.reduce((total, pedido) => {
              return total + 
              (pedido.despensasCosto || 0) + 
              (pedido.despensasMedioCosto || 0) + 
              (pedido.despensasSinCosto || 0) + 
              (pedido.despensasApadrinadas || 0);
            }, 0)}
          </h3>
          <h2 htmlFor="devueltas" className="block text-md text-grisLogo dark:text-white">
            <strong className="text-amarilloLogo">
              {editableData.pedidoComunidad.reduce((total, pedido) => {
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
        {/* Despensas regresadas, hora de llegada y estado */}
        <div className="max-w-md mx-auto my-2 space-y-4 ">

          <div className="flex flex-col gap-2">
            <label className="text-verdeLogo font-bold">Hora de llegada</label>
            <input
              type="time"
              value={editableData.horaLlegada || ""}
              onChange={(e) => setEditableData({ ...editableData, horaLlegada: e.target.value })}
              className="p-2 border rounded"
              disabled={disabled || editableData.estado === "finalizado"}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-rojoLogo font-bold">Despensas regresadas</label>
            <input
              type="number"
              min="0"
              value={editableData.devoluciones}
              onChange={(e) => setEditableData({ ...editableData, devoluciones: Math.max(0, e.target.valueAsNumber) })}
              className="p-2 border rounded"
              disabled={disabled || editableData.estado === "finalizado"}
            />
          </div>
        
          {hasPermission(user.data, RESOURCES.PEDIDOS, "update", pedido.idTs) &&
            <div className="flex items-center justify-center w-full">
              <GroupButtons
                disabled={disabled}
                onSave={handleSave}
                onFinalize={editableData.estado !== "finalizado" ? handleFinalize : null}
                onDelete={handleDelete}
                />
            </div>
          }
        </div>
      </main>
      <Footer />
      </div>
  );
};

export default EditOrder;