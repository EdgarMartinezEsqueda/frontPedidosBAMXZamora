import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "context/AuthContext";
import api from "lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { hasPermission, RESOURCES } from "utils/permisos";

import BotonCobranza from "components/buttons/ButtonsCobranza";
import GroupButtons from "components/buttons/ButtonsForOrderPage";
import ExportSingleOrderButton from "components/buttons/ExportSingleOrderButton";
import ReturnToEditButton from "components/buttons/ReturnToEditButton";
import Footer from "components/footer/Footer";
import FormularioCobranza from "components/forms/CobranzaForm";
import Navbar from "components/navbar/Navbar";
import TableOrder from "components/tables/orders/TableOrder";
import { generateCobranzaPDF } from "utils/pdfGenerator";

// Configuración para billetes y monedas
const DENOMINATIONS_CONFIG = [
  { key: "billetes1000", value: 1000, label: "Billetes $1,000", bgColor: "bg-purple-50 dark:bg-purple-900/30" },
  { key: "billetes500", value: 500, label: "Billetes $500", bgColor: "bg-blue-50 dark:bg-blue-900/30" },
  { key: "billetes200", value: 200, label: "Billetes $200", bgColor: "bg-green-50 dark:bg-green-900/30" },
  { key: "billetes100", value: 100, label: "Billetes $100", bgColor: "bg-red-50 dark:bg-red-900/30" },
  { key: "billetes50", value: 50, label: "Billetes $50", bgColor: "bg-pink-50 dark:bg-pink-900/30" },
  { key: "billetes20", value: 20, label: "Billetes $20", bgColor: "bg-yellow-50 dark:bg-yellow-900/30" },
  { key: "monedas20", value: 20, label: "Monedas $20", bgColor: "bg-gray-50 dark:bg-gray-700/50" },
  { key: "monedas10", value: 10, label: "Monedas $10", bgColor: "bg-yellow-100 dark:bg-yellow-900/40" },
  { key: "monedas5", value: 5, label: "Monedas $5", bgColor: "bg-orange-50 dark:bg-orange-900/30" },
  { key: "monedas2", value: 2, label: "Monedas $2", bgColor: "bg-gray-100 dark:bg-gray-700/60" },
  { key: "monedas1", value: 1, label: "Monedas $1", bgColor: "bg-yellow-200 dark:bg-yellow-900/50" },
  { key: "monedas50C", value: 0.5, label: "Monedas $0.50", bgColor: "bg-gray-100 dark:bg-gray-700/60" },
];

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [mostrarFormularioCobranza, setMostrarFormularioCobranza] = useState(false);
  const [mostrarDetalleEfectivo, setMostrarDetalleEfectivo] = useState(false);
  const [datosCobranza, setDatosCobranza] = useState({
      arpillasCantidad: 0,
      arpillasImporte: 0,
      excedentes: "",
      excedentesImporte: 0
  });

  const { data: pedidoData, isLoading, isError, error: errorPedido } = useQuery({
    queryKey: ["pedido", id],
    queryFn: async () => {
      const { data } = await api.get(`/pedidos/${id}`);
      return data;
    },
    retry: false,
  });

  const generarCobranzaMutation = useMutation({
    mutationFn: async (datosAdicionales) => {
      const pdfDoc = await generateCobranzaPDF(pedidoData, datosAdicionales.datosCobranza, datosAdicionales.datosEfectivo );
      const buffer = await new Promise(resolve => {
        pdfDoc.getBuffer(resolve);
      });
      return new Blob([buffer], { type: "application/pdf" });
    },
    onSuccess: (pdfBlob) => {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `cobranza_pedido#${id}_${pedidoData.ruta.nombre}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      }, 100);

      toast.success("Cobranza generada correctamente");
      setMostrarFormularioCobranza(false);
      setDatosCobranza({
        arpillasCantidad: 0,
        arpillasImporte: 0,
        excedentes: "",
        excedentesImporte: 0
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Error al generar cobranza");
    }
  });
  
  const handleCambioDatos = (campo, valor) => {
    if(campo === "excedentes") {
      setDatosCobranza(prev => ({
        ...prev,
        [campo]: valor
      }));
    } else {
      const numValue = valor === "" ? 0 : Number(valor);
      setDatosCobranza(prev => ({
        ...prev,
        [campo]: numValue
      }));
    }
  };
  
  const handleGenerarCobranza = () => {
    const datosEfectivo = pedidoData.efectivo?.[0];
    const { arpillasCantidad, arpillasImporte, excedentes, excedentesImporte } = datosCobranza;
    if (arpillasCantidad < 0 || arpillasImporte < 0 || excedentes < 0 || excedentesImporte < 0) {
      return toast.error("Los valores no pueden ser negativos");
    }
    generarCobranzaMutation.mutate( { datosCobranza, datosEfectivo } );
  };

  // Función para calcular totales de despensas
  const calcularTotalDespensas = () => {
    return pedidoData.pedidoComunidad.reduce((total, pedido) => {
      return total + 
      (pedido.despensasCosto || 0) + 
      (pedido.despensasMedioCosto || 0) + 
      (pedido.despensasSinCosto || 0) + 
      (pedido.despensasApadrinadas || 0);
    }, 0);
  };

  const calcularDespensasArpilladas = () => {
    return pedidoData.pedidoComunidad.reduce((total, pedido) => {
      return pedido.arpilladas 
        ? total + 
          (pedido.despensasCosto || 0) + 
          (pedido.despensasMedioCosto || 0) + 
          (pedido.despensasSinCosto || 0) + 
          (pedido.despensasApadrinadas || 0)
        : total;
    }, 0);
  };

  // Función para formatear fecha
  const formatearFecha = (fechaString) => {
    return new Date(...fechaString.split("-").map((v, i) => i === 1 ? v - 1 : v))
      .toLocaleDateString("es-MX");
  };

  // Función para formatear hora
  const formatearHora = (horaString) => {
    return horaString 
      ? new Date(`2000-01-01T${horaString}`)
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;
  };

  // Componente para mostrar denominaciones
  const DenominationItem = ({ denomination, cantidad }) => {
    if (cantidad <= 0) return null;
    
    return (
      <div className={`flex justify-between p-2 ${denomination.bgColor} rounded text-gray-800 dark:text-gray-200`}>
        <span>{denomination.label}:</span>
        <span className="font-medium">
          {cantidad} × ${denomination.value.toLocaleString()}
        </span>
      </div>
    );
  };

  // Componente para detalles finales
  const DetallesFinales = () => {
    const efectivo = pedidoData.efectivo?.[0];
    const totalEfectivo = efectivo ? Number(efectivo.totalEfectivo) : 0;
    const diferencia = totalEfectivo - pedidoData.total;
    const tieneDiferencia = Math.abs(diferencia) > 1;
    const usuarioEfectivo =  efectivo.usuario.username;

    return (
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm mt-4">
        <h3 className="text-center text-xl font-bold text-verdeLogo dark:text-green-400 mb-4">
          Detalles finales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 justify-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">Despensas retornadas:</span>
            <span className="text-rojoLogo dark:text-red-400 font-bold text-lg">
              {pedidoData.devoluciones ?? 0}
            </span>
          </div>
          
          <div className="flex items-center gap-2 justify-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">Hora de llegada:</span>
            <span className="text-amarilloLogo dark:text-yellow-400 font-bold text-lg">
              {formatearHora(pedidoData.horaLlegada) || 
                <span className="text-gray-400 dark:text-gray-500">N/A</span>}
            </span>
          </div>

          {hasPermission(user.data, RESOURCES.COBRANZAS, "read", pedidoData.idTs) && (
            <>
              <div className="flex items-center gap-2 justify-center">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Efectivo recaudado:</span>
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                  {efectivo 
                    ? `$${totalEfectivo.toLocaleString()}`
                    : <span className="text-gray-400 dark:text-gray-500">Sin registro</span>}
                </span>
              </div>

              <div className="flex items-center gap-2 justify-center">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Total esperado:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  ${pedidoData.total?.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Diferencia */}
        {hasPermission(user.data, RESOURCES.COBRANZAS, "read", pedidoData.idTs) && 
        efectivo && tieneDiferencia && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold text-yellow-800 dark:text-yellow-300">Diferencia:</span>
              <span className={`font-bold ${
                diferencia > 0 
                  ? "text-orange-600 dark:text-orange-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {diferencia > 0 ? "+" : ""}${diferencia.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Botón desglose */}
        {hasPermission(user.data, RESOURCES.COBRANZAS, "read", pedidoData.idTs) && efectivo && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setMostrarDetalleEfectivo(!mostrarDetalleEfectivo)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
            >
              {mostrarDetalleEfectivo ? "Ocultar" : "Ver"} desglose de efectivo
            </button>
          </div>
        )}

        {/* Desglose detallado */}
        {hasPermission(user.data, RESOURCES.COBRANZAS, "read", pedidoData.idTs) && 
        mostrarDetalleEfectivo && efectivo && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Desglose del efectivo, reportado por el usuario{" "}
              <strong className="text-cyan-950 dark:text-cyan-400">{usuarioEfectivo}</strong>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {DENOMINATIONS_CONFIG.map(denomination => (
                <DenominationItem 
                  key={denomination.key}
                  denomination={denomination}
                  cantidad={efectivo[denomination.key]}
                />
              ))}
            </div>

            {efectivo.observaciones && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Observaciones:</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{efectivo.observaciones}</p>
              </div>
            )}
          </div>
        )}

        {hasPermission(user.data, RESOURCES.PEDIDOS, "revert", pedidoData.idTs) && (
          <ReturnToEditButton id={id} />
        )}
      </div>
    );
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error: {errorPedido.message}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 mx-auto mt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-center md:text-left">
              <h2 className="font-bold text-2xl text-verdeLogo">Pedido #{id}</h2>
              <h2 className="text-md text-rojoLogo">{pedidoData.ruta?.nombre ?? "N/A"}</h2>
              <h3 className="text-sm">
                Fecha de entrega estimada:{" "}
                <strong className="text-amarilloLogo">
                  {formatearFecha(pedidoData.fechaEntrega)}
                </strong>
              </h3>
              <h3 className="text-sm">
                Hecho por: <strong className="text-grisLogo">{pedidoData.usuario.username}</strong>
              </h3>
            </div>
            <div className="self-center md:self-start">
              <ExportSingleOrderButton pedido={pedidoData} />
            </div>
          </div>
        </div>

        <TableOrder mode="view" data={pedidoData} />

        <div className="flex justify-center items-center flex-col max-w-md m-auto">
          <h2 className="block font-bold text-2xl text-rojoLogo">Total despensas</h2>
          <h3 className="relative flex items-center text-amarilloLogo text-xl font-bold">
            {calcularTotalDespensas()}
          </h3>
          <h2 className="block text-md text-grisLogo dark:text-white">
            <strong className="text-amarilloLogo">{calcularDespensasArpilladas()}</strong> Arpilladas
          </h2>
        </div>

        {hasPermission(user.data, RESOURCES.PEDIDOS, "update", pedidoData.idTs) && 
         pedidoData.estado !== "finalizado" && (
          <div className="flex justify-center">
            <GroupButtons disabled={pedidoData.estado === "finalizado"} id={id}/>
          </div>
        )}

        {pedidoData.estado === "finalizado" && <DetallesFinales />}

        {hasPermission(user.data, RESOURCES.COBRANZAS, "update", pedidoData.idTs) && 
         pedidoData.estado === "finalizado" && (
          <>
            <BotonCobranza
              generada={pedidoData.cobranzaGenerada}
              url={pedidoData.urlCobranza}
              onGenerar={() => setMostrarFormularioCobranza(true)}
            />
            
            {mostrarFormularioCobranza && (
              <FormularioCobranza
                datos={datosCobranza}
                onChange={handleCambioDatos}
                onSubmit={handleGenerarCobranza}
                onCancel={() => setMostrarFormularioCobranza(false)}
              />
            )}
          </>
        )}        
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;