import { getClasses } from "@/features/classes/actions";
import { getSavingsSummary, getSavings, getWithdrawals } from "@/features/savings/actions";
import { SavingForm, KasForm } from "@/features/savings/components";

export default async function SavingsPage({ searchParams }: { searchParams: Promise<{ classId?: string }> }) {
  const { classId } = await searchParams;
  const { data: classes } = await getClasses();
  const { data: summary } = classId ? await getSavingsSummary(classId) : { data: [] };
  const { data: withdrawals } = await getWithdrawals();

  const totalSetor = summary?.reduce((sum: number, s: any) => {
    return sum + s.Saving.filter((sv: any) => sv.amountIn).reduce((a: number, b: any) => a + (b.amountIn ?? 0), 0);
  }, 0) ?? 0;

  const totalTarik = summary?.reduce((sum: number, s: any) => {
    return sum + s.Saving.filter((sv: any) => sv.amountOut).reduce((a: number, b: any) => a + (b.amountOut ?? 0), 0);
  }, 0) ?? 0;

  const totalKasKeluar = withdrawals?.reduce((sum: number, w: any) => sum + w.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tabungan Siswa</h1>
        <p className="mt-1 text-gray-500">Kelola tabungan dan kas siswa.</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <form className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select name="classId" defaultValue={classId ?? ""} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
              <option value="">Semua Kelas</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            Tampilkan
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-5 shadow-sm">
          <p className="text-sm text-blue-600">Total Setor</p>
          <p className="text-xl font-bold text-blue-800">Rp {totalSetor.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-5 shadow-sm">
          <p className="text-sm text-orange-600">Total Tarik</p>
          <p className="text-xl font-bold text-orange-800">Rp {totalTarik.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-xl bg-red-50 p-5 shadow-sm">
          <p className="text-sm text-red-600">Kas Keluar</p>
          <p className="text-xl font-bold text-red-800">Rp {totalKasKeluar.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SavingForm students={(summary ?? []).map((s) => ({ id: s.id, name: s.name }))} />
        <KasForm />
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="font-semibold text-gray-900">Riwayat Tabungan</h3>
        </div>
        {classId && summary && summary.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {summary.map((s) => {
              const saldo = s.Saving.reduce((a: number, b: any) => a + (b.amountIn ?? 0) - (b.amountOut ?? 0), 0);
              return (
                <div key={s.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.studentId}</p>
                  </div>
                  <span className={`font-semibold ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Rp {saldo.toLocaleString("id-ID")}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-gray-500">
            {classId ? "Belum ada data tabungan." : "Pilih kelas untuk melihat riwayat."}
          </div>
        )}
      </div>
    </div>
  );
}
