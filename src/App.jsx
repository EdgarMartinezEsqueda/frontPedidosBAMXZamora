import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, matchPath } from "react-router";
import { Toaster } from "react-hot-toast";

import PageTitle from "components/title/PageTitle";
import HomePage from "pages/home";
import ErrorPage  from "pages/404";
import LoginPage from "pages/login";
import SignInPage from "pages/signIn";
import OrdersPage from "pages/pedido/pedido";
import EditOrder from "pages/pedido/editarPedido";
import NewOrder from "pages/pedido/nuevoPedido";
import OrdersByTs from "pages/pedido/pedidosPorTs.jsx";
import AllRoutes from "pages/ruta/rutas";
import NewRoute from "pages/ruta/nuevaRuta";
import EditRoute from "pages/ruta/editarRuta";
import Ruta from "pages/ruta/ruta";
import Communities from "pages/comunidad/comunidades";
import Community from "pages/comunidad/comunidad";
import NewCommunity from "pages/comunidad/nuevaComunidad";
import EditCommunity from "pages/comunidad/editarComunidad";
import Users from "pages/admin/usuarios/usuarios";
import NewUser from "pages/admin/usuarios/nuevoUsuario";
import EditUser from "pages/admin/usuarios/editarUsuario";
import ReportesResumen from "pages/admin/reportes/resumen.jsx";
import ReportesRutas from "pages/admin/reportes/rutas.jsx";
import ReportesTS from "pages/admin/reportes/ts.jsx";
import ReportesDespensas from "pages/admin/reportes/despensas.jsx";
import ReportesComunidades from "pages/admin/reportes/comunidades.jsx";
import ReportesApadrinadas from "pages/admin/reportes/apadrinadas.jsx";
import ReportesEconomicos from "pages/admin/reportes/economico.jsx";
import ForgotPassword from "pages/auth/forgotPassword.jsx";
import ResetPassword from "pages/auth/resetPassword.jsx";
import Calendar from "pages/pedido/calendario.jsx";
import Tickets from "pages/tickets/tickets.jsx";
import Ticket from "pages/tickets/ticket.jsx";
import NewTicket from "pages/tickets/nuevoTicket.jsx";
import EditTicket from "pages/tickets/editarTicket.jsx";

import { useAuth } from "context/AuthContext";
import { ThemeProvider } from "context/ThemeContext";
import { RESOURCES } from "utils/permisos";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const routes = [
    { path: "/", element: <HomePage />, requiresAuth: true, title: "Inicio", allowedRoles: ["Direccion", "Ts", "Almacen", "Coordinadora", "Consejo", "Contabilidad"] },
    
    { path: "/login", element: <LoginPage />, requiresAuth: false, title: "Iniciar sesión"},
    { path: "/registro", element: <SignInPage />, requiresAuth: false, title: "Registro de usuario"},
    
    { path: "/pedido/nuevo", element: <NewOrder />, requiresAuth: true, title: "Crear Pedido", allowedRoles: ["Direccion", "Ts", "Coordinadora"] },
    { path: "/pedido/:id", element: <OrdersPage />, requiresAuth: true, title: "Pedido", allowedRoles: ["Direccion", "Ts", "Almacen", "Coordinadora", "Consejo", "Contabilidad"] },
    { path: "/pedido/editar/:id", element: <EditOrder />, requiresAuth: true, title: "Editar Pedido", allowedRoles: ["Direccion", "Ts", "Coordinadora"], resource: RESOURCES.PEDIDOS, action: "update", checkOwnership: true },
    { path: "/pedidos/ts/:id", element: <OrdersByTs />, requiresAuth: true, title: "Mis pedidos", allowedRoles: ["Direccion", "Ts", "Coordinadora", "Consejo"], resource: RESOURCES.PEDIDOS, action: "update", checkOwnership: true },

    { path: "/reportes", element: <ReportesResumen />, requiresAuth: true, title: "Resumen general", allowedRoles: ["Direccion", "Coordinadora", "Ts", "Almacen", "Consejo", "Contabilidad"] },
    { path: "/reportes/rutas", element: <ReportesRutas />, requiresAuth: true, title: "Reportes rutas", allowedRoles: ["Direccion", "Contabilidad", "Consejo", "Ts", "Coordinadora", "Almacen"] },
    { path: "/reportes/ts", element: <ReportesTS />, requiresAuth: true, title: "Reportes Trabajadores Sociales", allowedRoles: ["Direccion", "Consejo", "Coordinadora", "Almacen"] },
    { path: "/reportes/despensas", element: <ReportesDespensas />, requiresAuth: true, title: "Reportes despensas", allowedRoles: ["Direccion", "Contabilidad", "Consejo", "Ts", "Coordinadora", "Almacen"] },
    { path: "/reportes/comunidades", element: <ReportesComunidades />, requiresAuth: true, title: "Reportes comunidades", allowedRoles: ["Direccion", "Contabilidad", "Consejo", "Ts", "Coordinadora", "Almacen"	] },
    { path: "/reportes/apadrinadas", element: <ReportesApadrinadas />, requiresAuth: true, title: "Reportes apadrinadas", allowedRoles: ["Direccion", "Contabilidad", "Consejo", "Ts", "Coordinadora"] },
    { path: "/reportes/economico", element: <ReportesEconomicos />, requiresAuth: true, title: "Reportes económicos", allowedRoles: ["Direccion", "Contabilidad", "Consejo"] },

    { path: "/usuarios", element: <Users />, requiresAuth: true, title: "Usuarios", allowedRoles: ["Direccion"] },
    { path: "/usuarios/nuevo", element: <NewUser />, requiresAuth: true, title: "Nuevo usuario", allowedRoles: ["Direccion"] },
    { path: "/usuarios/editar/:id", element: <EditUser />, requiresAuth: true, title: "Editar usuario", allowedRoles: ["Direccion"], resource: RESOURCES.USUARIOS, action: "update", checkOwnership: true },
    { path: "/usuarios/:id", element: <EditUser />, requiresAuth: true, title: "Editar usuario", allowedRoles: ["Direccion", "Ts", "Almacen", "Coordinadora", "Consejo", "Contabilidad"], resource: RESOURCES.USUARIOS, action: "read", checkOwnership: true },

    { path: "/comunidades", element: <Communities />, requiresAuth: true, title: "Comunidades", allowedRoles: ["Direccion", "Coordinadora", "Ts", "Almacen", "Consejo", "Contabilidad"] },
    { path: "/comunidades/:id", element: <Community />, requiresAuth: true, title: "Comunidad", allowedRoles: ["Direccion", "Coordinadora", "Ts", "Almacen", "Consejo", "Contabilidad"] },
    { path: "/comunidades/nuevo", element: <NewCommunity />, requiresAuth: true, title: "Nueva comunidad", allowedRoles: ["Direccion", "Coordinadora"] },
    { path: "/comunidades/editar/:id", element: <EditCommunity />, requiresAuth: true, title: "Editar comunidad", allowedRoles: ["Direccion", "Coordinadora"] },

    { path: "/rutas", element: <AllRoutes />, requiresAuth: true, title: "Gestionar Rutas", allowedRoles: ["Direccion", "Ts", "Coordinadora", "Almacen", "Consejo", "Contabilidad"] },
    { path: "/rutas/nuevo", element: <NewRoute />, requiresAuth: true, title: "Nueva ruta", allowedRoles: ["Direccion", "Coordinadora"] },
    { path: "/rutas/editar/:id", element: <EditRoute />, requiresAuth: true, title: "Editar ruta", allowedRoles: ["Direccion", "Coordinadora"] },
    { path: "/rutas/:id", element: <Ruta />, requiresAuth: true, title: "Ruta", allowedRoles: ["Direccion", "Ts", "Coordinadora", "Almacen", "Consejo", "Contabilidad"] },

    { path: "/forgotPassword", element: <ForgotPassword />, requiresAuth: false, title: "Recuperar contraseña"},
    { path: "/resetPassword/:token", element: <ResetPassword />, requiresAuth: false, title: "Cambiar contraseña"},

    { path: "/calendario", element: <Calendar />, requiresAuth: true, title: "Calendario", allowedRoles: ["Direccion", "Ts", "Almacen", "Coordinadora", "Consejo", "Contabilidad"] },

    { path: "/tickets", element: <Tickets />, requiresAuth: true, title: "Soporte", allowedRoles: ["Direccion", "Consejo"] },
    { path: "/tickets/nuevo", element: <NewTicket />, requiresAuth: true, title: "Nuevo ticket", allowedRoles: ["Direccion", "Ts", "Almacen", "Coordinadora", "Consejo", "Contabilidad"] },
    { path: "/tickets/:id", element: <Ticket />, requiresAuth: true, title: "Ticket", allowedRoles: ["Direccion", "Consejo"] },
    { path: "/tickets/editar/:id", element: <EditTicket />, requiresAuth: true, title: "Editar ticket", allowedRoles: ["Direccion"] },

    { path: "*", element: <ErrorPage />, requiresAuth: true, title: "Ha surgido un error", allowedRoles: ["Direccion", "Ts", "Almacen", "Coordinadora", "Consejo", "Contabilidad"] },
  ];

  if (loading) {
    return <div>Cargando...</div>; // Muestra un spinner aquí
  }

  const checkAccess = (route, user) => {
    // Si la ruta no requiere autenticación, es accesible para usuarios no autenticados
    if (!route.requiresAuth) 
      return true;
    // Si la ruta requiere autenticación y no hay usuario, no es accesible
    if (route.requiresAuth && !user) 
      return false;
    // Si la ruta tiene roles permitidos, verifica que el usuario tenga uno de esos roles
    if (route.allowedRoles && !route.allowedRoles.includes(user?.data?.rol)) 
      return false;
    return true;
  };
  
  const getResourceOwnerId = (route) => {
    const match = matchPath(route.path, location.pathname);
    return match?.params?.id;
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen dark:bg-slate-800 dark:text-white">
        <Routes>
          {routes.map((route) => {
            const ownerId = getResourceOwnerId(route);
            
            return (
              <Route
              key={route.path}
              path={route.path}
              element={
                // Si el usuario está autenticado y la ruta no requiere autenticación, redirige a "/"
                user && !route.requiresAuth ? (
                  <Navigate to="/" replace />
                ) : // Si el usuario no tiene acceso según checkAccess, redirige a "/" si está autenticado, o a "/login" si no
                !checkAccess(route, user) ? (
                  <Navigate to={user ? "/" : "/login"} replace />
                ) : (
                  // Si todo está bien, renderiza la página con su título
                  <PageTitle title={route.title}>{route.element}</PageTitle>
                )
              }
              />);
            }
          )}
        </Routes>
      </div>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
