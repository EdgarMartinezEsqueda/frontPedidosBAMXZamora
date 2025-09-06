import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import api from "lib/axios";
import toast from "react-hot-toast";

import Navbar from "components/navbar/Navbar";
import Footer from "components/footer/Footer";
import UserForm from "components/forms/UserForm";

const CreateUser = () => {
  const navigate = useNavigate();
  
  const { mutate, isPending } = useMutation({
    mutationFn: (userData) => api.post("/auth/registro", userData),
    onSuccess: () => {
      toast.success("Usuario creado exitosamente");
      navigate("/usuarios");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error.message || "Error al crear usuario");
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-6">Crear Nuevo Usuario</h2>
          <UserForm 
            onSubmit={mutate} 
            isSubmitting={isPending} 
            newUser={true}            
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateUser;