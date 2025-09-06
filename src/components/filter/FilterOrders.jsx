import { useQuery } from "@tanstack/react-query";
import FilterDropdown from "components/filter/components/FilterDropdown";
import DateFilter from "components/filter/components/DateFilter";
import api from "lib/axios";

const FilterWrapper = ({
  workers,
  setWorkers,
  routes,
  setRoutes,
  dateRange,
  setDateRange,
  statusOrder,
  setStatusOrder
}) => {
  // Fetch para trabajadores
  const { data: pedidosData } = useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data } = await api.get("/pedidos");
      return data.pedidos;
    },
  });

  // Fetch para trabajadores
  const { data: rutasData } = useQuery({
    queryKey: ["allRutas"],
    queryFn: async () => {
      const { data } = await api.get("/rutas");
      return data;
    },
  });

  // Fetch para trabajadores
  const { data: workersData } = useQuery({
    queryKey: ["allWorkersWithOrders"],
    queryFn: async () => {
      const { data } = await api.get("/usuarios/todos/conPedidos");
      console.log("Datos de trabajadores:", data);
      return data;
    },
  });

  // Procesar datos para los filtros
  const availableRoutes = [ ...new Set( rutasData?.map(r => r.nombre) ) ].reverse() || [];
  const availableWorkers = [ ...new Set( workersData?.map(u => u.username) ) ] || [];
  const statusOrders = ["pendiente", "finalizado"];
  
  return (
    <div className="flex flex-wrap gap-4 p-4 sm:gap-8 items-center justify-center">
      <FilterDropdown
        title="Trabajadores"
        allItems={availableWorkers}
        selectedItems={workers}
        onSelectionChange={setWorkers}
        loading={!pedidosData}
      />

      <FilterDropdown
        title="Rutas"
        allItems={availableRoutes}
        selectedItems={routes}
        onSelectionChange={setRoutes}
        loading={!pedidosData}
      />

      <FilterDropdown
        title="Estatus"
        allItems={statusOrders}
        selectedItems={statusOrder}
        onSelectionChange={setStatusOrder}
      />

      <DateFilter 
        onDateChange={setDateRange}
        dateRange={dateRange}
      />
    </div>
  );
};

export default FilterWrapper;