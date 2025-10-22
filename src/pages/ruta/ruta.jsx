import { useQuery } from "@tanstack/react-query";
import { useAuth } from "context/AuthContext";
import api from "lib/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router";

import Footer from "components/footer/Footer";
import Navbar from "components/navbar/Navbar";
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
        <h2 className="text-3xl font-bold text-center text-verdeLogo m-2">
          {ruta.nombre}
        </h2>

        <div className="flex justify-center mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
              ${ruta.tipo === "voluntariado"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
              }`}
          >
            {ruta.tipo === "voluntariado" ? "Ruta de Voluntariado" : "Ruta Normal"}
          </span>
        </div>
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