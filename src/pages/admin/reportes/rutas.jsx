import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import api from "lib/axios";

import ChartComponent from "components/charts/Chart";
import TopList from "components/dashboard/TopList";
import ReportFilter from "components/filter/FilterReport";
import Footer from "components/footer/Footer";
import LoadingScreen from "components/loading/LoadingScreen";
import Navbar from "components/navbar/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import RouteMetricsTable from "components/tables/reports/Routes";

const Report = () => {
  const [filter, setFilter] = useState({
      view: "anual",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 // Mes actual (1-12)
  });
  const { data: reportesData, isLoading, error } = useQuery({
    queryKey: ["reportesRutas", filter],
    queryFn: async () => {
      const { data } = await api.get("/reportes/rutas", {
        params: {
          view: filter.view,
          year: filter.year,
          month: filter.month
        }
      });
      return data;
    }
  });

  if (isLoading) {
    return (
      <LoadingScreen 
        message="Cargando reporte de Rutas..."
        showSidebar={true}
      />
    );
  }

  if (error) {
    toast.error("Error cargando el reporte de Rutas");
    return (
      <LoadingScreen 
        error={error.message}
        showSidebar={true}
      />
    );
  }

  const { tablaMetricas, rankingPedidos, rankingDespensas, graficaComparativa } = reportesData;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-700 space-y-6">
          <div className="mb-4">
            <ReportFilter
              currentFilter={filter}
              onChange={(f) => setFilter(f)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">            
            {/* Gráfica comparativa */}
            <div className="col-span-1">
              <ChartComponent
                type="comparative" // Nuevo tipo que agregaremos
                title="Comparativa de Rutas"
                data={transformarComparativaRutas(graficaComparativa)}
                className="h-96"
                bars={[
                  { dataKey: "despensas", name: "Despensas", color: "#3B82F6" },
                  { dataKey: "devoluciones", name: "Devoluciones", color: "#EF4444" }
                ]}
              />
            </div>

            {/* Tabla de métricas */}
            <RouteMetricsTable data={tablaMetricas} />

            {/* Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TopList
                title="Top Rutas por Pedidos"
                items={rankingPedidos.slice(0, 5)}
                nameKey="nombre"
                valueKey="metricas.pedidos"
                valueLabel="Pedidos"
              />
              <TopList
                title="Top Rutas por Despensas"
                items={rankingDespensas.slice(0, 5)}
                nameKey="nombre"
                valueKey="metricas.despensas"
                valueLabel="Despensas"
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Funciones de transformación
const transformarComparativaRutas = (data) => {
  return data.labels.map((label, index) => ({
    ruta: label,
    despensas: data.datasets[0].data[index],
    devoluciones: data.datasets[1].data[index]
  }));
};

export default Report;