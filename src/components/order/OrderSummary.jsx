const OrderSummary = ({ pedidoData }) => {
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

  return (
    <div className="flex justify-center items-center flex-col max-w-md m-auto">
      <h2 className="block font-bold text-2xl text-rojoLogo">Total despensas</h2>
      <h3 className="relative flex items-center text-amarilloLogo text-xl font-bold">
        {calcularTotalDespensas()}
      </h3>
      <h2 className="block text-md text-grisLogo dark:text-white">
        <strong className="text-amarilloLogo">{calcularDespensasArpilladas()}</strong> Arpilladas
      </h2>
    </div>
  );
};

export default OrderSummary;