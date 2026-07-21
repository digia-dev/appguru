import { notFound } from "next/navigation";
import Link from "next/link";
import { getClassById } from "@/features/classes/actions";
import { DeleteClassButton } from "@/features/classes/delete-button";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: cls } = await getClassById(id);
  if (!cls) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/classes" className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Kelas {cls.name}</h1>
          <p className="mt-1 text-gray-500">Tingkat {cls.level} - Bagian {cls.section}</p>
        </div>
        <DeleteClassButton id={id} />
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="font-semibold text-gray-900">Daftar Siswa ({cls.students.length})</h3>
          <Link href={`/dashboard/students?classId=${id}`} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            + Tambah Siswa
          </Link>
        </div>

        <div className="overflow-x-auto">
          {cls.students.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">Belum ada siswa di kelas ini.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">NIS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Orang Tua</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">No. HP</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cls.students.filter(s => !s.deletedAt).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.fatherName ?? s.motherName ?? "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.phone ?? "-"}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link href={`/dashboard/students/${s.id}`} className="font-medium text-indigo-600 hover:text-indigo-700">Detail</Link>
                    </td>
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
