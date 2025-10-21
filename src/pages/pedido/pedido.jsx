import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "context/AuthContext";
import api from "lib/axios";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { hasPermission, RESOURCES } from "utils/permisos";

import GroupButtons from "components/buttons/ButtonsForOrderPage";
import Footer from "components/footer/Footer";
import Navbar from "components/navbar/Navbar";
import CollectionSection from "components/order/CollectionSection";
import OrderFinalDetails from "components/order/OrderFinalDetails";
import OrderHeader from "components/order/OrderHeader";
import OrderSummary from "components/order/OrderSummary";
import Print from "components/print/Print";
import TableOrder from "components/tables/orders/TableOrder";
import { generateCobranzaPDF } from "utils/pdfGenerator";

const OrderPage = () => {
  const { id }
   = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const tableRef = useRef(null);

  const { data: pedidoData, isLoading, isError, error: errorPedido } = useQuery({
    queryKey: ["pedido", id],
    queryFn: async () => {
      const { data } = await api.get(`/pedidos/${id}`);
      console.log("Datos del pedido:", data);
      return data;
    },
    retry: false,
  });

  // Mutation para generar cobranza
  const generarCobranzaMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/cobranzas/generar/${id}`);
      return data;
    },
    onSuccess: (response) => {
      toast.success("Cobranza generada correctamente");
      queryClient.invalidateQueries(["pedido", id]);
    },
    onError: (error) => {
      const mensaje = error.response?.data?.message || "Error al generar cobranza";
      toast.error(mensaje);
    }
  });

  // Mutation para regenerar cobranza
  const regenerarCobranzaMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/cobranzas/generar/${id}`, { regenerar: true });
      return data;
    },
    onSuccess: (response) => {
      toast.success("Cobranza generada correctamente");
      queryClient.invalidateQueries(["pedido", id]);
    },
    onError: (error) => {
      const mensaje = error.response?.data?.message || "Error al regenerar cobranza";
      toast.error(mensaje);
    }
  });

  // Mutation para obtener datos completos de la cobranza
  const descargarCobranzaMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get(`/cobranzas/${id}`);
      return data;
    },
    onSuccess: async (response) => {
      // Generar PDF con los datos obtenidos
      const { cobranza, efectivo, transferencias } = response;
      
      try {
        const pdfDoc = await generateCobranzaPDF(
          pedidoData, 
          cobranza, 
          efectivo, 
          transferencias
        );
        
        const buffer = await new Promise(resolve => {
          pdfDoc.getBuffer(resolve);
        });
        
        const pdfBlob = new Blob([buffer], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `cobranza_${cobranza.folio}_${pedidoData.ruta.nombre}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(pdfUrl);
        }, 100);
        
        toast.success("Cobranza descargada");
      } catch (error) {
        toast.error("Error generando PDF");
        console.error(error);
      }
    },
    onError: (error) => {
      toast.error("Error obteniendo datos de cobranza");
    }
  });

  const handleGenerarCobranza = () => {
    if (window.confirm("¿Generar cobranza para este pedido?")) {
      generarCobranzaMutation.mutate();
    }
  };

  const handleRegenerarCobranza = () => {
    if (window.confirm(
      "¿Regenerar la cobranza? Esto actualizará los totales pero mantendrá el mismo folio."
    )) {
      regenerarCobranzaMutation.mutate();
    }
  };

  const handleDescargarCobranza = () => {
    descargarCobranzaMutation.mutate();
  }

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error: {errorPedido.message}</div>;

  const puedeActualizarPedido = hasPermission(user.data, RESOURCES.PEDIDOS, "update", pedidoData.idTs);
  const pedidoFinalizado = pedidoData.estado === "finalizado";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <OrderHeader pedidoData={pedidoData} id={id} />
        
        <div ref={tableRef}>
          <TableOrder mode="view" data={pedidoData} />
        </div>

        <Print contentRef={tableRef} />

        <OrderSummary pedidoData={pedidoData} />

        {puedeActualizarPedido && !pedidoFinalizado && (
          <div className="flex justify-center">
            <GroupButtons disabled={pedidoFinalizado} id={id} />
          </div>
        )}

        {pedidoFinalizado && <OrderFinalDetails pedidoData={pedidoData} user={user} id={id} />}

        {pedidoFinalizado && (
          <CollectionSection
            pedidoData={pedidoData}
            user={user}
            onGenerar={handleGenerarCobranza}
            onRegenerar={handleRegenerarCobranza}
            onDescargar={handleDescargarCobranza}
            isGenerating={generarCobranzaMutation.isPending}
            isRegenerating={regenerarCobranzaMutation.isPending}
            isDownloading={descargarCobranzaMutation.isPending}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;