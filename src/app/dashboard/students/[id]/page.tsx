import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentById } from "@/features/students/actions";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: student } = await getStudentById(id);
  if (!student) notFound();

  const hadir = student.attendance.filter((a) => a.status === "H").length;
  const sakit = student.attendance.filter((a) => a.status === "S").length;
  const izin = student.attendance.filter((a) => a.status === "I").length;
  const alfa = student.attendance.filter((a) => a.status === "A").length;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/students" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
              {student.name.charAt(0)}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-sm text-gray-500">NIS: {student.studentId}</p>
            <p className="text-sm text-gray-500">Kelas: {student.class.name}</p>
          </div>

          <div className="mt-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 font-semibold text-gray-900">Data Orang Tua</h3>
            <dl className="space-y-2 text-sm">
              {student.fatherName && <><dt className="text-gray-500">Ayah</dt><dd className="font-medium text-gray-900">{student.fatherName}{student.fatherJob ? ` (${student.fatherJob})` : ""}</dd></>}
              {student.motherName && <><dt className="text-gray-500">Ibu</dt><dd className="font-medium text-gray-900">{student.motherName}{student.motherJob ? ` (${student.motherJob})` : ""}</dd></>}
            </dl>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-4 font-semibold text-gray-900">Informasi Siswa</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-gray-500">Alamat</dt><dd className="font-medium text-gray-900">{student.address ?? "-"}</dd></div>
              <div><dt className="text-gray-500">Tanggal Lahir</dt><dd className="font-medium text-gray-900">{student.dob ? new Date(student.dob).toLocaleDateString("id-ID") : "-"}</dd></div>
              <div><dt className="text-gray-500">No. HP</dt><dd className="font-medium text-gray-900">{student.phone ?? "-"}</dd></div>
              <div><dt className="text-gray-500">Status</dt><dd className={`font-medium ${student.isActive ? "text-green-600" : "text-red-600"}`}>{student.isActive ? "Aktif" : "Tidak Aktif"}</dd></div>
              {student.notes && <div className="col-span-2"><dt className="text-gray-500">Catatan</dt><dd className="font-medium text-gray-900">{student.notes}</dd></div>}
            </dl>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-4 font-semibold text-gray-900">Ringkasan Absensi</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: "Hadir", count: hadir, color: "green" },
                { label: "Sakit", count: sakit, color: "yellow" },
                { label: "Izin", count: izin, color: "blue" },
                { label: "Alfa", count: alfa, color: "red" },
              ].map((s) => (
                <div key={s.label} className={`rounded-lg bg-${s.color}-50 p-3`}>
                  <p className={`text-xl font-bold text-${s.color}-600`}>{s.count}</p>
                  <p className={`text-xs text-${s.color}-600`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {student.grades.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-4 font-semibold text-gray-900">Nilai</h3>
              <div className="space-y-3">
                {student.grades.map((g) => (
                  <div key={g.id} className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-gray-700">Semester {g.semester}</p>
                    <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-gray-500">STS:</span> <span className="font-medium">{g.sts ?? "-"}</span></div>
                      <div><span className="text-gray-500">SAS:</span> <span className="font-medium">{g.sas ?? "-"}</span></div>
                    </div>
                    {g.gradeBab.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1 text-xs font-medium text-gray-500">Per BAB:</p>
                        {g.gradeBab.map((b) => (
                          <span key={b.id} className="mr-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs">
                            Bab {b.bab}: {b.pengetahuanRata ?? "-"}/{b.keterampilanRata ?? "-"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
