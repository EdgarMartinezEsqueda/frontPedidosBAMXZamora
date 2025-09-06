import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "lib/axios";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";

const VerComunidad = () => {
  const { id } = useParams();

  const { data: comunidad, isLoading, isError, error } = useQuery({
    queryKey: ["comunidad", id],
    queryFn: async () => (await api.get(`/comunidades/${id}`)).data
  });

  const { data: municipios = [] } = useQuery({
    queryKey: ["municipios"],
    queryFn: async () => (await api.get("/municipios")).data,
    onError: () => toast.error("Error cargando municipios")
  });

  const { data: rutas = [] } = useQuery({
    queryKey: ["rutas"],
    queryFn: async () => (await api.get("/rutas")).data,
    onError: () => toast.error("Error cargando rutas")
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center text-gray-800 dark:text-gray-200">
          Cargando datos de la comunidad...
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center text-red-600 dark:text-red-400">
          Error: {error.message}
        </main>
        <Footer />
      </div>
    );
  }

  const municipioNombre = municipios.find(m => m.id === comunidad.idMunicipio)?.nombre || "No especificado";
  const rutaNombre = rutas.find(r => r.id === comunidad.idRuta)?.nombre || "No asignada";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo dark:text-green-400 mb-6 text-center">
          {comunidad.nombre}
        </h2>

        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <InfoRow label="Municipio" value={municipioNombre} />
          <InfoRow label="Ruta asociada" value={rutaNombre} />
          <InfoRow label="Costo de paquete alimentario" value={`$${comunidad.costoPaquete}`} />
          <InfoRow label="Jefa de comunidad" value={comunidad.jefa || "No especificada"} />
          <InfoRow label="Contacto" value={comunidad.contacto || "No especificado"} />
          <InfoRow label="Dirección/Enlace" value={comunidad.direccion || "No especificada"} />
          <InfoRow label="Notas" value={comunidad.notas || "Sin notas"} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 break-words">{value}</dd>
  </div>
);

export default VerComunidad;