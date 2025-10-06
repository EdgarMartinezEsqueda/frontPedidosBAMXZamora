import { format, getDay, parse, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router";

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
      ...evento,
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-4">
      <style>{`
        /* Estilos generales del calendario */
        .dark .rbc-calendar {
          background-color: #1f2937;
          color: #e5e7eb;
        }
        
        /* Encabezado del calendario */
        .dark .rbc-toolbar {
          color: #e5e7eb;
        }
        
        .dark .rbc-toolbar button {
          color: #e5e7eb;
          border-color: #4b5563;
          background-color: #374151;
        }
        
        .dark .rbc-toolbar button:hover {
          background-color: #4b5563;
        }
        
        .dark .rbc-toolbar button:active,
        .dark .rbc-toolbar button.rbc-active {
          background-color: #10b981;
          border-color: #10b981;
        }
        
        /* Encabezados de mes */
        .dark .rbc-header {
          background-color: #374151;
          color: #e5e7eb;
          border-color: #4b5563;
        }
        
        /* Celdas del calendario */
        .dark .rbc-day-bg {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        
        .dark .rbc-off-range-bg {
          background-color: #111827;
        }
        
        .dark .rbc-today {
          background-color: #1e40af20;
        }
        
        /* Números de los días */
        .dark .rbc-date-cell {
          color: #e5e7eb;
        }
        
        .dark .rbc-off-range {
          color: #6b7280;
        }
        
        /* Vista de mes */
        .dark .rbc-month-view {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        
        .dark .rbc-month-row {
          border-color: #4b5563;
        }
        
        /* Vista de semana y día */
        .dark .rbc-time-view {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        
        .dark .rbc-time-header {
          background-color: #374151;
          border-color: #4b5563;
        }
        
        .dark .rbc-time-content {
          border-color: #4b5563;
        }
        
        .dark .rbc-time-slot {
          border-color: #4b5563;
        }
        
        .dark .rbc-day-slot {
          border-color: #4b5563;
        }
        
        /* Eventos */
        .dark .rbc-event {
          color: white;
        }
        
        .dark .rbc-event-label {
          color: #e5e7eb;
        }
        
        .dark .rbc-show-more {
          background-color: #374151;
          color: #60a5fa;
        }
        
        .dark .rbc-show-more:hover {
          background-color: #4b5563;
        }
        
        /* Selector de eventos */
        .dark .rbc-overlay {
          background-color: #374151;
          border-color: #4b5563;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }
        
        .dark .rbc-overlay-header {
          background-color: #4b5563;
          color: #e5e7eb;
          border-color: #6b7280;
        }
        
        /* Agenda view */
        .dark .rbc-agenda-view {
          background-color: #1f2937;
          color: #e5e7eb;
        }
        
        .dark .rbc-agenda-view table {
          border-color: #4b5563;
        }
        
        .dark .rbc-agenda-date-cell,
        .dark .rbc-agenda-time-cell {
          color: #e5e7eb;
        }
        
        .dark .rbc-agenda-event-cell {
          color: #e5e7eb;
        }
      `}</style>
      
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
          timeGrid: () => null,
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