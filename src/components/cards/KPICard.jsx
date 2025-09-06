
const KPICard = ({ title, value, delta }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold">{value}</span>
      {delta && <span className={`text-sm ${delta > 0 ? "text-green-500" : "text-red-500"}`}>{delta}%</span>}
    </div>
  </div>
);

export default KPICard;