import { createContext, useContext, useState, useEffect } from "react";
import api from "lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await api.get("/auth/me");
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      // Limpiar caché de axios y redirigir SIN recargar
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);