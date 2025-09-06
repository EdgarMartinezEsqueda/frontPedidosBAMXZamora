const RecentActivityCard = ({ pedidos, username }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium text-gray-700 mb-3">TS-{username}</h4>
      <div className="space-y-2">
        {pedidos.map((pedido, index) => (
          <div key={index} className="border-l-4 pl-3 py-1" style={{
            borderColor: pedido.estado === 'pendiente' ? '#F59E0B' : '#10B981'
          }}>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{new Date(pedido.fecha).toLocaleDateString()}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                pedido.estado === 'pendiente' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {pedido.estado}
              </span>
            </div>
            <p className="text-sm text-gray-900 mt-1">
              {pedido.despensas} despensas
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;