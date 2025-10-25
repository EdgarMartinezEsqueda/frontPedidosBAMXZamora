import { useQuery } from "@tanstack/react-query";
import api from "lib/axios";
import toast from "react-hot-toast";

import CalendarComponent from "components/calendar/Calendar";
import Footer from "components/footer/Footer";
import LoadingScreen from "components/loading/LoadingScreen";
import Navbar from "components/navbar/Navbar";

const Calendario = () => {
  const { data: calendarioData, isLoading, error } = useQuery({
    queryKey: ["calendario"],
    queryFn: async () => {
      const { data } = await api.get("/reportes/calendario");
      return data;
    }
  });

  if (isLoading) {
    return (
      <LoadingScreen 
        message="Cargando el Calendario..."
        showSidebar={false}
      />
    );
  }

  if (error) {
    toast.error("Error cargando el Calendario");
    return (
      <LoadingScreen 
        error={error.message}
        showSidebar={false}
      />
    );
  }
  
  return (
     <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 flex justify-center">
        <div className="w-full max-w-7xl px-4">
          <CalendarComponent eventos={calendarioData} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calendario;