import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import Sidebar from "components/sidebar/Sidebar";
import ChartComponent from "components/charts/Chart";
import Pagination from "components/pagination/Pagination";
import SearchInput from "components/search/Search";
import KPICard from "components/cards/KPICard";
import TableComponent from "components/tables/reports/Summary";
import ReportFilter from "components/filter/FilterReport";

const Report = () => {
  const [filter, setFilter] = useState({
      view: "anual",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 // Mes actual (1-12)
  });
  const [currentPage, setCurrentPage] = useState(1);  // Estado para paginación de comunidades
  const [searchTerm, setSearchTerm] = useState(""); // Estado para  la busqueda de comunidades
  const [showAllRoutes, setShowAllRoutes] = useState(false);  // Estado para mostrar todas las rutas
  const itemsPerPage = 10; // Número de elementos por página
  // Nuevos estados para tabla detallada
  const [currentDetailPage, setCurrentDetailPage] = useState(1);
  const [detailSearch, setDetailSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });

  const { data: reportesData, isLoading, error } = useQuery({
    queryKey: ["reportesDespensas", filter],
    queryFn: async () => {
      const { data } = await api.get("/reportes/despensas", {
        params: {
          view: filter.view,
          year: filter.year,
          month: filter.month
        }
      });
      return data;
    }
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div> && toast.error("Error cargando los reportes");

  const {
    evolucionMensual,
    resumenTipos,
    tendenciaDevoluciones,
    promedios,
    tablaDetallada
  } = reportesData;

  // Transformaciones para gráficos
  const distribucionData = Object.entries(resumenTipos).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, " $1").trim(),
    value
  }));

  // Filtrado y paginación para comunidades
  const filteredComunidades = promedios.porComunidad.filter(c =>
    c.comunidad.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedComunidades = filteredComunidades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Funciones para ordenamiento
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Procesamiento de tabla detallada
  const filteredDetails = tablaDetallada.filter(item => 
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(detailSearch.toLowerCase())
    )
  );

  const sortedDetails = [...filteredDetails].sort((a, b) => {
    if (sortConfig.key === 'fecha') {
      return new Date(a[sortConfig.key]) - new Date(b[sortConfig.key]);
    }
    return sortConfig.direction === 'asc' 
      ? a[sortConfig.key] - b[sortConfig.key] 
      : b[sortConfig.key] - a[sortConfig.key];
  });

  const paginatedDetails = sortedDetails.slice(
    (currentDetailPage - 1) * itemsPerPage,
    currentDetailPage * itemsPerPage
  );

  // Función auxiliar para obtener el último mes registrado
  const getCurrentMonthDevoluciones = (mensual) => {
    const sorted = [...mensual].sort((a, b) => b.mes.localeCompare(a.mes));
    
    // Obtener mes actual en formato YYYY-MM
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Buscar coincidencia exacta
    const current = sorted.find(item => item.mes === currentMonth);
    
    // Si no hay datos para el mes actual, usar el último disponible
    return current ? current.total : sorted[0]?.total || 0;
  };

  // Columnas para tabla detallada
  const detailColumns = [
    { key: 'fecha', title: 'Fecha' },
    { key: 'ruta', title: 'Ruta' },
    { 
      key: 'comunidades', 
      title: 'Comunidades',
      render: (value) => (
        <span title={value}>
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </span>
      )
    },
    { key: 'totalDespensas', title: 'Total' },
    { key: 'devoluciones', title: 'Devoluciones' },
    { key: 'estado', title: 'Estado' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 space-y-6">
          <div className="mb-4">
            <ReportFilter
              currentFilter={filter}
              onChange={(f) => setFilter(f)}
            />
          </div>
          {/* Sección de KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard
              title="Total despensas"
              value={Object.values(resumenTipos).reduce((a, b) => a + b, 0)}
            />
            <KPICard
              title="Promedio global"
              value={promedios.global.toFixed(1)}
            />
            <KPICard
              title={`Devoluciones último mes (${new Date().toLocaleString("default", { month: "long" })})`}
              value={getCurrentMonthDevoluciones(tendenciaDevoluciones.mensual)}
            />
            <KPICard
              title="Comunidades atendidas"
              value={promedios.porComunidad.length}
            />
          </div>

          {/* Gráficas principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartComponent
              type="bar"
              title="Evolución Mensual de Despensas"
              data={evolucionMensual}
            />
            <ChartComponent
              type="pie"
              title="Distribución de Tipos de Despensa"
              data={distribucionData}
            />
          </div>

          {/* Tendencia de Devoluciones */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Tendencia de Devoluciones</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartComponent
              type="line"
              title="Devoluciones por Mes"
              data={tendenciaDevoluciones.mensual}
              bars={[{ 
                dataKey: "total",  // ← Asegúrate que este coincida con tu data
                name: "Devoluciones", 
                color: "#EF4444" 
              }]}
            />
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Por Ruta</h3>
                  <button
                    onClick={() => setShowAllRoutes(!showAllRoutes)}
                    className="text-blue-600 text-sm"
                  >
                    {showAllRoutes ? "Mostrar menos" : "Ver todas"}
                  </button>
                </div>
                <TableComponent
                  columns={[
                    { key: "ruta", title: "Ruta" },
                    { key: "total", title: "Devoluciones" }
                  ]}
                  data={showAllRoutes 
                    ? tendenciaDevoluciones.porRuta 
                    : tendenciaDevoluciones.porRuta.slice(0, 5)
                  }
                />
              </div>
            </div>
          </div>

          {/* Promedios por Ruta */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Promedios por Ruta</h2>
            <TableComponent
              columns={[
                { key: "ruta", title: "Ruta" },
                { key: "promedio", title: "Promedio", render: (v) => v.toFixed(2) }
              ]}
              data={[...promedios.porRuta].sort((a, b) => b.promedio - a.promedio)}
            />
          </div>

          {/* Promedios por Comunidad */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Promedios por Comunidad</h2>
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar comunidad..."
                className="w-64"
              />
            </div>
            <TableComponent
              columns={[
                { key: "comunidad", title: "Comunidad" },
                { key: "municipio", title: "Municipio" },
                { key: "promedio", title: "Promedio (despesnsas)", render: (v) => v.toFixed(2) }
              ]}
              data={paginatedComunidades}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredComunidades.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Tabla Detallada de las despenas por pedido */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Historial Detallado de Entregas</h2>
              <div className="flex gap-4">
                <SearchInput
                  value={detailSearch}
                  onChange={(e) => setDetailSearch(e.target.value)}
                  placeholder="Buscar en registros..."
                  className="w-64"
                />
              </div>
            </div>
            <TableComponent
              columns={detailColumns}
              data={paginatedDetails}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <Pagination
              currentPage={currentDetailPage}
              totalPages={Math.ceil(filteredDetails.length / itemsPerPage)}
              onPageChange={setCurrentDetailPage}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Report;