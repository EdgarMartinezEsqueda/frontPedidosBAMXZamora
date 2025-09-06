import { useQuery } from "@tanstack/react-query";
import DateFilter from "components/filter/components/DateFilter";
import FilterDropdown from "components/filter/components/FilterDropdown";
import { useAuth } from "context/AuthContext";
import api from "lib/axios";

const FilterWrapper = ({
  routes,
  setRoutes,
  dateRange,
  setDateRange,
  statusOrder,
  setStatusOrder
}) => {
  // Fetch para trabajadores
  const { user } = useAuth();
  const { data: pedidosData } = useQuery({
    queryKey: ["pedidosPorTs", user.data.id],
    queryFn: async () => {
      const { data } = await api.get(`/pedidos/ts/${user.data.id}`);
      return data;
    },
  });

  // Procesar datos para los filtros
  const availableRoutes = [ ...new Set( pedidosData?.map(p => p.ruta.nombre) ) ].reverse() || [];
  const statusOrders = ["pendiente", "finalizado"];
  
  return (
    <div className="flex flex-wrap gap-4 p-4 sm:gap-8 items-center justify-center">
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

      <DateFilter onDateChange={setDateRange} />
    </div>
  );
};

export default FilterWrapper;