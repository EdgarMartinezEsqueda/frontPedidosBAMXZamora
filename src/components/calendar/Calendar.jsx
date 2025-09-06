import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";

// Configuración correcta del localizador
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = ({ eventos }) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const navigate = useNavigate();
  
  const formattedEvents = eventos.map(evento => {
    const [year, month, day] = evento.fecha.split("-").map(Number);
    const startDate = new Date(year, month - 1, day);
    
    return {
      ...evento, // Mantenemos todas las propiedades originales
      title: `${evento.ruta} - ${evento.totalDespensas} despensas`,
      start: startDate,
      end: startDate,
      allDay: true,
    };
  });

  const handleEventClick = (event) => {
    navigate(`/pedido/${event.id}`);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        culture="es"
        views={["month", "week", "day"]}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={handleEventClick}
        messages={{
          today: "Hoy",
          previous: "Anterior",
          next: "Siguiente",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        components={{
          timeGutter: () => null,
          timeGrid: ()  => null,
          week: {
            header: ({ date }) => (
              <div className="rbc-header text-sm p-2">
                {format(date, "eeee d", { locale: es })}
              </div>
            )
          },
          day: {
            header: ({ date }) => (
              <div className="rbc-header text-sm p-2">
                {format(date, "eeee d 'de' MMMM", { locale: es })}
              </div>
            )
          }
        }}
        className={`[&_.rbc-time-view]:!block [&_.rbc-time-content]:!block ${view === "week" || view === "day" ? "calendar-weekday-view" : ""}`}
        dayLayoutAlgorithm="no-overlap"
        formats={{
          dayRangeHeaderFormat: ({ start, end }) => 
            `${format(start, "d 'de' MMMM", { locale: es })} - ${format(end, "d 'de' MMMM", { locale: es })}`
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.estado === "finalizado" ? "#10B981" : "#FB7185",
            borderRadius: "4px",
            border: "none",
            color: "white",
            padding: "2px 8px",
            fontSize: "0.8rem",
            width: "100%",
            margin: "2px 0",
            left: "0 !important",
            top: "0 !important",
            cursor: "pointer"
          }
        })}
      />
    </div>
  );
};

export default CalendarComponent;