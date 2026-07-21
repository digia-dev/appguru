"use server";

import { z } from "zod";
import { db, withError } from "@/lib/prisma";
import { parseError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const attendanceSchema = z.object({
  studentId: z.string(),
  classId: z.string(),
  eventDate: z.string(),
  status: z.enum(["H", "S", "I", "A"]),
  session: z.coerce.number().int().default(1),
  notes: z.string().optional(),
});

export async function getAttendance(classId: string, date: string) {
  return withError(async () => {
    const { data, error } = await db.from("Attendance")
      .select("*, Student(*)")
      .eq("classId", classId)
      .eq("eventDate", new Date(date).toISOString())
      .order("eventDate", { ascending: true });
    if (error) throw error;
    return data!;
  });
}

export async function getAttendanceSummary(studentId: string, startDate: string, endDate: string) {
  return withError(async () => {
    const { data, error } = await db.from("Attendance")
      .select("*")
      .eq("studentId", studentId)
      .gte("eventDate", new Date(startDate).toISOString())
      .lte("eventDate", new Date(endDate).toISOString());
    if (error) throw error;
    return data!;
  });
}

export async function upsertAttendance(formData: FormData) {
  const parsed = attendanceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const { studentId, eventDate, session, ...rest } = parsed.data;
  const date = new Date(eventDate).toISOString();

  const result = await withError(async () => {
    const { data, error } = await db.from("Attendance")
      .upsert({ studentId, eventDate: date, session, ...rest }, { onConflict: "studentId,eventDate,session" })
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/attendance");
  return result;
}

export async function bulkAttendance(data: { studentId: string; status: string; classId: string; eventDate: string }[]) {
  return withError(async () => {
    const records = data.map((d) => ({
      studentId: d.studentId,
      classId: d.classId,
      eventDate: new Date(d.eventDate).toISOString(),
      status: d.status,
      session: 1,
    }));
    const { error } = await db.from("Attendance").upsert(records, { onConflict: "studentId,eventDate,session" });
    if (error) throw error;
  });
}
