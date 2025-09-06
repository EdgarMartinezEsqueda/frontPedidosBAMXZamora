const loadFiltrosPedidos = () => {
  try {
    const saved = localStorage.getItem("filtrosPedidos");
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Error leyendo filtros del localStorage", e);
    return {};
  }
};

const loadFiltrosComunidades = () => {
  try {
    const saved = localStorage.getItem("filtrosComunidades");
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Error leyendo filtros del localStorage", e);
    return {};
  }
};

export {
  loadFiltrosPedidos,
  loadFiltrosComunidades
};  