import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  // Detectar modo oscuro para el color del texto
  const isDark = document.documentElement.classList.contains("dark");
  const labelColor = isDark ? "#e5e7eb" : "#374151";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={labelColor} className="font-semibold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={labelColor}>
        {value} despensas
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={isDark ? "#9ca3af" : "#6b7280"}>
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const ChartComponent = ({ type, title, data, bars, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const COLORS = ["#0DB14C", "#FDB913", "#ED1A3B", "#3B82F6", "#58595B", "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FACC15", "#4ADE80"];

  // Observar cambios en el modo oscuro
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Observar cambios en la clase del documento
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const needsRotation = (data) => {
    if (!data || data.length === 0) return false;
    return data.some(item => 
      (item.ruta && item.ruta.length > 10) || 
      (item.nombre && item.nombre.length > 10)
    );
  };

  const getXAxisKey = (data) => {
    if (!data || data.length === 0) return "nombre";
    if (data[0].ruta !== undefined) return "ruta";
    if (data[0].nombre !== undefined) return "nombre";
    if (data[0].mes !== undefined) return "mes";
    return Object.keys(data[0])[0];
  };

  const textColor = isDarkMode ? "#e5e7eb" : "#374151";
  const gridColor = isDarkMode ? "#4b5563" : "#e5e7eb";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-900/50 h-80">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        {type === "comparative" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey={getXAxisKey(data)} 
              tick={{ fontSize: 12, fill: textColor }}
              angle={needsRotation(data) ? -45 : 0}
              textAnchor={needsRotation(data) ? "end" : "middle"}
              height={needsRotation(data) ? 60 : 40}
              stroke={gridColor}
            />
            <YAxis tick={{ fill: textColor }} stroke={gridColor} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? "#374151" : "#fff",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: textColor
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend 
              wrapperStyle={{ color: textColor }}
              iconType="circle"
            />
            {bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        ) : type === "tipos-despensas" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="ruta" 
              tick={{ fontSize: 12, fill: textColor }}
              stroke={gridColor}
            />
            <YAxis tick={{ fill: textColor }} stroke={gridColor} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? "#374151" : "#fff",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: textColor
              }}
              labelStyle={{ color: textColor }}
            />
            <Bar 
              dataKey="valor" 
              name={name} 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        ) : type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="mes" tick={{ fill: textColor }} stroke={gridColor} />
            <YAxis tick={{ fill: textColor }} stroke={gridColor} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? "#374151" : "#fff",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: textColor
              }}
              labelStyle={{ color: textColor }}
            />
            <Bar dataKey="costo" fill="#0DB14C" stackId="a" />
            <Bar dataKey="medioCosto" fill="#F59E0B" stackId="a" />
            <Bar dataKey="sinCosto" fill="#ED1A3B" stackId="a" />
            <Bar dataKey="apadrinadas" fill="#3B82F6" stackId="a" />
          </BarChart>
        ) : type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="mes" tick={{ fill: textColor }} stroke={gridColor} />
            <YAxis tick={{ fill: textColor }} stroke={gridColor} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? "#374151" : "#fff",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: textColor
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend 
              wrapperStyle={{ color: textColor }}
            />
            {bars.map((bar, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={bar.dataKey}
                name={bar.name}
                stroke={bar.color}
                strokeWidth={2}
                dot={{ fill: bar.color, r: 4 }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        ) : (
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? "#374151" : "#fff",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}`,
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: textColor
              }}
              formatter={(value, name) => [
                `${value} despensas`,
                name
              ]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "20px", color: textColor }}
              formatter={(value) => (
                <span style={{ color: textColor }}>{value}</span>
              )}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;