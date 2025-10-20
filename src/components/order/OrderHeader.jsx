import ExportSingleOrderButton from "components/buttons/ExportSingleOrderButton";

const OrderHeader = ({ pedidoData, id }) => {
  const formatearFecha = (fechaString) => {
    return new Date(...fechaString.split("-").map((v, i) => i === 1 ? v - 1 : v))
      .toLocaleDateString("es-MX");
  };

  return (
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
  );
};

export default OrderHeader;