const ReportFilter = ({ currentFilter, onChange }) => {
  const { view, year, month } = currentFilter;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleViewChange = (e) => {
    const newView = e.target.value;
    onChange({
      view: newView,
      year,
      month,
    });
  };

  const handleMonthChange = (e) => {
    onChange({
      view,
      year,
      month: Number(e.target.value)
    });
  };

  const handleYearChange = (e) => {
    onChange({
      view,
      month,
      year: Number(e.target.value)
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col md:flex-row md:items-end md:gap-4 w-full">
        <div className="flex flex-col w-full md:w-40">
          <label className="text-xs font-medium text-gray-600 mb-1">Vista</label>
          <select
            value={view}
            onChange={handleViewChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="anual">Anual</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>

        {(view === "mensual" || view === "mes-anio") && (
          <div className="flex flex-col w-full md:w-40">
            <label className="text-xs font-medium text-gray-600 mb-1">Mes</label>
            <select
              value={month}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("es", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col w-full md:w-40">
          <label className="text-xs font-medium text-gray-600 mb-1">Año</label>
          <select
            value={year}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;