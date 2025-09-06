import { useState, useEffect } from "react";

import { hasPermission, RESOURCES } from "utils/permisos";
import { useAuth } from "context/AuthContext";
import { loadFiltrosComunidades } from "utils/filtrosPedidos"

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TableCommunity from "components/tables/communities/TableCommunity";
import NewCommunityButton from "components/buttons/ButtonsForCommunityPage";
import FilterCommunities from "components/filter/FilterCommunities";
import Pagination from "components/pagination/Pagination";

const CommunitiesPage = () => {
  const { user } = useAuth();
  const filtrosIniciales = loadFiltrosComunidades();

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(filtrosIniciales.currentPage || 1);
  const [pageSize, setPageSize] = useState(10);

  // Cargar filtros desde localStorage al inicio
  const [comunidades, setSelectedCommunities] = useState(filtrosIniciales.comunidades || []);
  const [rutas, setSelectedRoutes] = useState(filtrosIniciales.rutas || []);
  const [municipios, setSelectedMunicipalities] = useState(filtrosIniciales.municipios || []);

  // Estado para el total de elementos
  const [totalCommunities, setTotalCommunities] = useState(0);

  // Calcular total de páginas
  const totalPages = Math.ceil(totalCommunities / pageSize);

  // 1. Cargar filtros guardados al montar el componente
  useEffect(() => {
    const savedFilters = localStorage.getItem("filtrosComunidades");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setSelectedCommunities(parsedFilters.comunidades || []);
      setSelectedRoutes(parsedFilters.rutas || []);
      setSelectedMunicipalities(parsedFilters.municipios || []);
      
      // Cargar la página guardada
      if (parsedFilters.currentPage) {
        setCurrentPage(parsedFilters.currentPage);
      }
    }
  }, []);

  // 2. Guardar filtros cuando cambian
  useEffect(() => {
    const filtersToSave = {
      comunidades,
      rutas,
      municipios,
      currentPage
    };
    localStorage.setItem("filtrosComunidades", JSON.stringify(filtersToSave));
  }, [comunidades, rutas, municipios, currentPage]);

  // Resetear página cuando cambian los filtros (excepto si es por carga inicial)
  useEffect(() => {
    // Solo resetear si no es la carga inicial de localStorage
    if (comunidades.length > 0 || rutas.length > 0 || municipios.length > 0) {
      setCurrentPage(1);
    }
  }, [comunidades, rutas, municipios]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <h2 className="text-2xl font-bold text-verdeLogo m-3 text-center">
          Gestión de comunidades actuales
        </h2>

        {hasPermission(user.data, RESOURCES.COMUNIDADES, "create") && (
          <NewCommunityButton />
        )}

        <FilterCommunities
          selectedCommunities={comunidades}
          setSelectedCommunities={setSelectedCommunities}
          selectedRoutes={rutas}
          setSelectedRoutes={setSelectedRoutes}
          selectedMunicipalities={municipios}
          setSelectedMunicipalities={setSelectedMunicipalities}
        />

        <TableCommunity
          currentPage={currentPage}
          pageSize={pageSize}
          filters={{
            comunidades,
            rutas,
            municipios
          }}
          setTotalCommunities={setTotalCommunities}
        />

        <div className="my-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunitiesPage;