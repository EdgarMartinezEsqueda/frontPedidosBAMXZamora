import React, { useEffect } from "react";

import ResponsiveTable from "components/tables/orders/ResponsiveTable";

const TableComponent = ({ 
  mode = "view",
  data = [],
  comunidades = [], 
  onDataChange ,
  selectedRutaId
}) => {
  useEffect(() => {
    
    if (mode === "create" && comunidades.length > 0 && selectedRutaId) {
      // Filtrar comunidades por la ruta seleccionada
      const comunidadesFiltradas = comunidades.filter(
        (comunidad) => comunidad.idRuta === selectedRutaId
      );
      const initialData = {
        pedidoComunidad: comunidadesFiltradas.map((comunidad) => ({ // ✅ Agrega pedidoComunidad
          idComunidad: comunidad.id,
          comunidad: comunidad, // Guarda el objeto completo si es necesario
          encargada: comunidad.jefa,
          contacto: comunidad.contacto,
          despensasCosto: 0,
          despensasMedioCosto: 0,
          despensasSinCosto: 0,
          despensasApadrinadas: 0,
          arpilladas: false,
          observaciones: "",
          comite: 0,
        }))
      }
      
      onDataChange(initialData);
    }
  }, [mode, comunidades, selectedRutaId, onDataChange]);

  const handleChange = (index, field, value) => {
    const updatedComunidad = data.pedidoComunidad.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    const newData = {
      ...data,
      pedidoComunidad: updatedComunidad
    };
    onDataChange(newData);
  };

  return (
    <section className="container px-4 mx-auto md:py-4">
      {/* Tabla de escritorio */}
      <ResponsiveTable 
        mode={mode} 
        data={data} 
        handleChange={handleChange}
      />
    </section>
  );
};

export default TableComponent;