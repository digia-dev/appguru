import { getClasses } from "@/features/classes/actions";
import { ClassForm } from "@/features/classes/components";

export default async function ClassesPage() {
  const { data: classes } = await getClasses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
        <p className="mt-1 text-gray-500">Kelola data kelas yang Anda ajar.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ClassForm />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900">Daftar Kelas</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {!classes || classes.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-gray-500">
                  Belum ada kelas. Tambah kelas baru di samping.
                </p>
              ) : (
                classes.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{cls.name}</p>
                      <p className="text-sm text-gray-500">
                        Tingkat {cls.level} - Bagian {cls.section}
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      {cls.level}.{cls.section}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
