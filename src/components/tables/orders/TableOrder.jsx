import ResponsiveTable from "components/tables/orders/ResponsiveTable";
import { useEffect } from "react";

const TableComponent = ({ mode = "view", data = [], comunidades = [],  onDataChange, selectedRutaId, esRutaVoluntariado = false }) => {
  useEffect(() => {
    if (mode === "create" && comunidades.length > 0 && selectedRutaId) {
      // Filtrar comunidades por la ruta seleccionada
      const comunidadesFiltradas = comunidades.filter(
        (comunidad) => comunidad.idRuta === selectedRutaId
      );

      const initialData = {
        pedidoComunidad: comunidadesFiltradas.map((comunidad) => {
          const baseData = {
            idComunidad: comunidad.id,
            comunidad: comunidad,
            encargada: comunidad.jefa,
            contacto: comunidad.contacto,
            arpilladas: false,
            observaciones: "",
            comite: 0,
            despensasCosto: 0,
            despensasMedioCosto: 0,
            despensasSinCosto: 0,
            despensasApadrinadas: 0,
          };

          return esRutaVoluntariado
            ? { ...baseData, despensasVoluntariado: 0 }
            : baseData;
        }),
      };
      
      onDataChange(initialData);
    }
  }, [mode, comunidades, selectedRutaId, onDataChange, esRutaVoluntariado]);

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
      <ResponsiveTable 
        mode={mode} 
        data={data} 
        handleChange={handleChange}
        esRutaVoluntariado={esRutaVoluntariado}
      />
    </section>
  );
};

export default TableComponent;