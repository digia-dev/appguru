"use server";

import { z } from "zod";
import { prisma, withError } from "@/lib/prisma";
import { parseError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const savingSchema = z.object({
  studentId: z.string().min(1),
  amountIn: z.coerce.number().optional(),
  amountOut: z.coerce.number().optional(),
  date: z.string().min(1),
  notes: z.string().optional(),
});

export async function getSavings(studentId?: string) {
  return withError(() =>
    prisma.saving.findMany({
      where: studentId ? { studentId } : {},
      include: { student: true },
      orderBy: { date: "desc" },
    }),
  );
}

export async function getSavingsSummary(classId: string) {
  return withError(() =>
    prisma.student.findMany({
      where: { classId, deletedAt: null },
      include: {
        savings: { orderBy: { date: "desc" } },
      },
      orderBy: { name: "asc" },
    }),
  );
}

export async function createSaving(formData: FormData) {
  const parsed = savingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.saving.create({
      data: { ...parsed.data, date: new Date(parsed.data.date) },
    }),
  );
  revalidatePath("/dashboard/savings");
  return result;
}

export async function updateSaving(id: string, formData: FormData) {
  const parsed = savingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.saving.update({
      where: { id },
      data: { ...parsed.data, date: new Date(parsed.data.date) },
    }),
  );
  revalidatePath("/dashboard/savings");
  return result;
}

export async function deleteSaving(id: string) {
  const result = await withError(() => prisma.saving.delete({ where: { id } }));
  revalidatePath("/dashboard/savings");
  return result;
}

export async function getWithdrawals() {
  return withError(() =>
    prisma.savingWithdrawal.findMany({ orderBy: { date: "desc" } }),
  );
}

export async function createWithdrawal(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;

  if (!amount || !date) return { data: null, error: "Jumlah dan tanggal wajib diisi" };

  const result = await withError(() =>
    prisma.savingWithdrawal.create({
      data: { amount, date: new Date(date), description },
    }),
  );
  revalidatePath("/dashboard/savings");
  return result;
}
