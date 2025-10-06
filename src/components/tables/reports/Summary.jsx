const TableComponent = ({ columns, data, sortConfig, onSort, className }) => (
  <div className={`overflow-x-auto rounded-lg border ${className}`}>
    <table className="min-w-full">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {columns.map((col) => (
            <th 
              key={col.key} 
              className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-200 cursor-pointer hover:bg-gray-100/5"
              onClick={() => onSort?.(col.key)}
            >
              <div className="flex items-center gap-1">
                {col.title}
                {sortConfig?.key === col.key && (
                  <span className="text-xs">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200/5">
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 text-sm dark:bg-gray-700">
                {col.render ? col.render(row[col.key]) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableComponent;