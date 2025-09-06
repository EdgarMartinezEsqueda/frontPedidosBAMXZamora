import FilterDropdown from "components/filter/components/FilterDropdown";

const FilterTickets = ({
  selectedStatus,
  setSelectedStatus,
  selectedPriorities,
  setSelectedPriorities
}) => {
  // Opciones predefinidas
  const statusOptions = ["abierto", "en_proceso", "cerrado", "cancelado"];
  const priorityOptions = ["baja", "media", "alta"];

  return (
    <div className="flex flex-wrap gap-4 p-4 sm:gap-8 items-center justify-center">
      <FilterDropdown
        title="Estatus"
        allItems={statusOptions}
        selectedItems={selectedStatus}
        onSelectionChange={setSelectedStatus}
      />

      <FilterDropdown
        title="Prioridad"
        allItems={priorityOptions}
        selectedItems={selectedPriorities}
        onSelectionChange={setSelectedPriorities}
      />
    </div>
  );
};

export default FilterTickets;