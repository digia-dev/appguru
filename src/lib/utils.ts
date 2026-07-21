import { z } from "zod";

export function parseError(error: z.ZodError): string {
  return error.issues[0]?.message ?? error.message;
}
