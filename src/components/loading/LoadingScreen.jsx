import Footer from "components/footer/Footer";
import Navbar from "components/navbar/Navbar";
import Sidebar from "components/sidebar/Sidebar";

const LoadingScreen = ({ 
  showSidebar = true, 
  message = "Cargando...",
  className = "border-verdeLogo",
  error = null
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-700">
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${className}`}></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                {message}
              </span>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LoadingScreen;