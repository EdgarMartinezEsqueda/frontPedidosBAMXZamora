# 🍎 Plataforma de Gestión de Pedidos - BAMX Tepatitlán

Sistema para administrar pedidos de despensas, optimizando la logística del Banco de Alimentos de México (BAMX) en Tepatitlán.

## 📌 Tabla de Contenidos
- [🍎 Plataforma de Gestión de Pedidos - BAMX Tepatitlán](#-plataforma-de-gestión-de-pedidos---bamx-tepatitlán)
  - [📌 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🌟 Funcionalidades Clave](#-funcionalidades-clave)
    - [✅ Gestión de Pedidos](#-gestión-de-pedidos)
    - [📊 Reportes Administrativos](#-reportes-administrativos)
    - [🔒 Control de Acceso por Roles](#-control-de-acceso-por-roles)
    - [🔄 Componentes Reutilizables](#-componentes-reutilizables)
  - [🛠️ Tecnologías](#️-tecnologías)
  - [🔐 Roles del Sistema](#-roles-del-sistema)
  - [📥 Instalación](#-instalación)
  - [📂 Estructura del Proyecto](#-estructura-del-proyecto)
  - [📌 Próximas Mejoras](#-próximas-mejoras)
  - [🤝 Contribución](#-contribución)
  - [📜 Licencia](#-licencia)

## 🌟 Funcionalidades Clave

### ✅ Gestión de Pedidos
- Creación, edición y seguimiento de pedidos de despensas
- Filtros por ruta, comunidad o trabajador social

### 📊 Reportes Administrativos
- Resumen general (métricas clave)
- Despensas entregadas (por fecha/comunidad)
- Rutas y cobertura geográfica
- Rendimiento de trabajadores sociales

### 🔒 Control de Acceso por Roles
- 4 roles con permisos diferenciados (Dirección, Coordinación, TS, Almacén)

### 🔄 Componentes Reutilizables
- Tablas dinámicas (paginación, filtros)
- Formularios para pedidos/comunidades/rutas

## 🛠️ Tecnologías

| Área           | Tecnologías         |
|----------------|---------------------|
| Frontend       | React.js + Vite, TailwindCSS |
| Backend        | NodeJS              |
| Autenticación  | JWT                 |
| Deploy         | VPS Ubuntu          |

## 🔐 Roles del Sistema

| Rol            | Permisos                                                                 |
|----------------|--------------------------------------------------------------------------|
| Dirección      | Acceso completo a todas las funcionalidades                             |
| Coordinadora   | Gestiona comunidades y rutas                                            |
| TS             | Ver/editar sus pedidos y crear nuevos                                   |
| Almacén        | Solo consulta pedidos (lectura)                                         |

## 📥 Instalación
*(Próximamente...)*

## 📂 Estructura del Proyecto

```plaintext
src/  
├── assets/               # Imágenes estaticas  
├── components/           # Componentes reutilizables  
├── context/              # Context API para gestión de estado de autenticación
├── hooks/                # Hooks personalizados
├── lib/                  # Axios y configuración de API
├── pages/                # Vistas principales  
├── utils/                # Validación de roles  
└── App.jsx               # Componente principal
```

## 📌 Próximas Mejoras
- 🗺️ Integrar Google Maps para visualización de rutas
- 📱 Notificaciones por WhatsApp (usando Twilio/API)
- 📤 Exportar reportes a PDF/Excel

## 🤝 Contribución
*(Próximamente...)*

## 📜 Licencia
**MIT** - [MIT License](https://opensource.org/licenses/MIT)

---

✨ **Impacto Social**: Cada línea de código ayuda a distribuir alimentos eficientemente en comunidades necesitadas.