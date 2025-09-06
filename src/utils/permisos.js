export const ROLES = {
  DIRECCION: "Direccion",
  COORDINADORA: "Coordinadora",
  TS: "Ts",
  ALMACEN: "Almacen",
  CONSEJO: "Consejo",
  CONTABILIDAD: "Contabilidad"
};

export const RESOURCES = {
  PEDIDOS: "pedidos",
  RUTAS: "rutas",
  COMUNIDADES: "comunidades",
  USUARIOS: "usuarios",
  TICKETS: "tickets",
  COBRANZAS: "cobranzas"
};

const permissions = {
  [ROLES.DIRECCION]: {
    // Acceso completo a todo
    [RESOURCES.PEDIDOS]: ["create", "read", "update", "delete", "revert"],
    [RESOURCES.RUTAS]: ["create", "read", "update", "delete"],
    [RESOURCES.COMUNIDADES]: ["create", "read", "update", "delete"],
    [RESOURCES.USUARIOS]: ["create", "read", "update", "delete"],
    [RESOURCES.TICKETS]: ["create", "read", "update", "delete"],
    [RESOURCES.COBRANZAS]: ["create", "read", "update"]
  },
  [ROLES.CONSEJO]: {
    // Solo lectura general. Puede editar su propio usuario.
    [RESOURCES.PEDIDOS]: ["read"],
    [RESOURCES.RUTAS]: ["read"],
    [RESOURCES.COMUNIDADES]: ["read"],
    [RESOURCES.USUARIOS]: {
      actions: ["read", "update" ], // Solo puede modificar su propio usuario
      ownershipCheck: (user, resourceId) => user.id === Number(resourceId)
    },
    [RESOURCES.TICKETS]: ["create", "read"],
    [RESOURCES.COBRANZAS]: ["read"]
  },
  [ROLES.COORDINADORA]: {
    [RESOURCES.PEDIDOS]: {
      actions: ["create", "read", "update", "delete"], // Solo puede modificar sus propios pedidos, si se requiere se puede dejar igual que direccion para que pueda ver modificar todos los pedidos
      ownershipCheck: (user, resourceId) => user.id === Number(resourceId)
    },
    [RESOURCES.RUTAS]: ["create", "read", "update", "delete"],
    [RESOURCES.COMUNIDADES]: ["create", "read", "update", "delete"],
    [RESOURCES.USUARIOS]: {
      actions: ["read", "update" ], // Solo puede modificar su propio usuario
      ownershipCheck: (user, resourceId) => user.id === Number(resourceId)
    },
    [RESOURCES.TICKETS]: ["read"]
  },
  [ROLES.TS]: {
    [RESOURCES.PEDIDOS]: {
      actions: ["create", "read", "update", "delete"], // Solo puede modificar sus propios pedidos
      ownershipCheck: (user, resourceId) => user.id === Number(resourceId)
    },
    [RESOURCES.RUTAS]: ["read"],
    [RESOURCES.COMUNIDADES]: ["read"],
    [RESOURCES.USUARIOS]: {
      actions: ["read", "update" ], // Solo puede modificar su propio usuario
      ownershipCheck: (user, resourceId) => user.id === Number(resourceId)
    },
    [RESOURCES.TICKETS]: ["read"]
  },
  [ROLES.ALMACEN]: {
    [RESOURCES.PEDIDOS]: ["read"],
    [RESOURCES.RUTAS]: ["read"],
    [RESOURCES.COMUNIDADES]: ["read"],
    [RESOURCES.USUARIOS]: {
      actions: ["read", "update" ], // Solo puede modificar su propio usuario
      ownershipCheck: (user, resourceId) => user.id === Number(resourceId)
    },
    [RESOURCES.TICKETS]: ["read"]
  },
  [ROLES.CONTABILIDAD]: {
    [RESOURCES.PEDIDOS]: ["read"],
    [RESOURCES.RUTAS]: ["read"],
    [RESOURCES.COMUNIDADES]: ["read"],
    [RESOURCES.USUARIOS]: {
      actions: ["read", "update" ], // Solo puede modificar su propio usuario
      ownershipCheck: (user, resourceId) => user.id === Number(resourceId)
    },
    [RESOURCES.TICKETS]: ["read"],
    [RESOURCES.COBRANZAS]: ["create", "read", "update"]
  }
};

export const hasPermission = (user, resource, action, resourceOwnerId = null) => {
  if (!user?.rol) return false;

  const rolePermissions = permissions[user.rol];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  // Si es un array plano, como ["read", "update"]
  if (Array.isArray(resourcePermissions)) {
    return resourcePermissions.includes(action);
  }

  // Si tiene acciones con propiedad ownershipCheck
  if (typeof resourcePermissions === "object") {
    const hasAction = resourcePermissions.actions.includes(action);

    if (!hasAction) return false;

    if (resourcePermissions.ownershipCheck) {
      const isOwner = resourcePermissions.ownershipCheck(user, resourceOwnerId);
      return action === "read" ? true : isOwner;
    }

    return true; // No hay ownershipCheck, pero sí permiso general
  }

  return false;
};

export const puedeEditarPedido = (user, pedido) => {
  if (!user || !pedido) 
    return false;

  // Dirección puede editar todos los pedidos
  if (user.rol === ROLES.DIRECCION) 
    return true;

  // Coordinadora y TS pueden editar solo sus propios pedidos
  if ( (user.rol === ROLES.COORDINADORA || user.rol === ROLES.TS) && pedido.idTs === user.id ) 
    return true;
  
  return false;
};
