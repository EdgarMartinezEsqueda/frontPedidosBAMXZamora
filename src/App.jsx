import { Toaster } from "react-hot-toast";
import { matchPath, Navigate, Route, Routes, useLocation } from "react-router";

import PageTitle from "components/title/PageTitle";
import ErrorPage from "pages/404";
import ReportesApadrinadas from "pages/admin/reportes/apadrinadas";
import ReporteComplementos from "pages/admin/reportes/complementos";
import ReportesComunidades from "pages/admin/reportes/comunidades";
import ReportesDespensas from "pages/admin/reportes/despensas";
import ReportesEconomicos from "pages/admin/reportes/economico";
import ReportesResumen from "pages/admin/reportes/resumen";
import ReportesRutas from "pages/admin/reportes/rutas";
import ReportesTS from "pages/admin/reportes/ts";
import EditTipoComplemento from "pages/admin/tiposComplemento/editarTipoComplemento";
import NuevoTipoComplemento from "pages/admin/tiposComplemento/nuevoTipoComplemento";
import VerTipoComplemento from "pages/admin/tiposComplemento/tipoComplemento";
import AllTiposComplemento from "pages/admin/tiposComplemento/tiposComplemento";
import EditUser from "pages/admin/usuarios/editarUsuario";
import NewUser from "pages/admin/usuarios/nuevoUsuario";
import Users from "pages/admin/usuarios/usuarios";
import ForgotPassword from "pages/auth/forgotPassword";
import ResetPassword from "pages/auth/resetPassword";
import Community from "pages/comunidad/comunidad";
import Communities from "pages/comunidad/comunidades";
import EditCommunity from "pages/comunidad/editarComunidad";
import NewCommunity from "pages/comunidad/nuevaComunidad";
import HomePage from "pages/home";
import LoginPage from "pages/login";
import Calendar from "pages/pedido/calendario";
import EditOrder from "pages/pedido/editarPedido";
import NewOrder from "pages/pedido/nuevoPedido";
import OrdersPage from "pages/pedido/pedido";
import OrdersByTs from "pages/pedido/pedidosPorTs";
import EditRoute from "pages/ruta/editarRuta";
import NewRoute from "pages/ruta/nuevaRuta";
import Ruta from "pages/ruta/ruta";
import AllRoutes from "pages/ruta/rutas";
import SignInPage from "pages/signIn";
import EditTicket from "pages/tickets/editarTicket";
import NewTicket from "pages/tickets/nuevoTicket";
import Ticket from "pages/tickets/ticket";
import Tickets from "pages/tickets/tickets";

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
    { path: "/reportes/complementos", element: <ReporteComplementos />, requiresAuth: true, title: "Reportes complementos", allowedRoles: ["Direccion", "Almacen", "Consejo"] },

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

    { path: "/tiposComplemento", element: <AllTiposComplemento />, requiresAuth: true, title: "Tipos de complemento", allowedRoles: ["Direccion", "Ts", "Almacen", "Coordinadora", "Consejo", "Contabilidad"] },
    { path: "/tiposComplemento/nuevo", element: <NuevoTipoComplemento />, requiresAuth: true, title: "Nuevo tipo de complemento", allowedRoles: ["Direccion", "Almacen"] },
    { path: "/tiposComplemento/:id/", element: <VerTipoComplemento />, requiresAuth: true, title: "Tipo de complemento", allowedRoles: ["Direccion", "Almacen"] },
    { path: "/tiposComplemento/editar/:id", element: <EditTipoComplemento />, requiresAuth: true, title: "Editar tipo de complemento", allowedRoles: ["Direccion", "Almacen"] },

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
