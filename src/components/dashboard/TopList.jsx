const TopList = ({ 
  title, 
  items, 
  nameKey = "nombre", 
  valueKey, 
  valueLabel = "", 
}) => {
  const getNestedValue = (obj, path) => {
    if (Array.isArray(obj)) return obj[path]; // Soporte para arrays
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => {
          const name = Array.isArray(item) 
            ? item[0] 
            : getNestedValue(item, nameKey);
            
          const value = Array.isArray(item)
            ? item[1]
            : valueKey ? getNestedValue(item, valueKey) : null;

          return (
            <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="text-gray-700 truncate">{name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-600">
                  {value}
                </span>
                {valueLabel && (
                  <span className="text-sm text-gray-500">{valueLabel}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopList;