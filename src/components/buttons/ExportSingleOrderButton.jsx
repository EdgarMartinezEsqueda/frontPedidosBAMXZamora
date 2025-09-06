const ExportSingleOrderButton = ({ pedido }) => {
  const handleExport = () => {
    const csvContent = convertToCSV(pedido);
    const bom = '\uFEFF'; // Byte Order Mark para Excel
    const blob = new Blob([bom + csvContent], { 
      type: "text/csv;charset=utf-8"
    });
    
    // Método manual sin file-saver
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido_${pedido.id}_detalle.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (pedido) => {
    const columns = [
      { header: "ID Pedido", accessor: "id" },
      { header: "Ruta", accessor: "ruta.nombre" },
      { header: "Fecha Entrega", accessor: "fechaEntrega" },
      { header: "Estado", accessor: "estado" },
      { header: "Trabajador", accessor: "usuario.username" },
      { header: "Comunidad", accessor: "pedido.pedidoComunidad.comunidad.nombre" },
      { header: "Municipio", accessor: "pedido.pedidoComunidad.comunidad.municipio.nombre" },
      { header: "Jefa Comunidad", accessor: "pedido.pedidoComunidad.comunidad.jefa" },
      { header: "Contacto", accessor: "pedido.pedidoComunidad.comunidad.contacto" },
      { header: "Despensas Costo", accessor: "pedido.pedidoComunidad.despensasCosto" },
      { header: "Despensas Medio Costo", accessor: "pedido.pedidoComunidad.despensasMedioCosto" },
      { header: "Despensas Sin Costo", accessor: "pedido.pedidoComunidad.despensasSinCosto" },
      { header: "Despensas Apadrinadas", accessor: "pedido.pedidoComunidad.despensasApadrinadas" },
      { header: "Arpilladas", accessor: "pedido.pedidoComunidad.arpilladas" },
      { header: "Observaciones", accessor: "pedido.pedidoComunidad.observaciones" }
    ];

    const headers = columns.map(c => `"${c.header}"`).join(',');
    const rows = [];

    // Crear una fila por cada comunidad en el pedido
    pedido.pedidoComunidad.forEach(pc => {
      const row = columns.map(col => {
        const value = col.accessor.split('.').reduce((acc, key) => {
          if (key === 'pedidoComunidad') return pc;
          return acc ? acc[key] : null;
        }, pedido);
        
        return `"${String(value || '').replace(/"/g, '""')}"`;
      });
      rows.push(row.join(','));
    });

    return [headers, ...rows].join('\n');
  };

  return (
    <div className="relative" >
      <button 
        onClick={handleExport}
        className="bg-verdeLogo text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 cursor-pointer"
      >
        Exportar a CSV
      </button>
    </div>
  );
};

export default ExportSingleOrderButton;