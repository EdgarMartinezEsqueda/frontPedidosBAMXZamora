const OrderSummary = ({ pedidoData }) => {
  const calcularTotalDespensas = () => {
  const campos = pedidoData.esRutaVoluntariado
    ? ["despensasVoluntariado"]
    : ["despensasCosto", "despensasMedioCosto", "despensasSinCosto", "despensasApadrinadas"];

    return pedidoData.pedidoComunidad.reduce((total, pedido) => {
      return total + campos.reduce((sum, campo) => sum + (pedido[campo] || 0), 0);
    }, 0);
  };

  return (
    <div className="flex justify-center items-center flex-col max-w-md m-auto">
      <h2 className="block font-bold text-2xl text-rojoLogo">Total despensas</h2>
      <h3 className="relative flex items-center text-amarilloLogo text-xl font-bold">
        {calcularTotalDespensas()}
      </h3>
    </div>
  );
};

export default OrderSummary;