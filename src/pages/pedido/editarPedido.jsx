import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "context/AuthContext";
import api from "lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { hasPermission, RESOURCES } from "utils/permisos";

import GroupButtons from "components/buttons/ButtonsForOrderEdit";
import Footer from "components/footer/Footer";
import EfectivoModal from "components/modals/EfectivoModal";
import Navbar from "components/navbar/Navbar";
import TableOrder from "components/tables/orders/TableOrder";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEfectivoModal, setShowEfectivoModal] = useState(false);

  //Fetch para obtener los datos del pedido
  const { data: pedido, isLoading: isLoadingPedido, isError: isErrorPedido, error: errorPedido } = useQuery({
    queryKey: ["pedido"],
    queryFn: async () => {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    },
    retry: false,
  });

  // Estado editable
  const [editableData, setEditableData] = useState({
    fechaEntrega: "",
    estado: "pendiente",
    devolucionesCosto: 0,
    devolucionesMedioCosto: 0,
    devolucionesSinCosto: 0,
    devolucionesApadrinadas: 0,
    devoluciones: 0,
    pedidoComunidad: [],
  });

  useEffect(() => {
    if (pedido) {
      const tieneDesglose = 
        (pedido.devolucionesCosto || 0) > 0 ||
        (pedido.devolucionesMedioCosto || 0) > 0 ||
        (pedido.devolucionesSinCosto || 0) > 0 ||
        (pedido.devolucionesApadrinadas || 0) > 0;

      setEditableData({
        fechaEntrega: pedido.fechaEntrega || "",
        estado: pedido.estado || "pendiente",
        devolucionesCosto: pedido.devolucionesCosto || 0,
        devolucionesMedioCosto: pedido.devolucionesMedioCosto || 0,
        devolucionesSinCosto: pedido.devolucionesSinCosto || 0,
        devolucionesApadrinadas: pedido.devolucionesApadrinadas || 0,
        devoluciones: tieneDesglose ? 0 : (pedido.devoluciones ?? 0),
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
      })
    },
    retry: 0,
    onSuccess: (res) => {
      toast.success("Cambios guardados");
      navigate(`/pedido/${id}`);
    },
    onError: (error) => toast.error(error.response?.data?.error.message || "Error guardando el pedido"),
  });

  const finalizeMutation = useMutation({
    mutationFn: (data) => api.patch(`/pedidos/${id}`, {
      fechaEntrega: data.fechaEntrega,
      pedidoComunidad: data.pedidoComunidad,
      devoluciones: data.devoluciones,
      devolucionesCosto: data.devolucionesCosto,
      devolucionesMedioCosto: data.devolucionesMedioCosto,
      devolucionesSinCosto: data.devolucionesSinCosto,
      devolucionesApadrinadas: data.devolucionesApadrinadas,
      horaLlegada: data.horaLlegada,
      estado: "finalizado",
      // Nueva estructura con efectivo y transferencias
      efectivo: data.efectivo,
      transferencias: data.transferencias,
      totales: data.totales
    }),
    onSuccess: () => {
      toast.success("Pedido finalizado exitosamente");
      setEditableData(prev => ({ ...prev, estado: "finalizado" }));
      navigate(`/pedido/${id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error finalizando pedido");
      console.error(error);
    },
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
      if (pedido.estado === "finalizado") navigate(`/pedido/${id}`);

      const isAdmin = user.data.rol === "Direccion";
      const isOwner = pedido.idTs === user.data.id;
      
      if (!isAdmin && !isOwner) navigate("/404", { replace: true });
    }
  }, [pedido, user.data, navigate, id]);

  // Handlers
  const handleSave = () => updateMutation.mutate(editableData);

  const handleFinalize = () => {
    editableData.devoluciones = 
      editableData.devolucionesCosto + 
      editableData.devolucionesMedioCosto + 
      editableData.devolucionesSinCosto + 
      editableData.devolucionesApadrinadas;

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

    // Abrir modal de efectivo y transferencias
    setShowEfectivoModal(true);
  };

  // Nuevo handler para finalizar CON efectivo y transferencias
  const handleFinalizeWithEfectivo = (data) => {
    // data contiene: { efectivo, transferencias, totales }
    finalizeMutation.mutate({
      ...editableData,
      efectivo: data.efectivo,
      transferencias: data.transferencias,
      totales: data.totales
    });
    setShowEfectivoModal(false);
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
        <h2 className="font-bold text-2xl w-full text-center pt-4 text-verdeLogo">
          Editar pedido #{id}
        </h2>
        
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
          <h2 className="block font-bold text-2xl text-rojoLogo">Total despensas</h2>
          <h3 className="relative flex items-center text-amarilloLogo text-xl font-bold">
            {editableData.pedidoComunidad.reduce((total, pedido) => {
              return total + 
                (pedido.despensasCosto || 0) + 
                (pedido.despensasMedioCosto || 0) + 
                (pedido.despensasSinCosto || 0) + 
                (pedido.despensasApadrinadas || 0);
            }, 0)}
          </h3>
          <h2 className="block text-md text-grisLogo dark:text-white">
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
            </strong> Arpilladas
          </h2>
        </div>

        {/* Despensas regresadas, hora de llegada y estado */}
        <div className="max-w-md mx-auto my-2 space-y-4">
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

          {/* Solo aparecerá el apartado de despensas si se pone la hora de llegada, para confirmar que se va a finalizar el pedido */}
          {editableData.horaLlegada && (
            <div className="flex flex-col gap-2">
              <label className="text-rojoLogo font-bold">Despensas regresadas</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    Con costo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editableData.devolucionesCosto}
                    onChange={(e) => setEditableData({ 
                      ...editableData, 
                      devolucionesCosto: Math.max(0, e.target.valueAsNumber || 0) 
                    })}
                    className="p-2 border rounded text-sm"
                    disabled={disabled || editableData.estado === "finalizado"}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-green-600 dark:text-green-400 font-semibold text-sm">
                    Medio costo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editableData.devolucionesMedioCosto}
                    onChange={(e) => setEditableData({ 
                      ...editableData, 
                      devolucionesMedioCosto: Math.max(0, e.target.valueAsNumber || 0) 
                    })}
                    className="p-2 border rounded text-sm"
                    disabled={disabled || editableData.estado === "finalizado"}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">
                    Sin costo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editableData.devolucionesSinCosto}
                    onChange={(e) => setEditableData({ 
                      ...editableData, 
                      devolucionesSinCosto: Math.max(0, e.target.valueAsNumber || 0) 
                    })}
                    className="p-2 border rounded text-sm"
                    disabled={disabled || editableData.estado === "finalizado"}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                    Apadrinadas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editableData.devolucionesApadrinadas}
                    onChange={(e) => setEditableData({ 
                      ...editableData, 
                      devolucionesApadrinadas: Math.max(0, e.target.valueAsNumber || 0) 
                    })}
                    className="p-2 border rounded text-sm"
                    disabled={disabled || editableData.estado === "finalizado"}
                  />
                </div>
              </div>

              {/* Total de devoluciones */}
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total devoluciones:</span>
                <span className="ml-2 text-xl font-bold text-red-600 dark:text-red-400">
                  {editableData.devolucionesCosto + 
                  editableData.devolucionesMedioCosto + 
                  editableData.devolucionesSinCosto + 
                  editableData.devolucionesApadrinadas}
                </span>
              </div>
            </div>
          )}
        
          {hasPermission(user.data, RESOURCES.PEDIDOS, "update", pedido.idTs) && (
            <div className="flex items-center justify-center w-full">
              <GroupButtons
                disabled={disabled}
                onSave={handleSave}
                onFinalize={editableData.estado !== "finalizado" ? handleFinalize : null}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Modal de Efectivo y Transferencias */}
          <EfectivoModal
            show={showEfectivoModal}
            onClose={() => setShowEfectivoModal(false)}
            onConfirm={handleFinalizeWithEfectivo}
            isLoading={finalizeMutation.isPending}
            expectedTotal={editableData.pedidoComunidad.reduce((total, com) => {
              const costo = Number(com.comunidad.costoPaquete || 0);
              return total + 
                (com.despensasCosto || 0) * costo +
                (com.despensasMedioCosto || 0) * (costo / 2); // solo contamos costo y medio costo
            }, 0)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditOrder;