import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const { error } = await db.from("Class").select("id", { count: "exact", head: true });
    if (error) throw error;
    return NextResponse.json({ status: "connected" });
  } catch {
    return NextResponse.json({ status: "disconnected" });
  }
}
