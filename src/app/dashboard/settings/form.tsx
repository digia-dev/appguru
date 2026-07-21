"use client";

import { useActionState } from "react";

export function UpdateProfileForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (!res.ok) {
        const err = await res.json();
        return { data: null, error: err.error ?? "Gagal update profil" };
      }
      return { data: await res.json(), error: null };
    },
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="font-semibold text-gray-900">Informasi Profil</h3>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}
      {state?.data && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">Profile updated successfully!</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-400">Email tidak dapat diubah.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
        <input
          name="name"
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          placeholder="Nama Anda"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
        <input
          name="subject"
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          placeholder="Matematika, Fisika, ..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">No. HP</label>
        <input
          name="phone"
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          placeholder="08xxxxxxxxxx"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
