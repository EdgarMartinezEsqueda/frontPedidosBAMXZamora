import { useState, useEffect } from "react";
import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TableTicket from "components/tables/tickets/TableTicket";
import NewTicketButton from "components/buttons/NewTicketButton";
import FilterTickets from "components/filter/FilterTickets";
import Pagination from "components/pagination/Pagination";
import { hasPermission, RESOURCES } from "utils/permisos";
import { useAuth } from "context/AuthContext";

const AllTickets = () => {
  const { user } = useAuth();
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estados de filtros
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);

  // Estado para el total de elementos
  const [totalTickets, setTotalTickets] = useState(0);

  // Calcular total de páginas
  const totalPages = Math.ceil(totalTickets / pageSize);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedPriorities]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <h2 className="text-2xl font-bold text-verdeLogo m-3 text-center">
          Gestión de Tickets
        </h2>

        {hasPermission(user.data, RESOURCES.TICKETS, "create") && (
          <NewTicketButton />
        )}

        <FilterTickets
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPriorities={selectedPriorities}
          setSelectedPriorities={setSelectedPriorities}
        />

        <TableTicket
          currentPage={currentPage}
          pageSize={pageSize}
          filters={{
            estatus: selectedStatus,
            prioridad: selectedPriorities
          }}
          setTotalTickets={setTotalTickets}
        />

        <div className="my-4">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages} 
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllTickets;