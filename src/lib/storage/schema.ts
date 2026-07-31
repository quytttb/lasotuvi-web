import { z } from "zod";

import { chartResponseSchema } from "@/lib/chart/validate";
import { birthInfoSchema } from "@/lib/form/birth-schema";

export const SAVED_CHART_SCHEMA_VERSION = 1 as const;

export const savedChartSchema = z.object({
  id: z.string().min(1),
  schemaVersion: z.literal(1),
  title: z.string().min(1).max(200),
  createdAt: z.string(),
  updatedAt: z.string(),
  birthInput: birthInfoSchema,
  chart: chartResponseSchema,
});

export type SavedChart = z.infer<typeof savedChartSchema>;

export function migrateSavedChart(raw: unknown): SavedChart {
  if (!raw || typeof raw !== "object") {
    throw new Error("Bản ghi lưu không hợp lệ.");
  }
  const record = raw as Record<string, unknown>;
  const version = record.schemaVersion;
  if (version !== 1) {
    throw new Error(
      `Phiên bản schema ${String(version)} chưa được hỗ trợ. Hãy xuất JSON và cập nhật ứng dụng.`,
    );
  }
  return savedChartSchema.parse(raw);
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
