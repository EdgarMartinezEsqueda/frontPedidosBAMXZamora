import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import Sidebar from "components/sidebar/Sidebar";
import ChartComponent from "components/charts/Chart";
import TopList from "components/dashboard/TopList";
import CalendarComponent from "components/calendar/Calendar";
import ReportFilter from "components/filter/FilterReport";

const Report = () => {
  const [filter, setFilter] = useState({
      view: "anual",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 // Mes actual (1-12)
  });

  const { data: reportesData, isLoading, error } = useQuery({
    queryKey: ["reportes", "resumen", filter],
    queryFn: async ({ queryKey }) => {
      const [, , currentFilter] = queryKey;
      const { data } = await api.get("/reportes", {
        params: {
          view: currentFilter.view,
          year: currentFilter.year,
          month: currentFilter.month
        }
      });
      return data;
    }
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div> && toast.error("Error cargando los reportes");

  const {
    calendario,
    despensasPorMes,
    rutasDevoluciones,
    tiposDespensas,
    topComunidades,
    topRutas,
    topTrabajadores
  } = reportesData;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-4">
            <ReportFilter
              currentFilter={filter}
              onChange={(f) => setFilter(f)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">            
            {/* Gráficas principales */}
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartComponent
                type="bar"
                title="Despensas por mes"
                data={transformarDatosBar(despensasPorMes)}
              />
              <ChartComponent
                type="pie"
                title="Distribución de tipos"
                data={transformarDatosPie(tiposDespensas)}
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <TopList 
                title="Top Trabajadores Sociales (despensas entregadas)"
                items={topTrabajadores.map(ts => Object.values(ts))}
                valueKey="total"
              />
              <TopList
                title="Top Comunidades (despensas entregadas)"
                items={topComunidades}
              />
              <TopList
                title="Rutas con mas despensas distribuidas"
                items={topRutas}
              />
              <TopList
                title="Rutas con mas devoluciones (despensas)"
                items={rutasDevoluciones}
              />
            </div>

            {/* Calendario */}
            <div className="md:col-span-2 lg:col-span-3">
              <CalendarComponent eventos={calendario} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Funciones helper para transformar datos
const transformarDatosBar = (data) => {
  if(!data) return [];
  return data?.map(item => ({
    mes: item.mes.split('-')[1], // Extraer solo el mes
    Total: item.costo + item.medioCosto + item.sinCosto + item.apadrinadas,
    ...item
  }));
};

const transformarDatosPie = (data) => {
  if(!data) return [];
  return Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));
};

export default Report;