"use client";

import { useActionState, useOptimistic, startTransition } from "react";
import { bulkAttendance } from "./actions";

type Student = { id: string; studentId: string; name: string };
type AttendanceRec = { studentId: string; status: string } | undefined;

export function AttendanceSheet({ classId, date, students, existing }: { classId: string; date: string; students: Student[]; existing: AttendanceRec[] }) {
  const existingMap = new Map(existing.map((r) => [r?.studentId, r?.status ?? "H"]));

  const [optState, setOpt] = useOptimistic(
    existingMap,
    (_state, updates: [string, string][]) => {
      const next = new Map(existingMap);
      updates.forEach(([id, st]) => next.set(id, st));
      return next;
    },
  );

  const [state, action, pending] = useActionState(
    async () => {
      const data = students.map((s) => ({
        studentId: s.id,
        status: optState.get(s.id) ?? "H",
        classId,
        eventDate: date,
      }));
      return bulkAttendance(data);
    },
    null,
  );

  function toggleStatus(studentId: string) {
    const current = optState.get(studentId) ?? "H";
    const nextStatus = { H: "S", S: "I", I: "A", A: "H" } as Record<string, string>;
    const next = nextStatus[current];
    startTransition(() => setOpt([[studentId, next]]));
  }

  const statusColors: Record<string, string> = {
    H: "bg-green-100 text-green-700 border-green-300",
    S: "bg-yellow-100 text-yellow-700 border-yellow-300",
    I: "bg-blue-100 text-blue-700 border-blue-300",
    A: "bg-red-100 text-red-700 border-red-300",
  };

  const statusLabels: Record<string, string> = { H: "H", S: "S", I: "I", A: "A" };

  return (
    <div className="space-y-4">
      <form action={action}>
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="font-semibold text-gray-900">Daftar Kehadiran</h3>
            <p className="mt-1 text-sm text-gray-500">Klik status untuk mengubah: H→S→I→A→H</p>
          </div>

          {students.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">Tidak ada siswa di kelas ini.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {students.map((s) => {
                const status = optState.get(s.id) ?? "H";
                return (
                  <button key={s.id} type="button" onClick={() => toggleStatus(s.id)} className="flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">{s.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.studentId}</p>
                      </div>
                    </div>
                    <span className={`rounded-lg border px-3 py-1 text-sm font-semibold ${statusColors[status]}`}>
                      {statusLabels[status]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {students.length > 0 && (
          <button type="submit" disabled={pending} className="mt-4 w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
            {pending ? "Menyimpan..." : "Simpan Semua Kehadiran"}
          </button>
        )}
      </form>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}
    </div>
  );
}
