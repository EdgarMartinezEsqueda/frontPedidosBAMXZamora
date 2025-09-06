import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + (import.meta.env.PROD ? "/api" : ""),
  timeout: 10000,
  withCredentials: true, // Obligatorio para cookies
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  }
});

// Interceptor de respuestas (manejo centralizado de errores)
api.interceptors.response.use(
  response => response.data,
  error => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;
    const isPublicRoute = [
      "/login",
      "/registro",
      "/forgotPassword"
    ].some(route => currentPath === route) || currentPath.startsWith("/resetPassword/");

    if (status === 401 && !isPublicRoute) {
      window.location.href = "/login"; // Forzar recarga completa para limpiar estados
    }
    
    return Promise.reject(error);
  }
);

// Función de logout
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Error durante logout:", error);
  } finally {
    // Limpieza del frontend
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.href = "/login"; // Forzar recarga limpia
    }
  }
};

export default api;