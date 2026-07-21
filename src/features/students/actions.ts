"use server";

import { z } from "zod";
import { db, withError } from "@/lib/prisma";
import { parseError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const studentSchema = z.object({
  studentId: z.string().min(1, "NIS wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  classId: z.string().min(1, "Kelas wajib diisi"),
  address: z.string().optional(),
  dob: z.string().optional(),
  fatherName: z.string().optional(),
  fatherJob: z.string().optional(),
  motherName: z.string().optional(),
  motherJob: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function getStudents(classId?: string) {
  return withError(async () => {
    let query = db.from("Student").select("*, Class(*)").is("deletedAt", null);
    if (classId) query = query.eq("classId", classId);
    const { data, error } = await query.order("name", { ascending: true });
    if (error) throw error;
    return data!;
  });
}

export async function getStudentById(id: string) {
  return withError(async () => {
    const { data, error } = await db.from("Student").select("*, Class(*), Attendance(*), Grade(*, GradeBab(*))").eq("id", id).single();
    if (error) throw error;
    return data!;
  });
}

export async function createStudent(formData: FormData) {
  const data: Record<string, unknown> = Object.fromEntries(formData);
  if (data.dob) data.dob = new Date(data.dob as string).toISOString();
  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const insertData: Record<string, unknown> = { ...parsed.data };
    if (insertData.dob) insertData.dob = new Date(insertData.dob as string).toISOString();
    const { data, error } = await db.from("Student").insert(insertData).select().single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/students");
  return result;
}

export async function updateStudent(id: string, formData: FormData) {
  const data: Record<string, unknown> = Object.fromEntries(formData);
  if (data.dob) data.dob = new Date(data.dob as string).toISOString();
  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const updateData: Record<string, unknown> = { ...parsed.data };
    if (updateData.dob) updateData.dob = new Date(updateData.dob as string).toISOString();
    const { data, error } = await db.from("Student").update(updateData).eq("id", id).select().single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/students");
  return result;
}

export async function deleteStudent(id: string) {
  const result = await withError(async () => {
    const { error } = await db.from("Student").update({ deletedAt: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  });
  revalidatePath("/dashboard/students");
  return result;
}

export async function searchStudents(query: string) {
  return withError(async () => {
    const { data, error } = await db.from("Student")
      .select("*, Class(*)")
      .is("deletedAt", null)
      .or(`name.ilike.%${query}%,studentId.ilike.%${query}%`)
      .limit(10);
    if (error) throw error;
    return data!;
  });
}
