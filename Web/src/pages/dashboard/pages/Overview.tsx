import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { VITE_API_URL } from "../../../config/env";

const COLORS = {
  primary: "#27B9BA",
  bg: "#F9FAFB",
  card: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  gradientBlue: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
  gradientGreen: "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)",
  gradientYellow: "linear-gradient(135deg, #F59E0B 0%, #FACC15 100%)",
  gradientGray: "linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)",
};

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  pendiente: { dot: "#9CA3AF", bg: COLORS.gradientGray, text: "#374151" },
  revision: { dot: "#F59E0B", bg: COLORS.gradientYellow, text: "#78350F" },
  confirmado: { dot: "#3B82F6", bg: COLORS.gradientBlue, text: "#1E3A8A" },
  finalizado: { dot: "#22C55E", bg: COLORS.gradientGreen, text: "#065F46" },
};

const toLocalDateString = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 10);
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: { status: string; notes?: string; partnerName?: string };
};

export default function Overview() {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(toLocalDateString(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${VITE_API_URL}/api/ticket`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      const mapped: CalendarEvent[] = data.map((t: any) => {
        const start = new Date(t.date);
        const end = new Date(start.getTime() + 30 * 60000);
        return {
          id: t.id.toString(),
          title: `${t.car_name} · ${t.client_name}`,
          start: start.toISOString(),
          end: end.toISOString(),
          extendedProps: { status: t.status, notes: t.notes, partnerName: t.partner_name },
        };
      });
      setEvents(mapped);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const eventsOfDay = useMemo(
    () => events.filter((e) => e.start.slice(0, 10) === selectedDate),
    [events, selectedDate]
  );

  const daysWithEvents = useMemo(() => new Set(events.map((e) => e.start.slice(0, 10))), [events]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-500">Cargando calendario…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6" style={{ background: COLORS.bg }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mi Calendario</h1>
          <p className="text-gray-500 text-sm">Visualiza y gestiona tus citas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Citas este mes" value={events.length} gradient={COLORS.gradientBlue} />
          <StatCard title="Días con citas" value={daysWithEvents.size} gradient={COLORS.gradientGreen} />
          <StatCard title="Citas hoy" value={eventsOfDay.length} gradient={COLORS.gradientYellow} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-lg p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="es"
              height="auto"
              events={events}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{ today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
              themeSystem="standard"
              dateClick={(info) => setSelectedDate(toLocalDateString(info.date))}
              titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
              dayCellContent={(arg) => {
                const dateStr = toLocalDateString(arg.date);
                const dayEvents = events.filter((e) => e.start.slice(0, 10) === dateStr);
                return (
                  <div className="h-full flex flex-col items-center pt-1">
                    <span
                      className={`text-sm font-medium ${
                        dateStr === selectedDate ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {arg.dayNumberText}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-1 px-1">
                        {dayEvents.slice(0, 4).map((event) => (
                          <span
                            key={event.id}
                            className="w-2 h-2 rounded-full shadow-sm"
                            style={{ backgroundColor: STATUS_COLORS[event.extendedProps.status].dot }}
                          />
                        ))}
                        {dayEvents.length > 4 && (
                          <span className="text-xs text-gray-500">+{dayEvents.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              }}
              eventContent={(arg) => {
                const { status, partnerName } = arg.event.extendedProps;
                const [carName, clientName] = arg.event.title.split(" · ");
                const color = STATUS_COLORS[status] || STATUS_COLORS.pendiente;
                return (
                  <div
                    className="h-full w-full px-3 py-2 rounded-xl overflow-hidden shadow-md flex flex-col justify-center"
                    style={{
                      background: color.bg,
                      color: color.text,
                      border: `1px solid ${color.dot}`,
                    }}
                  >
                    <div className="font-semibold truncate text-sm">{carName}</div>
                    <div className="truncate text-xs">{clientName}</div>
                    {partnerName && <div className="truncate text-xs italic">🏪 {partnerName}</div>}
                  </div>
                );
              }}
              dayHeaderContent={(arg) => (
                <div className="text-[#27B9BA] font-semibold">{arg.text}</div>
              )}
              dayCellDidMount={(info) => {
                info.el.style.borderRadius = "12px";
                const dateStr = toLocalDateString(info.date);
                if (dateStr === selectedDate) {
                  info.el.style.background = "#27B9BA";
                  info.el.style.color = "#fff";
                } else if (daysWithEvents.has(dateStr)) {
                  info.el.style.background = "rgba(39,185,186,0.15)";
                } else {
                  info.el.style.background = "#f9fafb";
                }
              }}
            />

            <style>
            {`
              /* Título del mes con mayúscula */
              .fc-toolbar-title {
                color: #1f2937;
                font-weight: 600;
                text-transform: capitalize !important;
              }

              /* Botones sin borde */
              .fc-button {
                background: linear-gradient(135deg, #3B82F6, #60A5FA) !important;
                color: white !important;
                border-radius: 0.5rem !important;
                border: none !important;
                font-weight: 500;
                padding: 0.4rem 0.8rem;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .fc-button:hover {
                background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
              }
              .fc-button.fc-button-active {
                background: linear-gradient(135deg, #22c55e, #4ade80) !important;
              }

              /* VISTA MENSUAL: Forzar que los eventos llenen TODO el espacio disponible */
              .fc-daygrid-day-frame {
                padding: 2px !important; /* Mínimo padding para respirar */
                height: 100% !important;
                display: flex;
                flex-direction: column;
              }

              .fc-daygrid-day-events {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 2px; /* Espacio entre eventos cuando hay varios */
                margin-top: 4px;
              }

              .fc-daygrid-event-harness {
                flex: 1 !important; /* Cada evento crece para llenar el espacio disponible */
                min-height: 0; /* Permite que se ajuste */
              }

              .fc-daygrid-event {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                border-radius: 0.75rem !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              /* Cuando hay más de un evento, que cada uno ocupe su parte proporcional */
              .fc-daygrid-day-events:has(.fc-daygrid-event-harness:nth-child(n+2)) .fc-daygrid-event-harness {
                flex: 1 1 0;
              }

              /* VISTAS SEMANA Y DÍA */
              .fc-timegrid-event {
                border-radius: 0.75rem !important;
                margin: 2px 4px !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
              }

              /* Hover en eventos */
              .fc-event:hover {
                transform: translateY(-2px);
                transition: 0.2s ease;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
              }
            `}
            </style>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow-lg p-4">
            <div className="rounded-xl p-4 mb-4 text-white" style={{ background: COLORS.primary }}>
              <p className="font-semibold">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
              </p>
              <p className="text-sm opacity-90">{eventsOfDay.length} cita(s)</p>
            </div>

            {eventsOfDay.length === 0 && <p className="text-gray-400 text-sm">No hay citas este día</p>}

            {eventsOfDay.map((event) => {
              const color = STATUS_COLORS[event.extendedProps.status];
              return (
                <div key={event.id} className="border rounded-xl p-3 mb-3 shadow-sm" style={{ background: "#FAFAFA" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{event.title}</p>
                      {event.extendedProps.partnerName && (
                        <p className="text-xs text-gray-500 mt-1">🏪 {event.extendedProps.partnerName}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{event.start.slice(11, 16)}</span>
                  </div>
                  <span
                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {t(`tickets_screen.status.${event.extendedProps.status}`)}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">{event.extendedProps.notes || "Sin notas"}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, gradient }: { title: string; value: number; gradient: string }) {
  return (
    <div className="rounded-2xl p-4 shadow-lg text-white" style={{ background: gradient }}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
