"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { deleteClass } from "./actions";

export function DeleteClassButton({ id }: { id: string }) {
  const router = useRouter();

  const [state, action, pending] = useActionState(
    async () => {
      const result = await deleteClass(id);
      if (!result.error) router.push("/dashboard/classes");
      return result;
    },
    { data: null, error: null },
  );

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "Menghapus..." : "Hapus Kelas"}
      </button>
      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
