import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { VITE_API_URL } from "../../../config/env";

/* Paleta BeeHealth */
const COLORS = {
  primary: "#6C8CD5",
  light: "#EAF0FF",
  bg: "#ffffffff",
  card: "#FFFFFF",
  text: "#1F2937",
  muted: "#9CA3AF",
};

/* puntos de colores en mes*/
const STATUS_DOT_COLORS: Record<string, string> = {
  pendiente: "#9CA3AF",
  revision: "#F59E0B",
  confirmado: "#3B82F6",
  finalizado: "#22C55E",
};

/* Colores fondo semana y dia*/
const STATUS_BG_COLORS: Record<string, string> = {
  pendiente: "#9CA3AF",
  revision: "#F59E0B",
  confirmado: "#3B82F6",
  finalizado: "#22C55E",
};

/* Colores translúcidos por status */
const STATUS_TOOLTIP_BG: Record<string, string> = {
  pendiente: "rgba(156,163,175,0.95)",
  revision: "rgba(245,158,11,0.95)",
  finalizado: "rgba(34,197,94,0.95)",
};


/* FECHA LOCAL */
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
  extendedProps: {
    status: string;
    notes?: string;
    partnerName?: string;
  };
};

export default function Overview() {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(
    toLocalDateString(new Date())
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  /* Cargar citas */
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${VITE_API_URL}/api/ticket`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
          extendedProps: {
            status: t.status,
            notes: t.notes,
            partnerName: t.partner_name,
          },
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

  const daysWithEvents = useMemo(
    () => new Set(events.map((e) => e.start.slice(0, 10))),
    [events]
  );

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
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Mi Calendario
          </h1>
          <p className="text-gray-500 text-sm">
            Visualiza y gestiona tus citas reales
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Citas este mes" value={events.length} />
          <StatCard title="Días con citas" value={daysWithEvents.size} />
          <StatCard title="Citas hoy" value={eventsOfDay.length} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* CALENDARIO */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-4 shadow">
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

              /* CONFIGURACIÓN DE HORARIOS */
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              slotDuration="00:30:00"
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              allDaySlot={false}

              /* CONFIGURACIÓN POR VISTA */
              views={{
                dayGridMonth: {
                  eventDisplay: 'none' 
                },
                timeGridWeek: {
                  eventDisplay: 'block' 
                },
                timeGridDay: {
                  eventDisplay: 'block' 
                }
              }}

              dateClick={(info) => setSelectedDate(toLocalDateString(info.date))}

              /* SEMANA Y DÍA */
              eventContent={(arg) => {
                if (arg.view.type === "dayGridMonth") return null;
                const status = arg.event.extendedProps.status;
                const bg = STATUS_BG_COLORS[status] ?? "#9CA3AF";
                const [carName, clientName] = arg.event.title.split(" · ");
                const partnerName = arg.event.extendedProps.partnerName;

                return (
                  <div
                    className="h-full w-full px-2 py-1 overflow-hidden"
                    style={{
                      background: bg,
                      color: "#fff",
                      fontSize: "11px",
                      borderRadius: "6px",
                      borderLeft: "4px solid rgba(0,0,0,0.25)",
                    }}
                  >
                    {/* VEHÍCULO */}
                    <div className="font-semibold truncate">
                      {carName}
                    </div>

                    {/* CLIENTE */}
                    <div className="text-[10px] opacity-90 truncate">
                      {clientName}
                    </div>

                    {partnerName && (
                      <div className="text-[10px] opacity-80 truncate italic">
                        🏪 {partnerName}
                      </div>
                    )}

                  </div>
                );
              }}

              eventDidMount={(info) => {
                if (info.view.type === "dayGridMonth") return;

                const [carName, clientName] = info.event.title.split(" · ");
                const partnerName = info.event.extendedProps.partnerName;

                const status = info.event.extendedProps.status;
                const notes = info.event.extendedProps.notes || "Sin notas";

                const startTime = info.event.start?.toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const endTime = info.event.end?.toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const tooltip = document.createElement("div");

                tooltip.style.position = "fixed";
                tooltip.style.zIndex = "9999";
                tooltip.style.pointerEvents = "none";
                tooltip.style.padding = "10px 12px";
                tooltip.style.borderRadius = "12px";
                tooltip.style.background =
                  STATUS_TOOLTIP_BG[status] || "rgba(0,0,0,0.85)";
                tooltip.style.color = "#fff";
                tooltip.style.fontSize = "12px";
                tooltip.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
                tooltip.style.whiteSpace = "nowrap";
                tooltip.style.display = "none";

                tooltip.innerHTML = `
    <div style="font-weight:600; margin-bottom:4px;">🚗 ${carName}</div>
    <div style="opacity:.9;">👤 ${clientName}</div>
      ${partnerName ? `<div style="opacity:.85;">🏪 ${partnerName}</div>` : ""}
    <div style="margin-top:6px; font-size:11px;">
      ⏰ ${startTime} - ${endTime}
    </div>
    <div style="margin-top:4px; font-size:11px;">
      📌 ${status}
    </div>
    <div style="margin-top:4px; font-size:11px; opacity:.85;">
      📝 ${notes}
    </div>
  `;

                document.body.appendChild(tooltip);

                const showTooltip = (e: MouseEvent) => {
                  tooltip.style.display = "block";
                  tooltip.style.left = e.clientX + 12 + "px";
                  tooltip.style.top = e.clientY + 12 + "px";
                };

                const moveTooltip = (e: MouseEvent) => {
                  tooltip.style.left = e.clientX + 12 + "px";
                  tooltip.style.top = e.clientY + 12 + "px";
                };

                const hideTooltip = () => {
                  tooltip.style.display = "none";
                };

                info.el.addEventListener("mouseenter", showTooltip);
                info.el.addEventListener("mousemove", moveTooltip);
                info.el.addEventListener("mouseleave", hideTooltip);

                // limpieza al desmontar
                return () => {
                  info.el.removeEventListener("mouseenter", showTooltip);
                  info.el.removeEventListener("mousemove", moveTooltip);
                  info.el.removeEventListener("mouseleave", hideTooltip);
                  tooltip.remove();
                };
              }}


              /* PUNTOS CELDAS DE MES */
              dayCellDidMount={(info) => {
                const dateStr = toLocalDateString(info.date);
                info.el.style.border = "none";
                info.el.style.borderRadius = "14px";

                if (dateStr === selectedDate) {
                  info.el.style.background = COLORS.primary;
                  info.el.style.color = "#fff";
                } else if (daysWithEvents.has(dateStr)) {
                  info.el.style.background = COLORS.light;
                }
              }}

              dayCellContent={(arg) => {
                if (arg.view.type !== "dayGridMonth") return arg.dayNumberText;

                const dateStr = toLocalDateString(arg.date);
                const dayEvents = events.filter(
                  (e) => e.start.slice(0, 10) === dateStr
                );

                return (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-medium">{arg.dayNumberText}</span>

                    {dayEvents.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-1">
                        {dayEvents.slice(0, 4).map((event) => {
                          const [carName, clientName] = event.title.split(" · ");
                          const partnerName = event.extendedProps.partnerName;

                          const status = event.extendedProps.status;
                          const notes = event.extendedProps.notes || "Sin notas";

                          const startTime = new Date(event.start).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          const endTime = new Date(event.end).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          let tooltip: HTMLDivElement | null = null;

                          const showTooltip = (e: React.MouseEvent) => {
                            tooltip = document.createElement("div");

                            tooltip.style.position = "fixed";
                            tooltip.style.zIndex = "9999";
                            tooltip.style.pointerEvents = "none";
                            tooltip.style.padding = "10px 12px";
                            tooltip.style.borderRadius = "12px";
                            tooltip.style.background =
                              STATUS_TOOLTIP_BG[status] || "rgba(0,0,0,0.85)";
                            tooltip.style.color = "#fff";
                            tooltip.style.fontSize = "12px";
                            tooltip.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
                            tooltip.style.whiteSpace = "nowrap";

                            tooltip.innerHTML = `
                <div style="font-weight:600;">🚗 ${carName}</div>
                <div style="opacity:.9;">👤 ${clientName}</div>
                 ${partnerName ? `<div style="opacity:.85;">🏪 ${partnerName}</div>` : ""}
                <div style="margin-top:6px;">⏰ ${startTime} - ${endTime}</div>
                <div style="margin-top:4px;">📌 ${status}</div>
                <div style="margin-top:4px;opacity:.85;">📝 ${notes}</div>
              `;

                            document.body.appendChild(tooltip);

                            tooltip.style.left = e.clientX + 12 + "px";
                            tooltip.style.top = e.clientY + 12 + "px";
                          };

                          const moveTooltip = (e: React.MouseEvent) => {
                            if (!tooltip) return;
                            tooltip.style.left = e.clientX + 12 + "px";
                            tooltip.style.top = e.clientY + 12 + "px";
                          };

                          const hideTooltip = () => {
                            if (tooltip) {
                              tooltip.remove();
                              tooltip = null;
                            }
                          };

                          return (
                            <span
                              key={event.id}
                              className="w-2 h-2 rounded-full cursor-pointer"
                              style={{
                                backgroundColor:
                                  STATUS_DOT_COLORS[event.extendedProps.status],
                              }}
                              onMouseEnter={showTooltip}
                              onMouseMove={moveTooltip}
                              onMouseLeave={hideTooltip}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }}

            />
          </div>

          {/* PANEL DERECHO */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow p-4">
            <div
              className="rounded-lg p-4 mb-4 text-white"
              style={{ background: COLORS.primary }}
            >
              <p className="font-semibold">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "es-MX",
                  { day: "numeric", month: "long" }
                )}
              </p>
              <p className="text-sm opacity-90">
                {eventsOfDay.length} cita(s)
              </p>
            </div>

            {eventsOfDay.length === 0 && (
              <p className="text-gray-400 text-sm">
                No hay citas este día
              </p>
            )}

            {eventsOfDay.map((event) => (
              <div className="border rounded-lg p-3 mb-3">
                {/* FILA SUPERIOR */}
                <div className="flex justify-between items-start">
                  <div>
                    {/* 🚗 Vehículo + Cliente */}
                    <p className="font-semibold text-gray-800">
                      {event.title}
                    </p>

                    {/* 🏪 Taller */}
                    {event.extendedProps.partnerName && (
                      <p className="text-xs text-gray-500 mt-1">
                        🏪 {event.extendedProps.partnerName}
                      </p>
                    )}
                  </div>

                  {/* ⏰ Hora */}
                  <span className="text-sm text-gray-500">
                    {event.start.slice(11, 16)}
                  </span>
                </div>

                {/* ESTADO */}
                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${event.extendedProps.status === "pendiente"
                    ? "bg-gray-100 text-gray-700"
                    : event.extendedProps.status === "revision"
                      ? "bg-yellow-100 text-yellow-700"
                      : event.extendedProps.status === "confirmado"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {t(`tickets_screen.status.${event.extendedProps.status}`)}
                </span>

                {/* NOTAS */}
                <p className="text-xs text-gray-400 mt-2">
                  {event.extendedProps.notes || "Sin notas"}
                </p>
              </div>

            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* 🔹 CARD STATS */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
