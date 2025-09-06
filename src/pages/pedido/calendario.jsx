import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import CalendarComponent from "components/calendar/Calendar";

const Calendario = () => {
  const { data: calendarioData, isLoading, error } = useQuery({
    queryKey: ["calendario"],
    queryFn: async () => {
      const { data } = await api.get("/reportes/calendario");
      return data;
    }
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div> && toast.error("Error cargando los reportes");
  
  return (
     <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-50 flex justify-center">
        <div className="w-full max-w-7xl px-4">
          <CalendarComponent eventos={calendarioData} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calendario;