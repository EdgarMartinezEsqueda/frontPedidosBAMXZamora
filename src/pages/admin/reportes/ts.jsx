import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import Sidebar from "components/sidebar/Sidebar";
import ChartComponent from "components/charts/Chart";
import TSMetricsTable from "components/tables/reports/SocialWorkers";
import RecentActivityCard from "components/cards/TSActivity";
import ReportFilter from "components/filter/FilterReport";

const ReporteTS = () => {
  const [filter, setFilter] = useState({
      view: "anual",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 // Mes actual (1-12)
  });
  const { data: reportesTS, isLoading, error } = useQuery({
    queryKey: ["reportesTS", filter],
    queryFn: async () => {
      const { data } = await api.get("/reportes/ts", {
        params: {
          view: filter.view,
          year: filter.year,
          month: filter.month
        }
      });
      return data;
    }
  });

  if (isLoading) return <div className="p-4 text-center">Cargando métricas...</div>;
  if (error) {
    toast.error("Error cargando reportes de trabajadores sociales");
    return <div className="p-4 text-red-500">Error al cargar los datos</div>;
  }

  const { tablaMetricas, graficas, actividadReciente } = reportesTS;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="grid grid-cols-1 gap-4">
            <div className="mb-4">
              <ReportFilter
                currentFilter={filter}
                onChange={(f) => setFilter(f)}
              />
            </div>
            {/* Gráficas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartComponent
                type="comparative"
                title="Actividad de Trabajadores Sociales"
                data={transformarDatosBarras(graficas.barras)}
                bars={[
                  { dataKey: 'pedidos', name: 'Pedidos', color: '#3B82F6' },
                  { dataKey: 'despensas', name: 'Despensas', color: '#10B981' }
                ]}
              />
              <ChartComponent
                type="pie"
                title="Distribución de Despensas"
                data={transformarDatosPastel(graficas.pastel)}
              />
            </div>

            {/* Tabla de métricas */}
            <TSMetricsTable data={tablaMetricas} />

            {/* Actividad Reciente */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actividadReciente.map((tsActivity) => {
                const ts = tablaMetricas.find(t => t.id === Number(tsActivity.tsId));
                return (
                  <RecentActivityCard 
                    key={tsActivity.tsId}
                    tsId={tsActivity.tsId}
                    username={ts?.username || `TS-${tsActivity.tsId}`}
                    pedidos={tsActivity.pedidos}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Nuevas funciones de transformación
const transformarDatosBarras = (data) => {
  return data.map(item => ({
    ruta: item.ts.substring(0, 12), // Mapear a 'ruta' que espera el componente
    pedidos: item.pedidos,
    despensas: item.despensas
  }));
};

const transformarDatosPastel = (data) => {
  return data.map(item => ({
    name: item.name.substring(0, 12),
    value: Number(item.value)
  }));
};


export default ReporteTS;