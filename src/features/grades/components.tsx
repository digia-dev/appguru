"use client";

import { useActionState } from "react";
import { upsertGrade, upsertGradeBab } from "./actions";

export function GradeForm({ studentId, classId, semester, grade }: { studentId: string; classId: string; semester: string; grade?: { id: string; sts: number | null; sas: number | null; sikapJujur: string | null; sikapDisiplin: string | null; sikapTggJawab: string | null } }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => upsertGrade(formData),
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="semester" value={semester} />

      <h3 className="font-semibold text-gray-900">Nilai STS & SAS</h3>

      {state?.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai STS</label>
          <input type="number" name="sts" min={0} max={100} defaultValue={grade?.sts ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai SAS</label>
          <input type="number" name="sas" min={0} max={100} defaultValue={grade?.sas ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="mb-3 text-sm font-medium text-gray-700">Nilai Sikap</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Jujur", name: "sikapJujur" },
            { label: "Disiplin", name: "sikapDisiplin" },
            { label: "Tanggung Jawab", name: "sikapTggJawab" },
          ].map((s) => (
            <select key={s.name} name={s.name} defaultValue={(grade as any)?.[s.name] ?? ""} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">-</option>
              <option value="SB">Sangat Baik</option>
              <option value="B">Baik</option>
              <option value="C">Cukup</option>
              <option value="K">Kurang</option>
            </select>
          ))}
        </div>
      </div>

      <button type="submit" disabled={pending} className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
        {pending ? "Menyimpan..." : "Simpan Nilai"}
      </button>
    </form>
  );
}

export function GradeBabForm({ gradeId, bab, data }: { gradeId: string; bab: number; data?: { pengetahuan1: number | null; pengetahuan2: number | null; pengetahuan3: number | null; pengetahuan4: number | null; pengetahuan5: number | null; keterampilan1: number | null; keterampilan2: number | null; keterampilan3: number | null; keterampilan4: number | null; keterampilan5: number | null } }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => upsertGradeBab(gradeId, formData),
    { data: null, error: null },
  );

  return (
    <form action={action} className="space-y-3 rounded-lg border p-4">
      <input type="hidden" name="bab" value={bab} />
      <p className="text-sm font-medium text-gray-700">Bab {bab}</p>

      {state?.error && <div className="rounded-lg bg-red-50 p-2 text-xs text-red-600">{state.error}</div>}

      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Pengetahuan (1-5)</p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <input key={n} type="number" name={`pengetahuan${n}`} min={0} max={100} defaultValue={(data as any)?.[`pengetahuan${n}`] ?? ""} placeholder={`P${n}`} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Keterampilan (1-5)</p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <input key={n} type="number" name={`keterampilan${n}`} min={0} max={100} defaultValue={(data as any)?.[`keterampilan${n}`] ?? ""} placeholder={`K${n}`} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" />
          ))}
        </div>
      </div>

      <button type="submit" disabled={pending} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
        {pending ? "..." : "Simpan Bab"}
      </button>
    </form>
  );
}
