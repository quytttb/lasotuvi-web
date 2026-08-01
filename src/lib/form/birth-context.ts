import { z } from "zod";

import {
  birthPlaceLabel,
  countryFromPlaceId,
  getBirthPlace,
  getCountryTimezone,
  type BirthCountryCode,
} from "@/lib/form/birth-places";

export const MARITAL_STATUS_OPTIONS = [
  { value: "", label: "Không tiết lộ" },
  { value: "single", label: "Độc thân" },
  { value: "married", label: "Đã kết hôn" },
  { value: "divorced", label: "Ly hôn" },
  { value: "remarried", label: "Tái hôn" },
] as const;

export const CHILDREN_STATUS_OPTIONS = [
  { value: "", label: "Không tiết lộ" },
  { value: "has_children", label: "Có con" },
  { value: "no_children", label: "Chưa có con" },
] as const;

export const maritalStatusSchema = z.enum(["", "single", "married", "divorced", "remarried"]);
export const childrenStatusSchema = z.enum(["", "has_children", "no_children"]);
export const birthCountrySchema = z.enum(["", "vn", "tw", "cn", "hk"]);

/** Local IndexedDB context (place id + life-context enums). */
export const birthContextSchema = z.object({
  birthCountry: birthCountrySchema.optional().default(""),
  birthPlaceId: z.string().nullable(),
  maritalStatus: maritalStatusSchema,
  childrenStatus: childrenStatusSchema,
});

export type BirthContext = z.infer<typeof birthContextSchema>;
export type MaritalStatus = z.infer<typeof maritalStatusSchema>;
export type ChildrenStatus = z.infer<typeof childrenStatusSchema>;

export function defaultBirthContext(): BirthContext {
  return {
    birthCountry: "vn",
    birthPlaceId: null,
    maritalStatus: "",
    childrenStatus: "",
  };
}

/** Normalize legacy records that lack birthCountry. */
export function normalizeBirthContext(raw: unknown): BirthContext {
  const parsed = birthContextSchema.safeParse(raw ?? defaultBirthContext());
  if (!parsed.success) return defaultBirthContext();
  const ctx = parsed.data;
  if (!ctx.birthCountry && ctx.birthPlaceId) {
    return {
      ...ctx,
      birthCountry: countryFromPlaceId(ctx.birthPlaceId) || "vn",
    };
  }
  if (!ctx.birthCountry) {
    return { ...ctx, birthCountry: "vn" };
  }
  return ctx;
}

export function maritalStatusLabel(value: MaritalStatus | string): string | null {
  if (!value) return null;
  return MARITAL_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? null;
}

export function childrenStatusLabel(value: ChildrenStatus | string): string | null {
  if (!value) return null;
  return CHILDREN_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? null;
}

export function hasBirthContextDetails(ctx: BirthContext | null | undefined): boolean {
  if (!ctx) return false;
  return Boolean(ctx.birthPlaceId || ctx.maritalStatus || ctx.childrenStatus);
}

export function summarizeBirthContext(ctx: BirthContext | null | undefined): string[] {
  if (!ctx) return [];
  const parts: string[] = [];
  const place = birthPlaceLabel(ctx.birthPlaceId);
  if (place) parts.push(`Sinh tại ${place}`);
  const marital = maritalStatusLabel(ctx.maritalStatus);
  if (marital) parts.push(marital);
  const children = childrenStatusLabel(ctx.childrenStatus);
  if (children) parts.push(children);
  return parts;
}

/** Derive timezone for API: place → country default → 7. */
export function deriveTimezone(params: {
  birthPlaceId?: string | null;
  birthCountry?: string | null;
}): number {
  const place = getBirthPlace(params.birthPlaceId);
  if (place) return place.timezone;
  return getCountryTimezone(params.birthCountry);
}

/** Longitude-only offset vs civil zone meridian (minutes). Positive = local solar later than clock. */
export function longitudeCorrectionMinutes(longitude: number, timezone: number): number {
  return (longitude - timezone * 15) * 4;
}

export function formatTrueSolarHint(placeId: string | null | undefined): string | null {
  const place = getBirthPlace(placeId);
  if (!place) return null;
  const minutes = longitudeCorrectionMinutes(place.longitude, place.timezone);
  const abs = Math.abs(minutes);
  const rounded = Math.round(abs);
  if (rounded < 1) {
    return `${place.label}: gần kinh tuyến chuẩn UTC+${place.timezone}, chỉnh giờ theo kinh độ ~0 phút.`;
  }
  const direction = minutes > 0 ? "cộng" : "trừ";
  return `${place.label}: ước tính chỉnh giờ theo kinh độ ~${direction} ${rounded} phút so với đồng hồ (chỉ ảnh hưởng nếu giờ sinh sát ranh giới địa chi; cần giờ đồng hồ HH:mm mới đổi địa chi).`;
}

export type { BirthCountryCode };
