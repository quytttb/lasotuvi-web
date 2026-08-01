import { z } from "zod";

import { chartResponseSchema } from "@/lib/chart/validate";
import { birthContextSchema, normalizeBirthContext } from "@/lib/form/birth-context";
import { birthInfoSchema } from "@/lib/form/birth-schema";

export const SAVED_CHART_SCHEMA_VERSION = 2 as const;

export const savedChartSchema = z.object({
  id: z.string().min(1),
  schemaVersion: z.literal(SAVED_CHART_SCHEMA_VERSION),
  title: z.string().min(1).max(200),
  createdAt: z.string(),
  updatedAt: z.string(),
  birthInput: birthInfoSchema,
  chart: chartResponseSchema,
  birthContext: birthContextSchema.optional().nullable(),
});

export type SavedChart = z.infer<typeof savedChartSchema>;

/** Parse a saved chart. Legacy versions are rejected (safe to delete / re-save). */
export function migrateSavedChart(raw: unknown): SavedChart {
  if (!raw || typeof raw !== "object") {
    throw new Error("Bản ghi lưu không hợp lệ.");
  }
  const record = raw as Record<string, unknown>;
  if (record.schemaVersion !== SAVED_CHART_SCHEMA_VERSION) {
    throw new Error(
      `Phiên bản schema ${String(record.schemaVersion)} chưa được hỗ trợ. Hãy xóa lá số cũ và lập lại.`,
    );
  }
  return savedChartSchema.parse({
    ...raw,
    birthContext: normalizeBirthContext(record.birthContext),
  });
}

export function defaultTitleFromBirth(input: {
  name?: string | null;
  day: number;
  month: number;
  year: number;
}): string {
  if (input.name?.trim()) return input.name.trim();
  return `Lá số ${String(input.day).padStart(2, "0")}/${String(input.month).padStart(2, "0")}/${input.year}`;
}
