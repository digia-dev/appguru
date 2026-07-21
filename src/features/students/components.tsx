"use client";

import { useActionState } from "react";
import { createStudent } from "./actions";
import type { Class } from "@prisma/client";

export function StudentForm({ classes, student }: { classes: Pick<Class, "id" | "name">[]; student?: { id: string; studentId: string; name: string; classId: string; address: string | null; dob: Date | null; fatherName: string | null; fatherJob: string | null; motherName: string | null; motherJob: string | null; phone: string | null; notes: string | null } }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      if (student) {
        const { updateStudent } = await import("./actions");
        return updateStudent(student.id, formData);
      }
      return createStudent(formData);
    },
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="font-semibold text-gray-900">{student ? "Edit Siswa" : "Tambah Siswa Baru"}</h3>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">NIS</label>
          <input name="studentId" defaultValue={student?.studentId} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input name="name" defaultValue={student?.name} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kelas</label>
        <select name="classId" defaultValue={student?.classId} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" required>
          <option value="">Pilih kelas...</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alamat</label>
        <textarea name="address" defaultValue={student?.address ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
          <input type="date" name="dob" defaultValue={student?.dob?.toISOString().split("T")[0]} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">No. HP</label>
          <input name="phone" defaultValue={student?.phone ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="mb-3 text-sm font-medium text-gray-700">Data Orang Tua</p>
        <div className="grid grid-cols-2 gap-4">
          <input name="fatherName" defaultValue={student?.fatherName ?? ""} placeholder="Nama Ayah" className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
          <input name="fatherJob" defaultValue={student?.fatherJob ?? ""} placeholder="Pekerjaan Ayah" className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
          <input name="motherName" defaultValue={student?.motherName ?? ""} placeholder="Nama Ibu" className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
          <input name="motherJob" defaultValue={student?.motherJob ?? ""} placeholder="Pekerjaan Ibu" className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Catatan</label>
        <textarea name="notes" defaultValue={student?.notes ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" rows={2} />
      </div>

      <button type="submit" disabled={pending} className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
        {pending ? "Menyimpan..." : student ? "Simpan Perubahan" : "Simpan"}
      </button>
    </form>
  );
}
