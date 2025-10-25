import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import LoadingScreen from "components/loading/LoadingScreen";

import api from "lib/axios";

import ComplementosMetricsCards from "components/cards/Complements";
import ChartComponent from "components/charts/Chart";
import TopList from "components/dashboard/TopList";
import ReportFilter from "components/filter/FilterReport";
import Footer from "components/footer/Footer";
import Navbar from "components/navbar/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import ComplementosPorTipoTable from "components/tables/complements/ComplementsByType";

const ReporteComplementos = () => {
  const [filter, setFilter] = useState({
    view: "anual",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const { data: reportesData, isLoading, error } = useQuery({
    queryKey: ["reportesComplementos", filter],
    queryFn: async () => {
      const { data } = await api.get("/reportes/complementos", {
        params: {
          view: filter.view,
          year: filter.year,
          month: filter.month
        }
      });
      console.log(data);
      return data;
    }
  });

  if (isLoading) {
    return (
      <LoadingScreen 
        message="Cargando reporte de complementos..."
        showSidebar={true}
      />
    );
  }

  if (error) {
    toast.error("Error cargando el reporte de complementos");
    return (
      <LoadingScreen 
        error={error.message}
        showSidebar={true}
      />
    );
  }

  const { 
    resumenGeneral, 
    porTipoComplemento, 
    porRuta, 
    graficas
  } = reportesData;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-700 space-y-6">

          {/* Filtro */}
          <div className="mb-4">
            <ReportFilter
              currentFilter={filter}
              onChange={(f) => setFilter(f)}
            />
          </div>

          {/* Cards de métricas generales */}
          <ComplementosMetricsCards data={resumenGeneral} />

          {/* Gráficas principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfica por tipo de complemento */}
            <div className="col-span-1">
              <ChartComponent
                type="comparative"
                title="Complementos por Tipo"
                data={transformarGraficaPorTipo(graficas.porTipo)}
                className="h-96"
                bars={[
                  { dataKey: "peso", name: "Peso (kg)", color: "#10B981" },
                  { dataKey: "costo", name: "Costo ($)", color: "#3B82F6" }
                ]}
              />
            </div>

            {/* Gráfica por ruta */}
            <div className="col-span-1">
              <ChartComponent
                type="comparative"
                title="Rutas con más Complementos"
                data={transformarGraficaPorRuta(graficas.porRuta)}
                className="h-96"
                bars={[
                  { dataKey: "peso", name: "Peso Total (kg)", color: "#fdb913" }
                ]}
              />
            </div>
          </div>

          {/* Tabla detallada por tipo */}
          <ComplementosPorTipoTable data={porTipoComplemento.detalle} />

          {/* Rankings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TopList
              title="Top Tipos de Complemento"
              items={porTipoComplemento.ranking}
              nameKey="nombre"
              valueKey="pesoKg"
              valueLabel="kg"
            />
            
            <TopList
              title="Top Rutas"
              items={porRuta.top10}
              nameKey="nombre"
              valueKey="pesoKg"
              valueLabel="kg"
            />

            {/* Detalle de rutas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detalle por Ruta
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {porRuta.detalle.map((ruta) => (
                    <div 
                      key={ruta.id} 
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{ruta.nombre}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {ruta.numeroPedidos} pedidos • {ruta.numeroComplementos} complementos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-verdeLogo">{ruta.pesoKg.toFixed(2)} kg</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${ruta.costo.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
};

// Funciones de transformación para las gráficas
const transformarGraficaPorTipo = (data) => {
  return data.labels.map((label, index) => ({
    tipo: label,
    peso: data.datasets[0].data[index],
    costo: data.datasets[1].data[index]
  }));
};

const transformarGraficaPorRuta = (data) => {
  return data.labels.map((label, index) => ({
    ruta: label,
    peso: data.datasets[0].data[index]
  }));
};

export default ReporteComplementos;