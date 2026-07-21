import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "connected" });
  } catch {
    return NextResponse.json({ status: "disconnected" });
  }
}

export async function POST() {
  const results: string[] = [];

  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "_migration_test" (id SERIAL PRIMARY KEY)`);
    await prisma.$executeRawUnsafe(`DROP TABLE "_migration_test"`);
    results.push("Prisma dapat menjalankan query — koneksi OK");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push(`Koneksi gagal: ${msg}`);
    return NextResponse.json({ results, status: "error" });
  }

  return NextResponse.json({ results, status: "done" });
}
