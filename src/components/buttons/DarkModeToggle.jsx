import { useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "context/ThemeContext";

const DarkModeToggle = () => {
  const { isDark, setIsDark } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleSystemChange = (e) => {
      if (!localStorage.getItem("darkMode")) {
        setIsDark(e.matches);
      }
    };

    // Sincronizar con preferencias del sistema solo si no hay preferencia guardada
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [setIsDark]);

  const handleToggle = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <MdLightMode className="w-6 h-6 text-yellow-400" />
      ) : (
        <MdDarkMode className="w-6 h-6 text-gray-800 dark:text-white" />
      )}
    </button>
  );
};

export default DarkModeToggle;