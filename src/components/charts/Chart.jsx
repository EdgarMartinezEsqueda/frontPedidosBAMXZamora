import { useState } from "react";
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector, LineChart, Line, Cell } from "recharts";

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

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-semibold">
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
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} className="text-gray-700 text-sm">
        {value} despensas
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} className="text-gray-500 text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const ChartComponent = ({ type, title, data, bars, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const COLORS = ["#0DB14C", "#FDB913", "#ED1A3B", "#3B82F6", "#58595B", "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#FACC15", "#4ADE80"];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Determinar si necesitamos rotar las etiquetas del eje X
  const needsRotation = (data) => {
    if (!data || data.length === 0) return false;
    return data.some(item => 
      (item.ruta && item.ruta.length > 10) || 
      (item.nombre && item.nombre.length > 10)
    );
  };

  // Determinar la clave a usar para el eje X
  const getXAxisKey = (data) => {
    if (!data || data.length === 0) return "nombre";
    if (data[0].ruta !== undefined) return "ruta";
    if (data[0].nombre !== undefined) return "nombre";
    if (data[0].mes !== undefined) return "mes";
    return Object.keys(data[0])[0];
  };

  // Renderizar el gráfico adecuado
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-80">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        {type === "comparative" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={getXAxisKey(data)} 
              tick={{ fontSize: 12 }}
              angle={needsRotation(data) ? -45 : 0}
              textAnchor={needsRotation(data) ? "end" : "middle"}
              height={needsRotation(data) ? 60 : 40}
            />
            <YAxis />
            <Tooltip />
            <Legend />
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="ruta" 
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="costo" fill="#0DB14C" stackId="a" />
            <Bar dataKey="medioCosto" fill="#F59E0B" stackId="a" />
            <Bar dataKey="sinCosto" fill="#ED1A3B" stackId="a" />
            <Bar dataKey="apadrinadas" fill="#3B82F6" stackId="a" />
          </BarChart>
        ) : type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
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
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              formatter={(value, name, props) => [
                `${value} despensas`,
                <span className="text-gray-600" key={name}>{name}</span>
              ]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value, entry) => (
                <span className="text-gray-600 text-sm">{value}</span>
              )}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
export default ChartComponent;