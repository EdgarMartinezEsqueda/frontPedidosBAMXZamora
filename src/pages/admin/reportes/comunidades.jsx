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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllPedidos, setShowAllPedidos] = useState(false);
  const itemsPerPage = 10;

  const { data: reportesData, isLoading, error } = useQuery({
    queryKey: ["reportesComunidades", filter],
    queryFn: async () => {
      const { data } = await api.get("/reportes/comunidades", {
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
    topComunidadesPedidos,
    topComunidadesDespensas,
    mapaVolumen,
    tablaDetallada
  } = reportesData;

  // Cálculo de KPIs
  const totalDespensas = tablaDetallada.reduce((acc, curr) => acc + curr.totalDespensas, 0);
  const totalComunidades = mapaVolumen.length;
  const promedioGlobal = totalDespensas / totalComunidades;

  // Distribución de tipos de despensas
  const resumenTipos = tablaDetallada.reduce((acc, curr) => {
    acc.costo += curr.detalleDespensas.costo;
    acc.medioCosto += curr.detalleDespensas.medioCosto;
    acc.sinCosto += curr.detalleDespensas.sinCosto;
    acc.apadrinadas += curr.detalleDespensas.apadrinadas;
    return acc;
  }, { costo: 0, medioCosto: 0, sinCosto: 0, apadrinadas: 0 });

  const distribucionData = [
    { name: "Costo", value: resumenTipos.costo },
    { name: "Medio Costo", value: resumenTipos.medioCosto },
    { name: "Sin Costo", value: resumenTipos.sinCosto },
    { name: "Apadrinadas", value: resumenTipos.apadrinadas }
  ];

  // Preparar datos para gráficos
  const topComunidadesChartData = topComunidadesDespensas.map(c => ({
    ruta: c.nombre,
    totalDespensas: c.totalDespensas
  }));

  // Promedios por municipio
  const municipiosMap = new Map();
  tablaDetallada.forEach(comunidad => {
    const key = comunidad.municipio;
    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, { totalDespensas: 0, totalPedidos: 0 });
    }
    const data = municipiosMap.get(key);
    data.totalDespensas += comunidad.totalDespensas;
    data.totalPedidos += comunidad.totalPedidos;
  });

  const promediosPorMunicipio = Array.from(municipiosMap.entries()).map(([municipio, data]) => ({
    municipio,
    promedio: data.totalPedidos > 0 ? data.totalDespensas / data.totalPedidos : 0
  }));

  // Promedios por comunidad
  const promediosPorComunidad = tablaDetallada.map(c => ({
    comunidad: c.nombre,
    municipio: c.municipio,
    promedio: c.totalPedidos > 0 ? c.totalDespensas / c.totalPedidos : 0
  }));

  // Filtrado y paginación
  const filteredComunidades = promediosPorComunidad.filter(c =>
    c.comunidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedComunidades = filteredComunidades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Total despensas"
              value={totalDespensas}
              format="number"
            />
            <KPICard
              title="Promedio global"
              value={promedioGlobal.toFixed(1)}
            />
            <KPICard
              title="Comunidades atendidas"
              value={totalComunidades}
            />
          </div>

          {/* Gráficas principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartComponent
              type="comparative"
              title="Top Comunidades por Despensas"
              data={topComunidadesChartData}
              bars={[
                { dataKey: "totalDespensas", name: "Despensas", color: "#3B82F6" }
              ]}
            />
            <ChartComponent
              type="pie"
              title="Distribución de Tipos de Despensa"
              data={distribucionData}
            />
          </div>

          {/* Top comunidades por pedidos */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Top Comunidades por Pedidos</h3>
              <button
                onClick={() => setShowAllPedidos(!showAllPedidos)}
                className="text-blue-600 text-sm"
              >
                {showAllPedidos ? "Mostrar menos" : "Ver todas"}
              </button>
            </div>
            <TableComponent
              columns={[
                { key: "nombre", title: "Comunidad" },
                { key: "municipio", title: "Municipio" },
                { key: "totalPedidos", title: "Total Pedidos" }
              ]}
              data={showAllPedidos ? topComunidadesPedidos : topComunidadesPedidos.slice(0, 5)}
            />
          </div>

          {/* Promedios por Municipio */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Promedios por Municipio</h2>
            <TableComponent
              columns={[
                { key: "municipio", title: "Municipio" },
                { 
                  key: "promedio", 
                  title: "Promedio (Despensas/Pedido)",
                  render: (v) => v.toFixed(2)
                }
              ]}
              data={promediosPorMunicipio.sort((a, b) => b.promedio - a.promedio)}
            />
          </div>

          {/* Promedios por Comunidad */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Promedios por Comunidad</h2>
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar comunidad o municipio..."
                className="w-64"
              />
            </div>
            <TableComponent
              columns={[
                { key: "comunidad", title: "Comunidad" },
                { key: "municipio", title: "Municipio" },
                { 
                  key: "promedio", 
                  title: "Promedio (Despensas/Pedido)",
                  render: (v) => v.toFixed(2)
                }
              ]}
              data={paginatedComunidades}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredComunidades.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Report;