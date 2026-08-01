import { z } from "zod";

import { isValidPalaceIndex } from "@/lib/chart/palace-grid";
import { birthInfoSchema } from "@/lib/form/birth-schema";

const starSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    element: z.string().nullable().optional(),
    category: z.number().nullable().optional(),
    category_label: z.string().nullable().optional(),
    miao_wang: z.string().nullable().optional(),
    miao_wang_label: z.string().nullable().optional(),
    mutagen: z.string().nullable().optional(),
    is_chang_sheng: z.boolean().optional(),
    is_auspicious: z.boolean().nullable().optional(),
  })
  .passthrough();

const interpretationSchema = z.object({
  star: z.string(),
  interpretation: z.string(),
});

const formationQualitySchema = z.enum(["formed", "weakened", "broken"]);

const formationSchema = z
  .object({
    code: z.string(),
    name: z.string(),
    description: z.string(),
    quality: formationQualitySchema.nullable().optional(),
    sources: z.array(z.string()).optional().default([]),
    school: z.string().nullable().optional(),
  })
  .passthrough();

const overviewItemSchema = z
  .object({
    code: z.string(),
    title: z.string(),
    text: z.string(),
  })
  .passthrough();

const periodReadingSchema = z
  .object({
    scope: z.string(),
    code: z.string(),
    text: z.string(),
    tone: z.string().optional().default("neutral"),
    disclaimer: z.string().nullable().optional(),
    palace_index: z.number().nullable().optional(),
    palace_name: z.string().nullable().optional(),
    age: z.number().nullable().optional(),
    da_xian_age: z.number().nullable().optional(),
    da_xian_end_age: z.number().nullable().optional(),
    view_year: z.number().nullable().optional(),
  })
  .passthrough();

const palaceSchema = z
  .object({
    index: z.number().int().min(1).max(12),
    branch_name: z.string(),
    palace_name: z.string().nullable().optional(),
    palace_element: z.string(),
    yin_yang: z.number(),
    stem: z.number().nullable().optional(),
    stem_name: z.string().nullable().optional(),
    stars: z.array(starSchema).default([]),
    interpretations: z.array(interpretationSchema).default([]),
    da_xian_age: z.number().nullable().optional(),
    da_xian_end_age: z.number().nullable().optional(),
    is_active_da_xian: z.boolean().optional(),
    xiao_xian_branch: z.string().nullable().optional(),
    yue_xian: z.number().nullable().optional(),
    is_body_palace: z.boolean().optional(),
    is_xun: z.boolean().optional(),
    is_triet: z.boolean().optional(),
  })
  .passthrough();

const chartMetaSchema = z
  .object({
    ben_ming_name: z.string().nullable().optional(),
    nayin: z.string().nullable().optional(),
    year_yin_yang: z.string().nullable().optional(),
    life_yin_yang_status: z.string().nullable().optional(),
    ming_zhu: z.string().nullable().optional(),
    shen_zhu: z.string().nullable().optional(),
    sheng_ke_status: z.string().nullable().optional(),
    wu_xing_ju_name: z.string().nullable().optional(),
    wu_xing_ju: z.number().nullable().optional(),
    view_year: z.number().nullable().optional(),
    view_year_branch: z.string().nullable().optional(),
    hour_input: z.number().nullable().optional(),
    hour_applied: z.number().nullable().optional(),
    true_solar_offset_minutes: z.number().nullable().optional(),
    true_solar_applied: z.boolean().optional(),
    clock_time: z.string().nullable().optional(),
    birth_place_label: z.string().nullable().optional(),
    longitude_offset_minutes: z.number().nullable().optional(),
    equation_of_time_minutes: z.number().nullable().optional(),
  })
  .passthrough()
  .nullable()
  .optional();

const earthPlateSchema = z
  .object({
    life_palace: z.number(),
    body_palace: z.number(),
    wu_xing_ju: z.number(),
    wu_xing_ju_name: z.string(),
    palaces: z.array(palaceSchema),
    formations: z.array(formationSchema).default([]),
    taboo_palaces: z.array(z.string()).default([]),
    overview: z.array(overviewItemSchema).default([]),
    period_readings: z.array(periodReadingSchema).default([]),
    chart_meta: chartMetaSchema,
  })
  .passthrough();

const stemBranchPairSchema = z
  .object({
    stem: z.number(),
    branch: z.number(),
    stem_name: z.string(),
    branch_name: z.string(),
    label: z.string(),
  })
  .passthrough()
  .nullable()
  .optional();

export const chartResponseSchema = z
  .object({
    birth_info: birthInfoSchema,
    lunar_date: z
      .object({
        day: z.number(),
        month: z.number(),
        year: z.number(),
        is_leap_month: z.boolean().optional(),
      })
      .passthrough(),
    stem_branch: z
      .object({
        year_stem: z.number(),
        year_branch: z.number(),
        year_stem_name: z.string(),
        year_branch_name: z.string(),
        year: stemBranchPairSchema,
        month: stemBranchPairSchema,
        day: stemBranchPairSchema,
        hour: stemBranchPairSchema,
      })
      .passthrough(),
    earth_plate: earthPlateSchema,
    formations: z.array(formationSchema).default([]),
    overview: z.array(overviewItemSchema).default([]),
    period_readings: z.array(periodReadingSchema).default([]),
    chart_meta: chartMetaSchema,
    generated_at: z.string(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    const palaces = data.earth_plate.palaces;
    if (palaces.length !== 12) {
      ctx.addIssue({
        code: "custom",
        path: ["earth_plate", "palaces"],
        message: `Cần đúng 12 cung, nhận được ${palaces.length}.`,
      });
      return;
    }
    const seen = new Set<number>();
    for (const palace of palaces) {
      if (!isValidPalaceIndex(palace.index)) {
        ctx.addIssue({
          code: "custom",
          path: ["earth_plate", "palaces"],
          message: `Index cung không hợp lệ: ${palace.index}.`,
        });
        return;
      }
      if (seen.has(palace.index)) {
        ctx.addIssue({
          code: "custom",
          path: ["earth_plate", "palaces"],
          message: `Trùng index cung: ${palace.index}.`,
        });
        return;
      }
      seen.add(palace.index);
    }
    for (let i = 1; i <= 12; i++) {
      if (!seen.has(i)) {
        ctx.addIssue({
          code: "custom",
          path: ["earth_plate", "palaces"],
          message: `Thiếu cung index ${i}.`,
        });
        return;
      }
    }
  });

export type ChartResponse = z.infer<typeof chartResponseSchema>;
export type PalaceInfo = z.infer<typeof palaceSchema>;
export type StarInfo = z.infer<typeof starSchema>;
export type ChartFormation = z.infer<typeof formationSchema>;
export type FormationQuality = z.infer<typeof formationQualitySchema>;
export type OverviewItem = z.infer<typeof overviewItemSchema>;
export type PeriodReading = z.infer<typeof periodReadingSchema>;
export type ChartMeta = NonNullable<z.infer<typeof chartMetaSchema>>;

export function validateChartResponse(data: unknown): ChartResponse {
  return chartResponseSchema.parse(data);
}

export function safeValidateChartResponse(
  data: unknown,
): { ok: true; data: ChartResponse } | { ok: false; message: string } {
  const result = chartResponseSchema.safeParse(data);
  if (result.success) return { ok: true, data: result.data };
  const message = result.error.issues.map((i) => i.message).join("; ");
  return { ok: false, message: message || "Phản hồi API không hợp lệ." };
}
