import React from "react";
import { useQuery } from "@tanstack/react-query";
import FilterDropdown from "components/filter/components/FilterDropdown";
import api from "lib/axios";

const FilterWrapper = ({
  selectedCommunities,
  setSelectedCommunities,
  selectedRoutes,
  setSelectedRoutes,
  selectedMunicipalities,
  setSelectedMunicipalities
}) => {
  // Fetch para comunidades
  const { data: comunidadesData } = useQuery({
    queryKey: ["comunidades"],
    queryFn: async () => {
      const { data } = await api.get("/comunidades");
      return data;
    },
  });

  // Fetch para rutas
  const { data: rutasData } = useQuery({
    queryKey: ["rutas"],
    queryFn: async () => {
      const { data } = await api.get("/rutas");
      return data;
    },
  });

  // Fetch para municipios
  const { data: municipiosData } = useQuery({
    queryKey: ["municipios"],
    queryFn: async () => {
      const { data } = await api.get("/municipios");
      return data;
    },
  });

  // Procesar datos para los filtros
  const availableRoutes = rutasData?.map(c => c.nombre) || [];
  const availableCommunities = comunidadesData?.map(u => u.nombre) || [];
  const availableMunicipalities = municipiosData?.map(u => u.nombre) || [];

  return (
    <div className="flex flex-wrap gap-4 p-4 sm:gap-8 items-center justify-center">
      <FilterDropdown
        title="Comunidades"
        allItems={availableCommunities}
        selectedItems={selectedCommunities}
        onSelectionChange={setSelectedCommunities}
        loading={!comunidadesData}
      />

      <FilterDropdown
        title="Rutas"
        allItems={availableRoutes}
        selectedItems={selectedRoutes}
        onSelectionChange={setSelectedRoutes}
        loading={!rutasData}
      />

      <FilterDropdown
        title="Municipio"
        allItems={availableMunicipalities}
        selectedItems={selectedMunicipalities}
        onSelectionChange={setSelectedMunicipalities}
        loading={!municipiosData}
      />
    </div>
  );
};

export default FilterWrapper;