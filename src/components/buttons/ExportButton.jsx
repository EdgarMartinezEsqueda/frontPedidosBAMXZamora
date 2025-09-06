import { useState, useEffect, useRef } from "react";
import api from "lib/axios";

const ExportButton = ({ filters }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (isExtended) => {
    try {
      setIsLoading(true);
      setIsOpen(false);
      
      // Obtener todos los pedidos con los filtros actuales
      const { data } = await api.post("/pedidos/export", {
        params: {
          ...filters,
          extended: isExtended
        }
      });

      // Convertir a CSV
      const csvContent = convertToCSV(data, isExtended);
      
      // Descargar archivo
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { 
        type: "text/csv;charset=utf-8" // Especificar charset
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error al exportar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const convertToCSV = (data, isExtended) => {
    if (data.length === 0) return "";

    // Configurar columnas
    const baseColumns = [
      { header: "ID Pedido", accessor: "id" },
      { header: "Ruta", accessor: "ruta.nombre" },
      { header: "Fecha Entrega", accessor: "fechaEntrega" },
      { header: "Estado", accessor: "estado" },
      { header: "Trabajador", accessor: "usuario.username" }
    ];

    const extendedColumns = [
      { header: "Comunidad", accessor: "pedidoComunidad.comunidad.nombre" },
      { header: "Municipio", accessor: "pedidoComunidad.comunidad.municipio.nombre" },
      { header: "Jefa Comunidad", accessor: "pedidoComunidad.comunidad.jefa" },
      { header: "Contacto", accessor: "pedidoComunidad.comunidad.contacto" },
      { header: "Despensas Costo", accessor: "pedidoComunidad.despensasCosto" },
      { header: "Despensas Medio Costo", accessor: "pedidoComunidad.despensasMedioCosto" },
      { header: "Despensas Sin Costo", accessor: "pedidoComunidad.despensasSinCosto" },
      { header: "Despensas Apadrinadas", accessor: "pedidoComunidad.despensasApadrinadas" },
      { header: "Arpilladas", accessor: "pedidoComunidad.arpilladas" },
      { header: "Observaciones", accessor: "pedidoComunidad.observaciones" }
    ];

    const columns = isExtended 
      ? [...baseColumns, ...extendedColumns]
      : baseColumns;

    // Crear filas
    const rows = [];
    
    data.forEach(pedido => {
      if (isExtended) {
        // Versión extendida: una fila por cada pedidoComunidad
        if (pedido.pedidoComunidad?.length > 0) {
          pedido.pedidoComunidad.forEach(pc => {
            const rowData = {
              ...pedido,
              pedidoComunidad: pc // Aplanamos la estructura
            };
            rows.push(createRow(rowData, columns));
          });
        } else {
          // Caso donde no hay comunidades
          rows.push(createRow(pedido, columns));
        }
      } else {
        // Versión básica: una fila por pedido
        rows.push(createRow(pedido, columns));
      }
    });

    // Encabezados
    const headers = columns.map(col => `"${col.header}"`).join(',');
    
    return [headers, ...rows].join('\n');
  };

  // Función auxiliar para crear filas
  const createRow = (item, columns) => {
    return columns.map(col => {
      try {
        const value = col.accessor.split('.').reduce((acc, key) => {
          if (acc && typeof acc === 'object') {
            return acc[key] ?? '';
          }
          return '';
        }, item);
        
        return `"${String(value).replace(/"/g, '""')}"`;
      } catch (error) {
        return '""';
      }
    }).join(',');
  };

  return (
    <div className="relative"  ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="bg-verdeLogo text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? 'Exportando...' : 'Exportar CSV'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => handleExport(false)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Versión Básica
          </button>
          <button
            onClick={() => handleExport(true)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Versión Extendida
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;