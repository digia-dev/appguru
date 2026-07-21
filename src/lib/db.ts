import { adminClient } from "./supabase-admin";
import type { Database } from "./database.types";

export const db = adminClient;
export type Tables = Database["public"]["Tables"];

export function generateId(): string {
  return crypto.randomUUID();
}

export async function withError<T>(fn: () => Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (e) {
    console.error("[DB]", e);
    return { data: null, error: e instanceof Error ? e.message : "Terjadi kesalahan database" };
  }
}
