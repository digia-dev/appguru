"use server";

import { z } from "zod";
import { db, withError } from "@/lib/prisma";
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
  return withError(async () => {
    let query = db.from("LearningActivity").select("*, Class(*)");
    if (classId) query = query.eq("classId", classId);
    if (startDate) query = query.gte("eventDate", new Date(startDate).toISOString());
    if (endDate) query = query.lte("eventDate", new Date(endDate).toISOString());
    const { data, error } = await query.order("eventDate", { ascending: true }).order("startTime", { ascending: true });
    if (error) throw error;
    return data!;
  });
}

export async function getWeeklyAgenda(startDate: string, endDate: string) {
  return withError(async () => {
    const { data, error } = await db.from("LearningActivity")
      .select("*, Class(*)")
      .gte("eventDate", new Date(startDate).toISOString())
      .lte("eventDate", new Date(endDate).toISOString())
      .order("eventDate", { ascending: true })
      .order("startTime", { ascending: true });
    if (error) throw error;
    return data!;
  });
}

export async function createAgenda(formData: FormData) {
  const parsed = agendaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const { data, error } = await db.from("LearningActivity")
      .insert({ ...parsed.data, eventDate: new Date(parsed.data.eventDate).toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/agenda");
  return result;
}

export async function updateAgenda(id: string, formData: FormData) {
  const parsed = agendaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  const result = await withError(async () => {
    const { data, error } = await db.from("LearningActivity")
      .update({ ...parsed.data, eventDate: new Date(parsed.data.eventDate).toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
  revalidatePath("/dashboard/agenda");
  return result;
}

export async function deleteAgenda(id: string) {
  const result = await withError(async () => {
    const { error } = await db.from("LearningActivity").delete().eq("id", id);
    if (error) throw error;
  });
  revalidatePath("/dashboard/agenda");
  return result;
}

export async function duplicateWeekAgenda(sourceStart: string, sourceEnd: string, destStart: string) {
  return withError(async () => {
    const { data: activities, error } = await db.from("LearningActivity")
      .select("*")
      .gte("eventDate", new Date(sourceStart).toISOString())
      .lte("eventDate", new Date(sourceEnd).toISOString());
    if (error) throw error;

    const sourceStartDate = new Date(sourceStart);
    const destStartDate = new Date(destStart);
    const diffDays = Math.round((destStartDate.getTime() - sourceStartDate.getTime()) / (1000 * 60 * 60 * 24));

    const newActivities = (activities ?? []).map((a: any) => {
      const newDate = new Date(a.eventDate);
      newDate.setDate(newDate.getDate() + diffDays);
      return {
        classId: a.classId,
        eventDate: newDate.toISOString(),
        startTime: a.startTime,
        endTime: a.endTime,
        notes: a.notes,
      };
    });

    const { error: insertError } = await db.from("LearningActivity").insert(newActivities);
    if (insertError) throw insertError;
  });
}
