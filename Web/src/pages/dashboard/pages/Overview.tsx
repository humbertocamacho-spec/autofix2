import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import esLocale from "@fullcalendar/core/locales/es";
import enLocale from "@fullcalendar/core/locales/en-gb";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarEvent } from "../../../types/calendar";
import { VITE_API_URL } from "../../../config/env";

const COLORS = {
  primary: "#27B9BA",
  bg: "#F9FAFB",
  gradientBlue: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
  gradientGreen: "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)",
  gradientYellow: "linear-gradient(135deg, #F59E0B 0%, #FACC15 100%)",
  gradientGray: "linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)",
};

const STATUS_COLORS: Record<string, { lightBg: string; text: string; accent: string }> = {
  pendiente: { lightBg: "#f9fafb", text: "#4b5563", accent: "#9ca3af" },
  revision: { lightBg: "#fffbeb", text: "#78350f", accent: "#f59e0b" },
  confirmado: { lightBg: "#eff6ff", text: "#1e40af", accent: "#3b82f6" },
  finalizado: { lightBg: "#f0fdf4", text: "#065f46", accent: "#22c55e" },
};

const toLocalDateString = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 10);
};

export default function Overview() {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(toLocalDateString(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

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
          title: `${t.car_name} ${t.car_year}· ${t.client_name}`,
          start: start.toISOString().slice(0, 19),
          end: end.toISOString().slice(0, 19),
          extendedProps: {
            status: t.status,
            notes: t.notes,
            partnerName: t.partner_name,
            userDisabled: !!t.user_deleted_at,
          },
        };
      });
      setEvents(mapped);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const eventsOfDay = useMemo( () => events.filter((e) => e.start.slice(0, 10) === selectedDate), [events, selectedDate]);
  const daysWithEvents = useMemo( () => new Set(events.map((e) => e.start.slice(0, 10))), [events]);
  const calendarLocale =
  i18n.language.startsWith("es") ? esLocale : enLocale; const handleDateOrEventClick = (date: Date) => { setSelectedDate(toLocalDateString(date));};

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center py-10 text-gray-500"> {t("dashboard_layout.loading")} </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p" style={{ background: COLORS.bg }}>
        <h1 className="text-3xl font-bold mb-6 text-gray-800"> {t("overview.title_calendar")}</h1>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title={t("overview.stats.ticketsthismonth")} value={events.length} gradient={COLORS.gradientBlue}/>
          <StatCard title={t("overview.stats.dayswithtickets")} value={daysWithEvents.size} gradient={COLORS.gradientGreen}/>
          <StatCard title={t("overview.stats.ticketsoftoday")} value={eventsOfDay.length} gradient={COLORS.gradientYellow}/>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow border border-gray-200 overflow-auto">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              timeZone="local"
              locale={calendarLocale}
              events={events}
              height="75vh"
              expandRows={false}
              contentHeight="auto"
              stickyHeaderDates={true}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              slotDuration="00:30:00"
              nowIndicator={true}
              eventOverlap={false}
              slotEventOverlap={false}
              dayMaxEvents={4}
              moreLinkClick="popover"
              eventMaxStack={4}
              eventMinHeight={44}
              eventShortHeight={44}
              allDayText={t("overview.allday")}
              dateClick={(info) => handleDateOrEventClick(info.date)}
              eventClick={(info) => handleDateOrEventClick(info.event.start!)}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridDay,timeGridWeek,dayGridMonth",
              }}
              buttonText={{
                today: t("overview.today"),
                day: t("overview.day"),
                week: t("overview.week"),
                month: t("overview.month"),
              }}
              eventContent={(arg) => {
                const { status } = arg.event.extendedProps;
                const [carName, clientName] = arg.event.title.split(" · ");
                const color = STATUS_COLORS[status];

                const time = arg.event.start ? new Date(arg.event.start).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", }) : "";

                return (
                  <div className="h-full w-full px-2 py-1 rounded-lg relative overflow-hidden" style={{ backgroundColor: color.lightBg }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: color.accent }} />

                    <div className="ml-2 font-semibold text-sm text-black leading-tight"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {carName}
                    </div>

                    <div className="ml-2 text-xs text-black leading-tight"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {clientName}
                    </div>

                    <div className="ml-2 text-[11px] text-black leading-tight">
                      {time}
                    </div>
                  </div>
                );
              }}
            />

            <style>{`

            .fc-toolbar-chunk {
              display: flex;
              gap: 8px;
            }

            .fc-button-group {
              gap: 6px;
            }

            .fc-button-group > .fc-button {
              border-radius: 0.5rem !important;
            }

            .fc {
              --fc-border-color: #e5e7eb;
            }
            .fc-view-harness {
              overflow-y: auto;
            }
            .fc-timegrid-slot {
              height: 60px !important;
            }
            .fc-timegrid-slot-label {
              font-size: 0.75rem;
              color: #6b7280;
            }
            .fc-timegrid-event-harness {
              margin-right: 2px;
            }
            .fc-timegrid-event {
              border: none !important;
              border-radius: 10px !important;
              margin: 2px 2px !important;
              box-shadow: 0 1px 4px rgba(0,0,0,0.08);
              overflow: hidden !important;
              width: auto !important;
            }
            .fc-event-main {
              white-space: normal !important;
              line-height: 1.35;
              padding: 4px 6px;
            }
            .fc-event:hover {
              transform: scale(1.01);
              box-shadow: 0 6px 18px rgba(0,0,0,0.15);
              transition: all 0.2s ease;
            }
            .fc-col-header-cell {
              background: #f8fafc;
              color: #374151;
              font-weight: 600;
              padding: 10px 6px;
            }
            .fc-day-today {
              background-color: #fefce8 !important;
            }
            .fc-button {
              background: #27B9BA !important;
              border: none !important;
              border-radius: 0.5rem !important;
              padding: 0.35rem 0.75rem !important;
              font-weight: 500;
            }
            .fc-button:hover {
              background: #1da5a6 !important;
            }
            .fc-button.fc-button-active {
              background: #1f9f9f !important;
            }
            .fc-more-link {
              background: #eff6ff;
              color: #3b82f6;
              font-weight: 600;
              border-radius: 999px;
              padding: 2px 8px;
              font-size: 0.75rem;
            }
            .fc-popover {
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            }
            .fc-daygrid-event {
              overflow: hidden !important;
            }
            .fc-daygrid-event .fc-event-main {
              padding: 4px 6px;
            }
            .fc-daygrid-event .fc-event-title,
            .fc-daygrid-event .fc-event-main-frame {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal !important;
              line-height: 1.2;
              font-size: 0.75rem;
            }
            .fc-daygrid-event .text-xs,
              display: none !important;
            }
            `}</style>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="rounded-xl p-4 mb-6 text-white -mx-6 -mt-6" style={{ background: COLORS.primary }}>
              <p className="text-xl font-bold">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  i18n.language === "es" ? "es-MX" : "en-US",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  }
                )}
              </p>
              <p className="text-sm opacity-90 mt-1">
                {eventsOfDay.length} {t("overview.tickets")}
              </p>
            </div>

            {eventsOfDay.length === 0 ? (
              <p className="text-center py-10 text-gray-500">
                {t("overview.no_tickets_today")}
              </p>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                {eventsOfDay.map((event) => {
                  const color =
                    STATUS_COLORS[event.extendedProps.status];
                  return (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
                      style={{ background: "#fafafa" }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {event.title}
                          </p>
                          {event.extendedProps.partnerName && (
                            <p className="text-xs text-gray-500 mt-1">
                              🏪 {event.extendedProps.partnerName}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {event.start.slice(11, 16)}
                        </span>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: color.lightBg,
                          color: color.accent,
                        }}
                      >
                        {t(
                          `tickets_screen.status.${event.extendedProps.status}`
                        )}
                      </span>
                      <p className="text-xs text-gray-400 mt-2">
                        {event.extendedProps.notes || "Sin notas"}
                      </p>
                      {event.extendedProps.userDisabled && (
                        <p className="text-xs text-red-500 mt-1">
                          {t("tickets_screen.status.label")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title, value, gradient,
}: {
  title: string; value: number; gradient: string;
}) {
  return (
    <div className="rounded-2xl p-4 shadow-lg text-white" style={{ background: gradient }}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
