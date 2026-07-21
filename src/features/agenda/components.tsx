"use client";

import { useActionState } from "react";
import { createAgenda, duplicateWeekAgenda } from "./actions";

export function AgendaForm({ classes }: { classes: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createAgenda(formData),
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="font-semibold text-gray-900">Tambah Jadwal Baru</h3>

      {state?.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Kelas</label>
        <select name="classId" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
          <option value="">Pilih kelas...</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
        <input type="date" name="eventDate" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mulai</label>
          <input type="time" name="startTime" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Selesai</label>
          <input type="time" name="endTime" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Catatan / Materi</label>
        <textarea name="notes" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" rows={3} />
      </div>

      <button type="submit" disabled={pending} className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
        {pending ? "Menyimpan..." : "Simpan Jadwal"}
      </button>
    </form>
  );
}

export function DuplicateWeekForm() {
  const [state, action, pending] = useActionState(
    async (_prev: { data: unknown; error: string | null } | null, formData: FormData) => {
      const srcStart = formData.get("sourceStart") as string;
      const srcEnd = formData.get("sourceEnd") as string;
      const destStart = formData.get("destStart") as string;
      const result = await duplicateWeekAgenda(srcStart, srcEnd, destStart);
      return { data: result, error: null };
    },
    null,
  );

  return (
    <form action={action} className="rounded-xl bg-purple-50 p-6 shadow-sm">
      <h3 className="mb-3 font-semibold text-purple-900">Duplikat Mingguan</h3>
      {state?.error && <div className="mb-3 rounded-lg bg-red-50 p-2 text-xs text-red-600">{state.error}</div>}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-purple-700">Dari Tanggal</label>
          <input type="date" name="sourceStart" required className="mt-1 w-full rounded-lg border border-purple-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-purple-700">Sampai</label>
          <input type="date" name="sourceEnd" required className="mt-1 w-full rounded-lg border border-purple-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-purple-700">Ke Tanggal</label>
          <input type="date" name="destStart" required className="mt-1 w-full rounded-lg border border-purple-200 px-3 py-2 text-sm" />
        </div>
      </div>
      <button type="submit" disabled={pending} className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50">
        {pending ? "..." : "Duplikat"}
      </button>
    </form>
  );
}
