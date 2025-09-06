import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TableRoutes from "components/tables/routes/TableRoutes";
import NewRouteButton from "components/buttons/ButtonsForRoutePage";
import Pagination from "components/pagination/Pagination";
import { hasPermission, RESOURCES } from "utils/permisos";
import { useAuth } from "context/AuthContext";

const AllRoutes = () => {
  const { user } = useAuth();
    
  return (
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <h2 className="text-2xl font-bold text-verdeLogo m-3 text-center">
          Gestión de rutas actuales
        </h2>
        {hasPermission(user.data, RESOURCES.RUTAS, "create") && (
          <NewRouteButton />
        )}
        <div className="container px-4 mx-auto md:py-4">
          <TableRoutes />
        </div>
      </main>
      <Footer />
      </div>
  );
};

export default AllRoutes;