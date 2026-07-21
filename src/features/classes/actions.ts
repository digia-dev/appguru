"use server";

import { z } from "zod";
import { prisma, withError } from "@/lib/prisma";
import { parseError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const classSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  level: z.coerce.number().int().min(1).max(12),
  section: z.string().min(1, "Bagian kelas wajib diisi"),
});

export async function getClasses() {
  return withError(() =>
    prisma.class.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } }),
  );
}

export async function getClassById(id: string) {
  return withError(() =>
    prisma.class.findUnique({ where: { id }, include: { students: true } }),
  );
}

export async function createClass(formData: FormData) {
  const parsed = classSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.class.create({ data: parsed.data }),
  );
  revalidatePath("/dashboard/classes");
  return result;
}

export async function updateClass(id: string, formData: FormData) {
  const parsed = classSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.class.update({ where: { id }, data: parsed.data }),
  );
  revalidatePath("/dashboard/classes");
  return result;
}

export async function deleteClass(id: string) {
  const result = await withError(() =>
    prisma.class.update({ where: { id }, data: { deletedAt: new Date() } }),
  );
  revalidatePath("/dashboard/classes");
  return result;
}
