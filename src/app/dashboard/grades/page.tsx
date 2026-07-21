import { getClasses } from "@/features/classes/actions";
import { getStudents } from "@/features/students/actions";
import { getGrades } from "@/features/grades/actions";
import { GradeForm, GradeBabForm } from "@/features/grades/components";

export default async function GradesPage({ searchParams }: { searchParams: Promise<{ classId?: string; semester?: string; studentId?: string }> }) {
  const { classId, semester, studentId } = await searchParams;
  const selectedSemester = (semester ?? "GANJIL") as "GANJIL" | "GENAP";

  const { data: classes } = await getClasses();
  const { data: students } = classId ? await getStudents(classId) : { data: [] };
  const { data: grades } = classId ? await getGrades(classId, selectedSemester) : { data: [] };

  const selectedGrade = studentId ? grades?.find((g) => g.studentId === studentId) : undefined;
  const selectedStudent = studentId ? students?.find((s) => s.id === studentId) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Penilaian</h1>
        <p className="mt-1 text-gray-500">Input nilai harian dan semester.</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <form className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select name="classId" defaultValue={classId ?? ""} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
              <option value="">Pilih kelas...</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select name="semester" defaultValue={selectedSemester} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
              <option value="GANJIL">Ganjil</option>
              <option value="GENAP">Genap</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
            <select name="studentId" defaultValue={studentId ?? ""} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
              <option value="">Pilih siswa...</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            Tampilkan
          </button>
        </form>
      </div>

      {classId && selectedStudent ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GradeForm studentId={studentId!} classId={classId} semester={selectedSemester} grade={selectedGrade ?? undefined} />

          {selectedGrade && (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-4 font-semibold text-gray-900">Nilai Per Bab</h3>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4].map((bab) => {
                  const babData = selectedGrade?.gradeBab.find((b) => b.bab === bab);
                  return (
                    <GradeBabForm key={bab} gradeId={selectedGrade.id} bab={bab} data={babData ?? undefined} />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : classId ? (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="font-semibold text-gray-900">Daftar Nilai</h3>
          </div>
          <div className="p-6 text-center text-sm text-gray-500">
            Pilih siswa untuk mulai input nilai.
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-sm text-gray-500">Pilih kelas, semester, dan siswa untuk input nilai.</p>
        </div>
      )}
    </div>
  );
}
