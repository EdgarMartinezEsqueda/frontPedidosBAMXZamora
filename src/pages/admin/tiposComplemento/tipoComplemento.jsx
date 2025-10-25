import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "context/AuthContext";
import api from "lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { hasPermission, RESOURCES } from "utils/permisos";

import Footer from "components/footer/Footer";
import Navbar from "components/navbar/Navbar";

const VerTipoComplemento = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tipoComplemento, isLoading, isError, error } = useQuery({
    queryKey: ["tipoComplemento", id],
    queryFn: async () => (await api.get(`/tiposComplemento/${id}`)).data,
    onError: () => toast.error("Error cargando tipo de complemento")
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/tiposComplemento/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposComplemento"]);
      toast.success("Tipo de complemento desactivado correctamente");
      navigate("/tiposComplemento");
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || "Error al desactivar el tipo de complemento";
      toast.error(message);
    }
  });

  // Mapeo de unidades para mostrar más legible
  const unidadMedidaLabel = {
    kg: "Kilogramos (kg)",
    pz: "Piezas (pz)",
    lt: "Litros (lt)",
    caja: "Cajas"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-md text-center">
          <p className="text-red-600 dark:text-red-400">
            Error al cargar el tipo de complemento
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-2xl font-bold text-verdeLogo dark:text-green-400 mb-6 text-center">
          Tipo de Complemento: {tipoComplemento.nombre}
        </h2>

        <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <InfoRow label="ID" value={tipoComplemento.id} />
          <InfoRow label="Nombre" value={tipoComplemento.nombre} />
          <InfoRow 
            label="Unidad de Medida" 
            value={unidadMedidaLabel[tipoComplemento.unidadMedida] || tipoComplemento.unidadMedida} 
          />
          <InfoRow 
            label="Estado" 
            value={tipoComplemento.activo ? "Activo" : "Inactivo"} 
          />
          
          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            {hasPermission(user.data, RESOURCES.TIPOS_COMPLEMENTO, "update") && tipoComplemento.activo && (
              <button
                onClick={() => navigate(`/tiposComplemento/editar/${id}`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Editar
              </button>
            )}
            
            {hasPermission(user.data, RESOURCES.TIPOS_COMPLEMENTO, "delete") && tipoComplemento.activo && (
              <button
                onClick={() => {
                  if (window.confirm("¿Estás seguro de desactivar este tipo de complemento?")) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Desactivando..." : "Desactivar"}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Componente auxiliar reutilizable
const InfoRow = ({ label, value }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 break-words">{value}</dd>
  </div>
);

export default VerTipoComplemento;