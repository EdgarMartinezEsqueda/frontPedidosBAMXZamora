import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import api from "lib/axios";

import KPICard from "components/cards/KPICard";
import ChartComponent from "components/charts/Chart";
import ReportFilter from "components/filter/FilterReport";
import Footer from "components/footer/Footer";
import LoadingScreen from "components/loading/LoadingScreen";
import Navbar from "components/navbar/Navbar";
import Pagination from "components/pagination/Pagination";
import SearchInput from "components/search/Search";
import Sidebar from "components/sidebar/Sidebar";
import TableComponent from "components/tables/reports/Summary";

const ReportEconomico = () => {
  const [filter, setFilter] = useState({
    view: "anual",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
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

  if (isLoading) {
    return (
      <LoadingScreen 
        message="Cargando reporte Económico..."
        showSidebar={true}
      />
    );
  }

  if (error) {
    toast.error("Error cargando el reporte Económico");
    return (
      <LoadingScreen 
        error={error.message}
        showSidebar={true}
      />
    );
  }

  const {
    resumenEjecutivo,
    analisisIngresos,
    analisisCostos,
    analisisGeografico,
    impactoSocial
  } = reportesData;

  // Transformar evolución mensual para gráfico
  const transformarEvolucionMensual = (data) => {
    if (!data) return [];
    return data.map(item => {
      const [year, month] = item.mes.split("-").map(Number);
      const fecha = new Date(year, month - 1);
      return {
        mes: fecha.toLocaleDateString("es-MX", {
          month: "short",
          year: "2-digit"
        }).replace(/\./g, ""),
        efectivo: item.efectivo || 0,
        transferencias: item.transferencias || 0,
        total: item.total || 0,
        valorDespensas: item.valorDespensas || 0
      };
    });
  };

  // Transformar tipos de despensas para gráfico de barras (valor)
  const transformarTiposDespensasValor = (despensasPorTipo) => {
    if (!despensasPorTipo) return [];
    return [
      { ruta: "Costo Completo", valor: despensasPorTipo.costoCompleto?.valor || 0, color: "#0DB14C" },
      { ruta: "Medio Costo", valor: despensasPorTipo.medioCosto?.valor || 0, color: "#FDB913" },
      { ruta: "Sin Costo", valor: despensasPorTipo.sinCosto?.valor || 0, color: "#ED1A3B" },
      { ruta: "Apadrinadas", valor: despensasPorTipo.apadrinadas?.valor || 0, color: "#58595B" },
      { ruta: "Voluntariado", valor: despensasPorTipo.voluntariado?.valor || 0, color: "#8b5cf6" }
    ];
  };

  // Transformar tipos de despensas para gráfico de barras (cantidad)
  const transformarTiposDespensasCantidad = (despensasPorTipo) => {
    if (!despensasPorTipo) return [];
    return [
      { ruta: "Costo Completo", valor: despensasPorTipo.costoCompleto?.cantidad || 0, color: "#0DB14C" },
      { ruta: "Medio Costo", valor: despensasPorTipo.medioCosto?.cantidad || 0, color: "#FDB913" },
      { ruta: "Sin Costo", valor: despensasPorTipo.sinCosto?.cantidad || 0, color: "#ED1A3B" },
      { ruta: "Apadrinadas", valor: despensasPorTipo.apadrinadas?.cantidad || 0, color: "#58595B" },
      { ruta: "Voluntariado", valor: despensasPorTipo.voluntariado?.cantidad || 0, color: "#8b5cf6" }
    ];
  };

  // Transformar datos comparativos (comunidades, municipios, rutas)
  const transformarDatosComparativos = (data) => {
    if (!data) return [];
    return data.map(item => ({
      nombre: item.nombre,
      "Ingresos": item.ingresos,
      "Valor Total": item.valorTotal,
      "Balance": item.balance
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
  const comunidadesFiltradas = filterData(analisisGeografico.comunidades, searchCom);
  const municipiosFiltrados = filterData(analisisGeografico.municipios, searchMun);
  const rutasFiltradas = filterData(analisisGeografico.rutas, searchRuta);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 space-y-6 overflow-x-hidden">
          <div className="mb-4">
            <ReportFilter
              currentFilter={filter}
              onChange={(f) => setFilter(f)}
            />
          </div>

          {/* Sección de KPIs - 6 tarjetas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard
              title="Ingresos Totales"
              value={`$${resumenEjecutivo.ingresosTotal.toLocaleString()}`}
            />
            <KPICard
              title="Ingresos Efectivo"
              value={`$${resumenEjecutivo.ingresosEfectivo.toLocaleString()}`}
            />
            <KPICard
              title="Transferencias"
              value={`$${resumenEjecutivo.ingresosTransferencias.toLocaleString()}`}
            />
            <KPICard
              title="Tasa Recuperación"
              value={`${resumenEjecutivo.tasaRecuperacion.toFixed(2)}%`}
              trend={resumenEjecutivo.tasaRecuperacion >= 100 ? "positive" : "negative"}
            />
            <KPICard
              title="Total Despensas"
              value={resumenEjecutivo.totalDespensas.toLocaleString()}
            />
            <KPICard
              title="Valor Subsidiado"
              value={`$${resumenEjecutivo.valorSubsidiado.toLocaleString()}`}
            />
          </div>

          {/* KPIs de Impacto Social */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="Familias Beneficiadas"
              value={impactoSocial.familiasBeneficiadas.toLocaleString()}
            />
            <KPICard
              title="% Despensas Subsidiadas"
              value={`${impactoSocial.porcentajeDespensasSubsidiadas}%`}
            />
            <KPICard
              title="Subsidio Promedio/Familia"
              value={`$${impactoSocial.promedioSubsidioPorFamilia.toFixed(2)}`}
            />
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 lg:col-span-3">
              <ChartComponent
                type="line"
                title="Evolución Mensual de Ingresos ($)"
                data={transformarEvolucionMensual(analisisIngresos.evolucionMensual)}
                bars={[
                  { dataKey: "efectivo", name: "Efectivo", color: "#0DB14C" },
                  { dataKey: "transferencias", name: "Transferencias", color: "#3B82F6" },
                  { dataKey: "total", name: "Total", color: "#FDB913" },
                  { dataKey: "valorDespensas", name: "Valor Despensas", color: "#ED1A3B" }
                ]}
              />
            </div>
            <div className="col-span-6 lg:col-span-3 grid grid-cols-6 gap-6">
              <div className="col-span-6 lg:col-span-3">
                <ChartComponent
                  type="tipos-despensas"
                  title="Valor de Despensas por Tipo"
                  data={transformarTiposDespensasValor(resumenEjecutivo.despensasPorTipo)}
                  name="$"
                />
              </div>
              <div className="col-span-6 lg:col-span-3">
                <ChartComponent
                  type="tipos-despensas"
                  title="Cantidad de Despensas por Tipo"
                  data={transformarTiposDespensasCantidad(resumenEjecutivo.despensasPorTipo)}
                  name="Despensas"
                />
              </div>
            </div>
          </div>

          {/* Análisis de Métodos de Pago */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Distribución de Métodos de Pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                title="Solo Efectivo"
                value={`${analisisIngresos.distribucionMetodosPago.soloEfectivo} pedidos`}
              />
              <KPICard
                title="Solo Transferencias"
                value={`${analisisIngresos.distribucionMetodosPago.soloTransferencias} pedidos`}
              />
              <KPICard
                title="Ambos Métodos"
                value={`${analisisIngresos.distribucionMetodosPago.ambos} pedidos`}
              />
            </div>
          </div>

          {/* Análisis de Costos y Devoluciones */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Análisis de Costos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                title="Costo Promedio/Despensa"
                value={`$${analisisCostos.costoPromedioPorDespensa.toFixed(2)}`}
              />
              <KPICard
                title="Valor Devoluciones"
                value={`$${analisisCostos.devolucionesValor.toLocaleString()}`}
              />
              <KPICard
                title="Impacto Devolución"
                value={`${analisisCostos.impactoDevolucion.toFixed(2)}%`}
                trend="negative"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Devoluciones por Tipo:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(analisisCostos.devolucionesPorTipo).map(([tipo, cantidad]) => (
                  cantidad > 0 && (
                    <div key={tipo} className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {tipo.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xl font-bold">{cantidad}</p>
                    </div>
                  )
                ))}
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
                { key: "despensas", title: "Despensas", render: (v) => v },
                { key: "ingresos", title: "Ingresos", render: (v) => `$${v.toLocaleString()}` },
                { key: "valorTotal", title: "Valor Total", render: (v) => `$${v.toLocaleString()}` },
                { 
                  key: "balance", 
                  title: "Balance", 
                  render: (v) => (
                    <span className={`${v >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${v.toLocaleString()}
                    </span>
                  ) 
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
              data={transformarDatosComparativos(analisisGeografico.municipios)}
              bars={[
                { dataKey: "Ingresos", name: "Ingresos", color: "#0DB14C" },
                { dataKey: "Valor Total", name: "Valor Total", color: "#FDB913" },
                { dataKey: "Balance", name: "Balance", color: "#3B82F6" }
              ]}
            />
            <TableComponent
              columns={[
                { key: "nombre", title: "Municipio" },
                { key: "despensas", title: "Despensas", render: (v) => v },
                { key: "ingresos", title: "Ingresos", render: (v) => `$${v.toLocaleString()}` },
                { key: "valorTotal", title: "Valor Total", render: (v) => `$${v.toLocaleString()}` },
                { 
                  key: "balance", 
                  title: "Balance", 
                  render: (v) => (
                    <span className={`${v >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${v.toLocaleString()}
                    </span>
                  ) 
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
              data={transformarDatosComparativos(analisisGeografico.rutas)}
              bars={[
                { dataKey: "Ingresos", name: "Ingresos", color: "#0DB14C" },
                { dataKey: "Valor Total", name: "Valor Total", color: "#FDB913" },
                { dataKey: "Balance", name: "Balance", color: "#3B82F6" }
              ]}
            />
            <TableComponent
              columns={[
                { key: "nombre", title: "Ruta" },
                { key: "despensas", title: "Despensas", render: (v) => v },
                { key: "ingresos", title: "Ingresos", render: (v) => `$${v.toLocaleString()}` },
                { key: "valorTotal", title: "Valor Total", render: (v) => `$${v.toLocaleString()}` },
                { 
                  key: "balance", 
                  title: "Balance",
                  render: (v) => (
                    <span className={`${v >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${v.toLocaleString()}
                    </span>
                  )
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

export default ReportEconomico;