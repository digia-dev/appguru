"use server";

import { z } from "zod";
import { prisma, withError } from "@/lib/prisma";
import { parseError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const agendaSchema = z.object({
  classId: z.string().min(1),
  eventDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  notes: z.string().optional(),
});

export async function getAgenda(classId?: string, startDate?: string, endDate?: string) {
  const where: Record<string, unknown> = {};
  if (classId) where.classId = classId;
  if (startDate) where.eventDate = { gte: new Date(startDate) };
  if (endDate) where.eventDate = { ...(where.eventDate as object || {}), lte: new Date(endDate) };

  return withError(() =>
    prisma.learningActivity.findMany({
      where,
      include: { class: true },
      orderBy: [{ eventDate: "asc" }, { startTime: "asc" }],
    }),
  );
}

export async function getWeeklyAgenda(startDate: string, endDate: string) {
  return withError(() =>
    prisma.learningActivity.findMany({
      where: { eventDate: { gte: new Date(startDate), lte: new Date(endDate) } },
      include: { class: true },
      orderBy: [{ eventDate: "asc" }, { startTime: "asc" }],
    }),
  );
}

export async function createAgenda(formData: FormData) {
  const parsed = agendaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.learningActivity.create({
      data: { ...parsed.data, eventDate: new Date(parsed.data.eventDate) },
    }),
  );
  revalidatePath("/dashboard/agenda");
  return result;
}

export async function updateAgenda(id: string, formData: FormData) {
  const parsed = agendaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(() =>
    prisma.learningActivity.update({
      where: { id },
      data: { ...parsed.data, eventDate: new Date(parsed.data.eventDate) },
    }),
  );
  revalidatePath("/dashboard/agenda");
  return result;
}

export async function deleteAgenda(id: string) {
  const result = await withError(() => prisma.learningActivity.delete({ where: { id } }));
  revalidatePath("/dashboard/agenda");
  return result;
}

export async function duplicateWeekAgenda(sourceStart: string, sourceEnd: string, destStart: string) {
  return withError(async () => {
    const activities = await prisma.learningActivity.findMany({
      where: { eventDate: { gte: new Date(sourceStart), lte: new Date(sourceEnd) } },
    });

    const sourceStartDate = new Date(sourceStart);
    const destStartDate = new Date(destStart);
    const diffDays = Math.round((destStartDate.getTime() - sourceStartDate.getTime()) / (1000 * 60 * 60 * 24));

    const newActivities = activities.map((a) => {
      const newDate = new Date(a.eventDate);
      newDate.setDate(newDate.getDate() + diffDays);
      return {
        classId: a.classId,
        eventDate: newDate,
        startTime: a.startTime,
        endTime: a.endTime,
        notes: a.notes,
      };
    });

    await prisma.learningActivity.createMany({ data: newActivities });
  });
}
