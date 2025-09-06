import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import Sidebar from "components/sidebar/Sidebar";
import ChartComponent from "components/charts/Chart";
import Pagination from "components/pagination/Pagination";
import KPICard from "components/cards/KPICard";
import TableComponent from "components/tables/reports/Summary";
import ReportFilter from "components/filter/FilterReport";

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-MX', options);
};

const Report = () => {
  const [filter, setFilter] = useState({
      view: "anual",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 // Mes actual (1-12)
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: reportesData, isLoading, error } = useQuery({
    queryKey: ["reportesApadrinadas", filter],
    queryFn: async () => {
      const { data } = await api.get("/reportes/apadrinadas", {
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
    metricasGlobales,
    topTS,
    topComunidades,
    ultimosPedidos
  } = reportesData;

  const paginatedPedidos = ultimosPedidos.slice(
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
          
          {/* Sección de KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard
              title="Total despensas apadrinadas"
              value={metricasGlobales.totalApadrinadas}
            />
            <KPICard
              title="Porcentaje total"
              value={`${metricasGlobales.porcentajeTotal.toFixed(1)}%`}
            />
            <KPICard
              title="Trabajadores sociales"
              value={topTS.length}
            />
            <KPICard
              title="Comunidades atendidas"
              value={topComunidades.length}
            />
          </div>

          {/* Gráfica de evolución mensual */}
          <ChartComponent
            type="bar"
            title="Evolución mensual de pedidos apadrinados"
            data={evolucionMensual}
            bars={[{ 
              dataKey: "apadrinadas",
              name: "Despensas Apadrinadas",
              color: "#0F766E"
            }]}
          />

          {/* Sección de tops */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Trabajadores Sociales */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Top Trabajadores Sociales</h3>
              <TableComponent
                columns={[
                  { key: "username", title: "Nombre" },
                  { key: "total", title: "Total Despensas" }
                ]}
                data={topTS}
              />
            </div>

            {/* Top Comunidades */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Top Comunidades</h3>
              <TableComponent
                columns={[
                  { key: "nombre", title: "Comunidad" },
                  { key: "municipio.nombre", title: "Municipio" },
                  { key: "total", title: "Total Despensas" }
                ]}
                data={topComunidades}
              />
            </div>
          </div>

          {/* Últimos pedidos */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Últimos pedidos registrados</h3>
            <TableComponent
              columns={[
                { key: "id", title: "ID" },
                { 
                  key: "fecha", 
                  title: "Fecha",
                  render: (value) => formatDate(value)
                },
                { 
                  key: "comunidades", 
                  title: "Comunidades",
                  render: (value) => value.join(', ')
                },
                { key: "totalApadrinadas", title: "Total" }
              ]}
              data={paginatedPedidos}
            />
            {ultimosPedidos.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(ultimosPedidos.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Report;