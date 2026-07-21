"use server";

import { z } from "zod";
import { prisma, withError } from "@/lib/prisma";
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
  return withError(() =>
    prisma.grade.findMany({
      where: { classId, semester },
      include: { student: true, gradeBab: true },
      orderBy: { student: { name: "asc" } },
    }),
  );
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
    const existing = await prisma.grade.findUnique({
      where: { studentId_semester: { studentId, semester } },
    });

    if (existing) {
      return prisma.grade.update({
        where: { id: existing.id },
        data: { sts, sas, sikapJujur, sikapDisiplin, sikapTggJawab },
      });
    }
    return prisma.grade.create({
      data: { studentId, classId, semester, sts, sas, sikapJujur, sikapDisiplin, sikapTggJawab },
    });
  });
}

export async function upsertGradeBab(gradeId: string, formData: FormData) {
  const parsed = gradeBabSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { data: null, error: parseError(parsed.error) };

  return withError(async () => {
    const existing = await prisma.gradeBab.findUnique({
      where: { gradeId_bab: { gradeId, bab: parsed.data.bab } },
    });

    const pValues = [parsed.data.pengetahuan1, parsed.data.pengetahuan2, parsed.data.pengetahuan3, parsed.data.pengetahuan4, parsed.data.pengetahuan5].filter((v) => v != null);
    const pengetahuanRata = pValues.length > 0 ? Math.round(pValues.reduce((a, b) => a! + b!, 0)! / pValues.length) : null;

    const kValues = [parsed.data.keterampilan1, parsed.data.keterampilan2, parsed.data.keterampilan3, parsed.data.keterampilan4, parsed.data.keterampilan5].filter((v) => v != null);
    const keterampilanRata = kValues.length > 0 ? Math.round(kValues.reduce((a, b) => a! + b!, 0)! / kValues.length) : null;

    const data = { ...parsed.data, pengetahuanRata, keterampilanRata };

    if (existing) {
      return prisma.gradeBab.update({ where: { id: existing.id }, data });
    }
    return prisma.gradeBab.create({ data: { ...data, gradeId } });
  });
}

export async function rekapRapor(classId: string, semester: "GANJIL" | "GENAP") {
  return withError(async () => {
    const grades = await prisma.grade.findMany({
      where: { classId, semester },
      include: { student: true, gradeBab: true },
    });

    return grades.map((g) => {
      const babs = g.gradeBab;
      const pRata = babs.length > 0
        ? Math.round(babs.reduce((sum, b) => sum + (b.pengetahuanRata ?? 0), 0) / babs.length)
        : 0;
      const kRata = babs.length > 0
        ? Math.round(babs.reduce((sum, b) => sum + (b.keterampilanRata ?? 0), 0) / babs.length)
        : 0;
      const sRata = g.sikapRata ?? 0;
      const nilaiHarian = pRata > 0 && kRata > 0 && sRata > 0
        ? Math.round((pRata + kRata + sRata) / 3) : 0;
      const nilaiRapor = Math.round(
        (nilaiHarian * 0.5) + ((g.sts ?? 0) * 0.1) + ((g.sas ?? 0) * 0.2),
      );

      return {
        student: g.student,
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
