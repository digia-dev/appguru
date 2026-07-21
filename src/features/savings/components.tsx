"use client";

import { useActionState } from "react";
import { createSaving, createWithdrawal } from "./actions";

export function SavingForm({ students }: { students: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createSaving(formData),
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="font-semibold text-gray-900">Setor Tabungan</h3>

      {state?.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Siswa</label>
        <select name="studentId" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
          <option value="">Pilih siswa...</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Jumlah Setor (Rp)</label>
          <input type="number" name="amountIn" min={0} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal</label>
          <input type="date" name="date" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Keterangan</label>
        <input name="notes" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
      </div>

      <button type="submit" disabled={pending} className="w-full rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50">
        {pending ? "Menyimpan..." : "Simpan Setoran"}
      </button>
    </form>
  );
}

export function KasForm() {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createWithdrawal(formData),
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="font-semibold text-gray-900">Kas Umum - Pengeluaran</h3>

      {state?.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
        <input type="number" name="amount" min={0} required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal</label>
          <input type="date" name="date" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Keterangan</label>
          <input name="description" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
        </div>
      </div>

      <button type="submit" disabled={pending} className="w-full rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
        {pending ? "Menyimpan..." : "Catat Pengeluaran"}
      </button>
    </form>
  );
}
