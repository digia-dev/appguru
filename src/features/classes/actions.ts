"use server";

import { z } from "zod";
import { db, withError } from "@/lib/prisma";
import { parseError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const classSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  level: z.coerce.number().int().min(1).max(12),
  section: z.string().min(1, "Bagian kelas wajib diisi"),
});

export async function getClasses() {
  return withError(async () => {
    const { data, error } = await db.from("Class").select("*").is("deletedAt", null).order("name", { ascending: true });
    if (error) throw error;
    return data!;
  });
}

export async function getClassById(id: string) {
  return withError(async () => {
    const { data, error } = await db.from("Class").select("*, Student(*)").eq("id", id).single();
    if (error) throw error;
    return data!;
  });
}

export async function createClass(formData: FormData) {
  const parsed = classSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const { data, error } = await db.from("Class").insert(parsed.data as any).select().single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/classes");
  return result;
}

export async function updateClass(id: string, formData: FormData) {
  const parsed = classSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const { data, error } = await db.from("Class").update(parsed.data).eq("id", id).select().single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/classes");
  return result;
}

export async function deleteClass(id: string) {
  const result = await withError(async () => {
    const { error } = await db.from("Class").update({ deletedAt: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  });
  revalidatePath("/dashboard/classes");
  return result;
}
