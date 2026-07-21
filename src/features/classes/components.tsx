"use client";

import { useActionState } from "react";
import { createClass } from "./actions";

export function ClassForm() {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createClass(formData),
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="font-semibold text-gray-900">Tambah Kelas Baru</h3>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Kelas</label>
        <input
          name="name"
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          placeholder="7-6"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tingkat</label>
          <input
            name="level"
            type="number"
            min={1}
            max={12}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="7"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bagian</label>
          <input
            name="section"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="6"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
