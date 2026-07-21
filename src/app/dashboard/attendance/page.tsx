import { getClasses } from "@/features/classes/actions";
import { getStudents } from "@/features/students/actions";
import { getAttendance } from "@/features/attendance/actions";
import { AttendanceSheet } from "@/features/attendance/components";

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ classId?: string; date?: string }> }) {
  const { classId, date } = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const selectedClass = classId ?? "";
  const selectedDate = date ?? today;

  const { data: classes } = await getClasses();
  const { data: students } = selectedClass ? await getStudents(selectedClass) : { data: [] };
  const { data: existing } = selectedClass ? await getAttendance(selectedClass, selectedDate) : { data: [] };

  const counts = { H: 0, S: 0, I: 0, A: 0 };
  existing?.forEach((a: { status: keyof typeof counts }) => { counts[a.status]++; });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Absensi</h1>
        <p className="mt-1 text-gray-500">Catat kehadiran siswa harian.</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <form className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select name="classId" defaultValue={selectedClass} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
              <option value="">Pilih kelas...</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input type="date" name="date" defaultValue={selectedDate} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm" />
          </div>
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            Tampilkan
          </button>
        </form>
      </div>

      {selectedClass && (
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: "Hadir", count: counts.H, color: "green" },
            { label: "Sakit", count: counts.S, color: "yellow" },
            { label: "Izin", count: counts.I, color: "blue" },
            { label: "Alfa", count: counts.A, color: "red" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl bg-${stat.color}-50 p-4 shadow-sm`}>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</p>
              <p className={`text-sm text-${stat.color}-600`}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {selectedClass && students ? (
        <AttendanceSheet
          classId={selectedClass}
          date={selectedDate}
          students={students as { id: string; studentId: string; name: string }[]}
          existing={(existing ?? []).map((a: { studentId: string; status: string }) => ({ studentId: a.studentId, status: a.status }))}
        />
      ) : (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-sm text-gray-500">Pilih kelas dan tanggal untuk memulai absensi.</p>
        </div>
      )}
    </div>
  );
}
