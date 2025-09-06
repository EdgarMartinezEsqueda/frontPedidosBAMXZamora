import { useState, useEffect } from "react";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TableUserOrders from "components/tables/orders/TableUserOrders";
import FilterOrders from "components/filter/FilterOrdersByTs";
import Pagination from "components/pagination/Pagination";

const OrdersByTs = () => {  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estado para los filtros seleccionados
  const [routes, setRoutes] = useState([]);
  const [dateRange, setDateRange] = useState({});
  const [statusOrder, setStatusOrder] = useState([]);

  // Estado para el total de elementos
  const [totalOrders, setTotalOrders] = useState(0);

  // Calcular total de páginas
  const totalPages = Math.ceil(totalOrders / pageSize);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [routes, statusOrder, dateRange] );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        <h2 className="text-center mt-4 font-bold text-2xl text-verdeLogo">Pedidos</h2>

        <FilterOrders 
          routes={routes}
          setRoutes={setRoutes}
          dateRange={dateRange}
          setDateRange={setDateRange}
          statusOrder={statusOrder}
          setStatusOrder={setStatusOrder}        
        />
        <div className="container px-4 mx-auto md:py-4">
           <TableUserOrders 
            currentPage={currentPage}
            pageSize={pageSize}
            filters={{
              rutas: routes,
              estatusPedido: statusOrder,
              rangoFechas: dateRange
            }}
            setTotalOrders={setTotalOrders}
          />
        </div>

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

export default OrdersByTs;