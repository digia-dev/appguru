"use server";

import { z } from "zod";
import { prisma, withError } from "@/lib/prisma";
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
  return withError(() =>
    prisma.attendance.findMany({
      where: { classId, eventDate: new Date(date) },
      include: { student: true },
      orderBy: { student: { name: "asc" } },
    }),
  );
}

export async function getAttendanceSummary(studentId: string, startDate: string, endDate: string) {
  return withError(() =>
    prisma.attendance.findMany({
      where: {
        studentId,
        eventDate: { gte: new Date(startDate), lte: new Date(endDate) },
      },
    }),
  );
}

export async function upsertAttendance(formData: FormData) {
  const parsed = attendanceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const { studentId, eventDate, session, ...rest } = parsed.data;
  const date = new Date(eventDate);

  const result = await withError(async () => {
    const existing = await prisma.attendance.findUnique({
      where: { studentId_eventDate_session: { studentId, eventDate: date, session } },
    });

    if (existing) {
      return prisma.attendance.update({
        where: { id: existing.id },
        data: rest,
      });
    }
    return prisma.attendance.create({
      data: { studentId, eventDate: date, session, ...rest },
    });
  });

  revalidatePath("/dashboard/attendance");
  return result;
}

export async function bulkAttendance(data: { studentId: string; status: string; classId: string; eventDate: string }[]) {
  return withError(async () => {
    const tx = data.map((d) =>
      prisma.attendance.upsert({
        where: {
          studentId_eventDate_session: {
            studentId: d.studentId,
            eventDate: new Date(d.eventDate),
            session: 1,
          },
        },
        update: { status: d.status as "H" | "S" | "I" | "A" },
        create: {
          studentId: d.studentId,
          classId: d.classId,
          eventDate: new Date(d.eventDate),
          status: d.status as "H" | "S" | "I" | "A",
        },
      }),
    );
    await prisma.$transaction(tx);
  });
}
