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

const ReportEconomico = () => {
  const [filter, setFilter] = useState({
      view: "anual",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 // Mes actual (1-12)
  });
  const [currentComPage, setCurrentComPage] = useState(1);
  const [currentMunPage, setCurrentMunPage] = useState(1);
  const [currentRutaPage, setCurrentRutaPage] = useState(1);
  const [searchCom, setSearchCom] = useState("");
  const [searchMun, setSearchMun] = useState("");
  const [searchRuta, setSearchRuta] = useState("");
  const itemsPerPage = 10;

  const { data: reportesData, isLoading, error } = useQuery({
    queryKey: ["reportesEconomia", filter],
    queryFn: async () => {
      const { data } = await api.get("/reportes/economicos", {
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
    resumenGlobal,
    evolucionMensual,
    distribucionComunidades,
    distribucionMunicipios,
    distribucionRutas
  } = reportesData;

  // Funciones de transformación
  const transformarEvolucionMensual = (data) => {
    if (!data) return [];
    return data.map(item => {
      const [year, month] = item.mes.split("-").map(Number);
      const fecha = new Date(year, month - 1);
      return {
        ...item,
        mes: fecha.toLocaleDateString("es-MX", {
          month: "short",
          year: "2-digit"
        }).replace(/\./g, ""),
        costoTotal: item.costoTotal || 0,
        ingresosRecaudados: item.ingresosRecaudados || 0,
        despensasSubsidiadas: item.despensasSubsidiadas || 0,
        balance: item.balance || 0
      };
    });
  };

  // Transformar datos para gráficos comparativos
  const transformarDatosComparativos = (data) => {
    if (!data) return [];
    return data.map(item => ({
      nombre: item.nombre,
      "Costo Total": item.costoTotal,
      "Ingresos": item.ingresosRecaudados,
      "Subsidiado": item.despensasSubsidiadas
    }));
  };

  // Funciones de filtrado y paginación
  const filterData = (data, searchTerm) => 
    data.filter(item => 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.municipio?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const paginate = (data, page) => ({
    data: data.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    totalPages: Math.ceil(data.length / itemsPerPage)
  });

  // Datos filtrados
  const comunidadesFiltradas = filterData(distribucionComunidades, searchCom);
  const municipiosFiltrados = filterData(distribucionMunicipios, searchMun);
  const rutasFiltradas = filterData(distribucionRutas, searchRuta);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 space-y-6 overflow-x-hidden">
          <div className="mb-4">
            <ReportFilter
              currentFilter={filter}
              onChange={(f) => setFilter(f)}
            />
          </div>
          {/* Sección de KPIs - 6 tarjetas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard
              title="Costo Total"
              value={`$${resumenGlobal.costoTotal.toLocaleString()}`}
            />
            <KPICard
              title="Ingresos"
              value={`$${resumenGlobal.ingresosRecaudados.toLocaleString()}`}
            />
            <KPICard
              title="Subsidiado"
              value={`$${resumenGlobal.despensasSubsidiadas.toLocaleString()}`}
            />
            <KPICard
              title="Balance Neto"
              value={`$${resumenGlobal.balanceNeto.toLocaleString()}`}
              trend={resumenGlobal.balanceNeto >= 0 ? "positive" : "negative"}
            />
            <KPICard
              title="Total Despensas"
              value={resumenGlobal.totalDespensasEntregadas.toLocaleString()}
            />
            <KPICard
              title="Promedio x Despensa"
              value={`$${resumenGlobal.promedioIngresoPorDespensa.toFixed(2)}`}
            />
          </div>

          {/* Gráficos principales - Layout optimizado */}
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 lg:col-span-3">
              <ChartComponent
                type="line"
                title="Evolución Mensual ($)"
                data={transformarEvolucionMensual(evolucionMensual)}
                bars={[
                  { dataKey: "costoTotal", name: "Costo Total", color: "#FDB913" },
                  { dataKey: "ingresosRecaudados", name: "Ingresos", color: "#0DB14C" },
                  { dataKey: "despensasSubsidiadas", name: "Subsidiadas", color: "#ED1A3B" },
                  { dataKey: "balance", name: "Balance", color: "#58595B" }
                ]}
              />
            </div>
            <div className="col-span-6 lg:col-span-3 grid grid-cols-6 gap-6">
              <div className="col-span-6 lg:col-span-3">
                <ChartComponent
                  type="tipos-despensas"
                  title="Valor de Despensas"
                  data={transformarTiposDespensasBar(resumenGlobal?.detalle)}
                  name="$"
                />
              </div>
              <div className="col-span-6 lg:col-span-3">
                <ChartComponent
                  type="tipos-despensas"
                  title="Cantidad de Despensas"
                  data={transformarTiposDespensasConteoBar(resumenGlobal?.detalleConteo)}
                  name="Despensas"
                />
              </div>
            </div>
          </div>

          {/* Distribución por Comunidades */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Distribución por Comunidades</h2>
              <SearchInput
                value={searchCom}
                onChange={(e) => setSearchCom(e.target.value)}
                placeholder="Buscar comunidad..."
                className="w-64"
              />
            </div>
            <TableComponent
              columns={[
                { key: "nombre", title: "Comunidad" },
                { key: "municipio", title: "Municipio" },
                { key: "totalDespensasEntregadas", title: "Despensas", render: (v) => v },
                { key: "costoTotal", title: "Costo Total", render: (v) => `$${v.toLocaleString()}` },
                { key: "ingresosRecaudados", title: "Ingresos", render: (v) => `$${v.toLocaleString()}` },
                { key: "despensasSubsidiadas", title: "Subsidiado", render: (v) => `$${v.toLocaleString()}` },
                { 
                  key: "balance", 
                  title: "Balance", 
                  render: (v) => (
                    <span className={`${v >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${v.toLocaleString()}
                    </span>
                  ) 
                },
                { 
                  key: "porcentajeParticipacion", 
                  title: "Participación", 
                  render: (v) => `${v.toFixed(2)}%` 
                }
              ]}
              data={paginate(comunidadesFiltradas, currentComPage).data}
            />
            <Pagination
              currentPage={currentComPage}
              totalPages={paginate(comunidadesFiltradas, currentComPage).totalPages}
              onPageChange={setCurrentComPage}
            />
          </div>

          {/* Distribución por Municipios */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Distribución por Municipios</h2>
              <SearchInput
                value={searchMun}
                onChange={(e) => setSearchMun(e.target.value)}
                placeholder="Buscar municipio..."
                className="w-64"
              />
            </div>
            <ChartComponent
              type="comparative"
              title="Comparativa por Municipio ($)"
              data={transformarDatosComparativos(distribucionMunicipios)}
              bars={[
                { dataKey: "Costo Total", name: "Costo Total", color: "#58595B" },
                { dataKey: "Ingresos", name: "Ingresos", color: "#0DB14C" },
                { dataKey: "Subsidiado", name: "Subsidiado", color: "#3B82F6" }
              ]}
            />
            <TableComponent
              columns={[
                { key: "nombre", title: "Municipio" },
                { key: "totalDespensasEntregadas", title: "Despensas", render: (v) => v },
                { key: "costoTotal", title: "Costo Total", render: (v) => `$${v.toLocaleString()}` },
                { key: "ingresosRecaudados", title: "Ingresos", render: (v) => `$${v.toLocaleString()}` },
                { key: "despensasSubsidiadas", title: "Subsidiado", render: (v) => `$${v.toLocaleString()}` },
                { 
                  key: "balance", 
                  title: "Balance", 
                  render: (v) => (
                    <span className={`${v >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${v.toLocaleString()}
                    </span>
                  ) 
                },
                { 
                  key: "porcentajeParticipacion", 
                  title: "Participación", 
                  render: (v) => `${v.toFixed(2)}%` 
                }
              ]}
              data={paginate(municipiosFiltrados, currentMunPage).data}
            />
            <Pagination
              currentPage={currentMunPage}
              totalPages={paginate(municipiosFiltrados, currentMunPage).totalPages}
              onPageChange={setCurrentMunPage}
            />
          </div>

          {/* Distribución por Rutas */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Distribución por Rutas</h2>
              <SearchInput
                value={searchRuta}
                onChange={(e) => setSearchRuta(e.target.value)}
                placeholder="Buscar ruta..."
                className="w-64"
              />
            </div>
            <ChartComponent
              type="comparative"
              title="Comparativa por Ruta ($)"
              data={transformarDatosComparativos(distribucionRutas)}
              bars={[
                { dataKey: "Costo Total", name: "Costo Total", color: "#FDB913" },
                { dataKey: "Ingresos", name: "Ingresos", color: "#0DB14C" },
                { dataKey: "Subsidiado", name: "Subsidiado", color: "#3B82F6" }
              ]}
            />
            <TableComponent
              columns={[
                { key: "nombre", title: "Ruta" },
                { key: "totalDespensasEntregadas", title: "Despensas", render: (v) => v },
                { key: "costoTotal", title: "Costo Total", render: (v) => `$${v.toLocaleString()}` },
                { key: "ingresosRecaudados", title: "Ingresos", render: (v) => `$${v.toLocaleString()}` },
                { key: "despensasSubsidiadas", title: "Subsidiado", render: (v) => `$${v.toLocaleString()}` },
                { 
                  key: "balance", 
                  title: "Balance",
                  render: (v) => (
                    <span className={`${v >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${v.toLocaleString()}
                    </span>
                  )
                },
                { 
                  key: "porcentajeParticipacion", 
                  title: "Participación", 
                  render: (v) => `${v.toFixed(2)}%` 
                }
              ]}
              data={paginate(rutasFiltradas, currentRutaPage).data}
            />
            <Pagination
              currentPage={currentRutaPage}
              totalPages={paginate(rutasFiltradas, currentRutaPage).totalPages}
              onPageChange={setCurrentRutaPage}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Funciones de transformación para gráficos
const transformarTiposDespensasBar = (detalle) => {
  if (!detalle) return [];
  return [
    { ruta: "Costo Completo", valor: detalle.costoCompleto || 0, color: "#0DB14C" },
    { ruta: "Medio Costo", valor: detalle.medioCosto || 0, color: "#FDB913" },
    { ruta: "Sin Costo", valor: detalle.sinCosto || 0, color: "#ED1A3B" },
    { ruta: "Apadrinadas", valor: detalle.apadrinadas || 0, color: "#58595B" }
  ];
};

const transformarTiposDespensasConteoBar = (detalleConteo) => {
  if (!detalleConteo) return [];
  return [
    { ruta: "Costo Completo", valor: detalleConteo.costoCompleto, color: "#0DB14C" },
    { ruta: "Medio Costo", valor: detalleConteo.medioCosto, color: "#FDB913" },
    { ruta: "Sin Costo", valor: detalleConteo.sinCosto, color: "#ED1A3B" },
    { ruta: "Apadrinadas", valor: detalleConteo.apadrinadas, color: "#58595B" }
  ];
};

export default ReportEconomico;