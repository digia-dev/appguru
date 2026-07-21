"use server";

import { z } from "zod";
import { prisma, withError } from "@/lib/prisma";
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
  return withError(() =>
    prisma.student.findMany({
      where: { deletedAt: null, ...(classId ? { classId } : {}) },
      include: { class: true },
      orderBy: { name: "asc" },
    }),
  );
}

export async function getStudentById(id: string) {
  return withError(() =>
    prisma.student.findUnique({
      where: { id },
      include: { class: true, attendance: true, grades: { include: { gradeBab: true } } },
    }),
  );
}

export async function createStudent(formData: FormData) {
  const data: Record<string, unknown> = Object.fromEntries(formData);
  if (data.dob) data.dob = new Date(data.dob as string);
  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.student.create({
      data: { ...parsed.data, dob: parsed.data.dob ? new Date(parsed.data.dob) : undefined },
    }),
  );
  revalidatePath("/dashboard/students");
  return result;
}

export async function updateStudent(id: string, formData: FormData) {
  const data: Record<string, unknown> = Object.fromEntries(formData);
  if (data.dob) data.dob = new Date(data.dob as string);
  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.student.update({
      where: { id },
      data: { ...parsed.data, dob: parsed.data.dob ? new Date(parsed.data.dob) : undefined },
    }),
  );
  revalidatePath("/dashboard/students");
  return result;
}

export async function deleteStudent(id: string) {
  const result = await withError(() =>
    prisma.student.update({ where: { id }, data: { deletedAt: new Date() } }),
  );
  revalidatePath("/dashboard/students");
  return result;
}

export async function searchStudents(query: string) {
  return withError(() =>
    prisma.student.findMany({
      where: {
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { studentId: { contains: query } },
        ],
      },
      include: { class: true },
      take: 10,
    }),
  );
}
