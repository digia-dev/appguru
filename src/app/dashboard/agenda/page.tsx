import { getClasses } from "@/features/classes/actions";
import { getWeeklyAgenda } from "@/features/agenda/actions";
import { AgendaForm, DuplicateWeekForm } from "@/features/agenda/components";

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week } = await searchParams;
  const today = new Date();
  const weekStart = week ? new Date(week) : getWeekStart(today);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekStartStr = formatDate(weekStart);
  const weekEndStr = formatDate(weekEnd);

  const { data: classes } = await getClasses();
  const { data: activities } = await getWeeklyAgenda(weekStartStr, weekEndStr);

  const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const prevWeek = new Date(weekStart);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(weekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda Harian</h1>
          <p className="mt-1 text-gray-500">Atur jadwal pembelajaran harian.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <a href={`/dashboard/agenda?week=${formatDate(prevWeek)}`} className="rounded-lg border px-3 py-1.5 text-gray-600 hover:bg-gray-50">
            &larr; Sebelum
          </a>
          <span className="font-medium text-gray-900">
            {days[0].toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {days[6].toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <a href={`/dashboard/agenda?week=${formatDate(nextWeek)}`} className="rounded-lg border px-3 py-1.5 text-gray-600 hover:bg-gray-50">
            Berikut &rarr;
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <AgendaForm classes={(classes ?? []).map((c) => ({ id: c.id, name: c.name }))} />
          <DuplicateWeekForm />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="grid grid-cols-7 border-b text-center text-xs font-medium text-gray-500">
              {dayNames.map((day) => (
                <div key={day} className="border-r px-2 py-3 last:border-r-0">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const dayStr = formatDate(day);
                const dayActivities = activities?.filter(
                  (a) => formatDate(new Date(a.eventDate)) === dayStr,
                ) ?? [];

                return (
                  <div key={i} className={`min-h-32 border-r border-b p-2 last:border-r-0 ${formatDate(day) === formatDate(today) ? "bg-indigo-50" : ""}`}>
                    <p className={`mb-1 text-xs font-semibold ${formatDate(day) === formatDate(today) ? "text-indigo-600" : "text-gray-500"}`}>
                      {day.getDate()}
                    </p>
                    {dayActivities.length === 0 ? (
                      <p className="text-[10px] text-gray-300">-</p>
                    ) : (
                      <div className="space-y-1">
                        {dayActivities.map((a) => (
                          <div key={a.id} className="rounded bg-indigo-100 px-1.5 py-1 text-[10px] leading-tight">
                            <span className="font-medium text-indigo-700">{a.startTime}-{a.endTime}</span>
                            <span className="block text-gray-600">{a.class.name}{a.notes ? `: ${a.notes.slice(0, 20)}${a.notes.length > 20 ? "..." : ""}` : ""}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
