"use server";

import { z } from "zod";
import { db, withError } from "@/lib/prisma";
import { parseError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const gradeBabSchema = z.object({
  bab: z.coerce.number().int().min(1).max(4),
  pengetahuan1: z.coerce.number().optional(),
  pengetahuan2: z.coerce.number().optional(),
  pengetahuan3: z.coerce.number().optional(),
  pengetahuan4: z.coerce.number().optional(),
  pengetahuan5: z.coerce.number().optional(),
  keterampilan1: z.coerce.number().optional(),
  keterampilan2: z.coerce.number().optional(),
  keterampilan3: z.coerce.number().optional(),
  keterampilan4: z.coerce.number().optional(),
  keterampilan5: z.coerce.number().optional(),
});

export async function getGrades(classId: string, semester: "GANJIL" | "GENAP") {
  return withError(async () => {
    const { data, error } = await db.from("Grade")
      .select("*, Student(*), GradeBab(*)")
      .eq("classId", classId)
      .eq("semester", semester);
    if (error) throw error;
    return data!;
  });
}

export async function upsertGrade(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const classId = formData.get("classId") as string;
  const semester = formData.get("semester") as "GANJIL" | "GENAP";
  const sts = formData.get("sts") ? Number(formData.get("sts")) : undefined;
  const sas = formData.get("sas") ? Number(formData.get("sas")) : undefined;
  const sikapJujur = formData.get("sikapJujur") as string | undefined;
  const sikapDisiplin = formData.get("sikapDisiplin") as string | undefined;
  const sikapTggJawab = formData.get("sikapTggJawab") as string | undefined;

  return withError(async () => {
    const { data, error } = await db.from("Grade")
      .upsert({ studentId, classId, semester, sts, sas, sikapJujur, sikapDisiplin, sikapTggJawab }, { onConflict: "studentId,semester" })
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
}

export async function upsertGradeBab(gradeId: string, formData: FormData) {
  const parsed = gradeBabSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  return withError(async () => {
    const pValues = [parsed.data.pengetahuan1, parsed.data.pengetahuan2, parsed.data.pengetahuan3, parsed.data.pengetahuan4, parsed.data.pengetahuan5].filter((v) => v != null);
    const pengetahuanRata = pValues.length > 0 ? Math.round(pValues.reduce((a, b) => a! + b!, 0)! / pValues.length) : null;

    const kValues = [parsed.data.keterampilan1, parsed.data.keterampilan2, parsed.data.keterampilan3, parsed.data.keterampilan4, parsed.data.keterampilan5].filter((v) => v != null);
    const keterampilanRata = kValues.length > 0 ? Math.round(kValues.reduce((a, b) => a! + b!, 0)! / kValues.length) : null;

    const { data, error } = await db.from("GradeBab")
      .upsert({ ...parsed.data, gradeId, pengetahuanRata, keterampilanRata }, { onConflict: "gradeId,bab" })
      .select()
      .single();
    if (error) throw error;
    return data!;
  });
}

export async function rekapRapor(classId: string, semester: "GANJIL" | "GENAP") {
  return withError(async () => {
    const { data: grades, error } = await db.from("Grade")
      .select("*, Student(*), GradeBab(*)")
      .eq("classId", classId)
      .eq("semester", semester);
    if (error) throw error;

    return (grades ?? []).map((g: any) => {
      const babs = g.GradeBab || [];
      const pRata = babs.length > 0
        ? Math.round(babs.reduce((sum: number, b: any) => sum + (b.pengetahuanRata ?? 0), 0) / babs.length)
        : 0;
      const kRata = babs.length > 0
        ? Math.round(babs.reduce((sum: number, b: any) => sum + (b.keterampilanRata ?? 0), 0) / babs.length)
        : 0;
      const sRata = g.sikapRata ?? 0;
      const nilaiHarian = pRata > 0 && kRata > 0 && sRata > 0
        ? Math.round((pRata + kRata + sRata) / 3) : 0;
      const nilaiRapor = Math.round(
        (nilaiHarian * 0.5) + ((g.sts ?? 0) * 0.1) + ((g.sas ?? 0) * 0.2),
      );

      return {
        student: g.Student,
        pengetahuanRata: pRata,
        keterampilanRata: kRata,
        sikapRata: sRata,
        sts: g.sts,
        sas: g.sas,
        nilaiHarian,
        nilaiRapor,
      };
    });
  });
}
