import { getClasses } from "@/features/classes/actions";
import { getStudents } from "@/features/students/actions";

export default async function StudentsPage() {
  const { data: classes } = await getClasses();
  const { data: students } = await getStudents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
        <p className="mt-1 text-gray-500">Kelola data siswa per kelas.</p>
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="font-semibold text-gray-900">Daftar Siswa</h3>
          <div className="flex items-center gap-2">
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Semua Kelas</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {!students || students.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">
              Belum ada data siswa.
            </p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">NIS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Orang Tua</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">No. HP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.class?.name ?? "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.fatherName ?? s.motherName ?? "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.phone ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
