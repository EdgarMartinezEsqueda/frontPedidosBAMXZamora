import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";

import TableUsers from "components/tables/users/TableUsers";
import NewUserButton from "components/buttons/ButtonForUsersPage";

const AllRoutes = () => {
  return (
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <h2 className="text-2xl font-bold text-verdeLogo m-3 text-center">
          Gestión de usuarios actuales
        </h2>
        <NewUserButton />
        <TableUsers />
      </main>
      <Footer />
      </div>
  );
};

export default AllRoutes;