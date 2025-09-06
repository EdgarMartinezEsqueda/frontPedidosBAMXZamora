import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "context/AuthContext";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import TableRoute from "components/tables/routes/TableRoute";

const Route = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: comunidadesRuta, isLoading: isLoadingComunidades, error: errorComunidades } = useQuery({
    queryKey: ["comunidadesRuta"],
    queryFn: async () => {
      const { data } = await api.get(`/comunidades/ruta/${id}`);
      return data;
    },
    onError: () => toast.error("Error cargando comunidades de la ruta")
  });
  
  const { data: ruta, isLoading: isLoadingRuta, error: errorRuta } = useQuery({
    queryKey: ["route", id],
    queryFn: async () => {
      const { data } = await api.get(`/rutas/${id}`);
      return data;
    },
    onError: () => toast.error("Error cargando ruta")
  });

    if (isLoadingComunidades || isLoadingRuta) {	
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center">
            Cargando datos...
          </main>
          <Footer />
        </div>
      );
    }
  return (
    <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <h2 className="text-2xl font-bold text-verdeLogo mb-6 text-center m-3">
        {ruta.nombre}
      </h2>
      {comunidadesRuta && comunidadesRuta.length > 0 ? (
        <div className="container px-4 mx-auto md:py-4">
          <TableRoute data={comunidadesRuta} />
        </div>
      ) : (
        <p className="text-center dark:text-black">No hay comunidades en esta ruta.</p>
      )}
    </main>
    <Footer />
    </div>
  );
};

export default Route;