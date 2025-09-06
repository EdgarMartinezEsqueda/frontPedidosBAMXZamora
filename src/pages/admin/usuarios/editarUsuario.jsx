import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "lib/axios";
import toast from "react-hot-toast";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import UserForm from "components/forms/UserForm";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      try{
        const { data } = await api.get(`/usuarios/${id}`);
        return data;
      }
      catch(error){
        navigate("/", { replace: true });
      }
    },
    retry: 0,
    enabled: !!id
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (userData) => api.patch(`/usuarios/${id}`, userData),
    onSuccess: () => {
      toast.success("Usuario actualizado exitosamente");
      navigate("/usuarios");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error al actualizar usuario");
    }
  });

  if (isLoading) return <div>Cargando usuario...</div>;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-6">Editar Usuario: <strong className="text-amarilloLogo">{user?.username}</strong></h2>
          <UserForm onSubmit={mutate} isSubmitting={isPending} existingUser={user} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditUser;