"use server";

import { z } from "zod";
import { db, withError } from "@/lib/prisma";
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
  return withError(async () => {
    let query = db.from("Saving").select("*, Student(*)");
    if (studentId) query = query.eq("studentId", studentId);
    const { data, error } = await query.order("date", { ascending: false });
    if (error) throw error;
    return data!;
  });
}

export async function getSavingsSummary(classId: string) {
  return withError(async () => {
    const { data, error } = await db.from("Student")
      .select("*, Saving(*)")
      .eq("classId", classId)
      .is("deletedAt", null)
      .order("name", { ascending: true });
    if (error) throw error;
    return data!;
  });
}

export async function createSaving(formData: FormData) {
  const parsed = savingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const { data, error } = await db.from("Saving")
      .insert({ ...parsed.data, date: new Date(parsed.data.date).toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/savings");
  return result;
}

export async function updateSaving(id: string, formData: FormData) {
  const parsed = savingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const { data, error } = await db.from("Saving")
      .update({ ...parsed.data, date: new Date(parsed.data.date).toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/savings");
  return result;
}

export async function deleteSaving(id: string) {
  const result = await withError(async () => {
    const { error } = await db.from("Saving").delete().eq("id", id);
    if (error) throw error;
  });
  revalidatePath("/dashboard/savings");
  return result;
}

export async function getWithdrawals() {
  return withError(async () => {
    const { data, error } = await db.from("SavingWithdrawal").select("*").order("date", { ascending: false });
    if (error) throw error;
    return data!;
  });
}

export async function createWithdrawal(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;

  if (!amount || !date) return { data: null, error: "Jumlah dan tanggal wajib diisi" };

  const result = await withError(async () => {
    const { data, error } = await db.from("SavingWithdrawal")
      .insert({ amount, date: new Date(date).toISOString(), description })
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/savings");
  return result;
}
