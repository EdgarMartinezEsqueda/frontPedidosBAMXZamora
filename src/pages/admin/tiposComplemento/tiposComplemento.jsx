import NewTipoComplementoButton from "components/buttons/ButtonsForTipoComplementoPage";
import Footer from "components/footer/Footer";
import Navbar from "components/navbar/Navbar";
import TableTiposComplemento from "components/tables/complements/TableTypesComplements";
import { useAuth } from "context/AuthContext";
import { hasPermission, RESOURCES } from "utils/permisos";

const AllTiposComplemento = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <h2 className="text-2xl font-bold text-verdeLogo m-3 text-center">
          Gestión de Tipos de Complemento
        </h2>
        {hasPermission(user.data, RESOURCES.TIPOS_COMPLEMENTO, "create") && (
          <NewTipoComplementoButton />
        )}
        <div className="container px-4 mx-auto md:py-4">
          <TableTiposComplemento />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllTiposComplemento;