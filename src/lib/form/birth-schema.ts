import { z } from "zod";

import {
  birthContextSchema,
  birthCountrySchema,
  childrenStatusSchema,
  defaultBirthContext,
  deriveTimezone,
  maritalStatusSchema,
  normalizeBirthContext,
  type BirthContext,
} from "@/lib/form/birth-context";
import { getBirthPlace, toApiBirthPlace } from "@/lib/form/birth-places";

export const genderSchema = z.union([z.literal(1), z.literal(-1)]);
export const hourSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
]);

const apiBirthPlaceSchema = z.object({
  label: z.string().max(200).nullable().optional(),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90).nullable().optional(),
});

const apiLifeContextSchema = z.object({
  marital_status: z.enum(["single", "married", "divorced", "remarried"]).nullable().optional(),
  children_status: z.enum(["has_children", "no_children"]).nullable().optional(),
});

function isValidGregorianDate(year: number, month: number, day: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

/** Shared Gregorian/lunar day checks for birthInfo and birthForm schemas. */
function refineBirthDate(
  data: { year: number; month: number; day: number; isSolar: boolean },
  ctx: z.RefinementCtx,
) {
  if (data.isSolar) {
    if (!isValidGregorianDate(data.year, data.month, data.day)) {
      ctx.addIssue({
        code: "custom",
        path: ["day"],
        message: "Ngày dương lịch không hợp lệ (kiểm tra tháng và năm nhuận).",
      });
    }
  } else if (data.day > 30) {
    ctx.addIssue({
      code: "custom",
      path: ["day"],
      message: "Ngày âm lịch phải từ 1 đến 30.",
    });
  }
}

export const birthInfoSchema = z
  .object({
    day: z.number().int().min(1).max(31),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(1900).max(2100),
    hour: hourSchema,
    gender: genderSchema,
    is_solar: z.boolean(),
    timezone: z.number().int().min(-12).max(14).default(7),
    name: z
      .string()
      .trim()
      .max(100, "Tên tối đa 100 ký tự")
      .optional()
      .nullable()
      .transform((v) => (v && v.length > 0 ? v : null)),
    view_year: z.number().int().min(1900).max(2200),
    birth_place: apiBirthPlaceSchema.nullable().optional(),
    clock_time: z.string().nullable().optional(),
    life_context: apiLifeContextSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    refineBirthDate(
      { year: data.year, month: data.month, day: data.day, isSolar: data.is_solar },
      ctx,
    );
  });

export type BirthInfoRequest = z.infer<typeof birthInfoSchema>;

/** Form values use strings for select inputs; numbers come from valueAsNumber. */
export const birthFormSchema = z
  .object({
    name: z.string().max(100),
    gender: z.enum(["1", "-1"]),
    is_solar: z.enum(["true", "false"]),
    day: z.number().int().min(1).max(31),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(1900).max(2100),
    hour: z.number().int().min(1).max(12),
    view_year: z.number().int().min(1900).max(2200),
    birth_country: birthCountrySchema,
    /** Empty string = not selected (optional). */
    birth_place: z.string(),
    marital_status: maritalStatusSchema,
    children_status: childrenStatusSchema,
  })
  .superRefine((data, ctx) => {
    refineBirthDate(
      {
        year: data.year,
        month: data.month,
        day: data.day,
        isSolar: data.is_solar === "true",
      },
      ctx,
    );
    if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(data.hour)) {
      ctx.addIssue({
        code: "custom",
        path: ["hour"],
        message: "Giờ sinh phải là một trong 12 giờ địa chi.",
      });
    }
    if (data.birth_place) {
      const place = getBirthPlace(data.birth_place);
      if (!place) {
        ctx.addIssue({
          code: "custom",
          path: ["birth_place"],
          message: "Khu vực sinh không hợp lệ.",
        });
      } else if (data.birth_country && place.country !== data.birth_country) {
        ctx.addIssue({
          code: "custom",
          path: ["birth_place"],
          message: "Khu vực sinh không thuộc quốc gia đã chọn.",
        });
      }
    }
  });

export type BirthFormValues = z.infer<typeof birthFormSchema>;
export type { BirthContext };

export function mapGenderToApi(value: "1" | "-1"): 1 | -1 {
  return value === "1" ? 1 : -1;
}

export function mapGenderToLabel(gender: 1 | -1): string {
  return gender === 1 ? "Nam" : "Nữ";
}

function buildLifeContext(values: BirthFormValues): BirthInfoRequest["life_context"] | undefined {
  const marital = values.marital_status || null;
  const children = values.children_status || null;
  if (!marital && !children) return undefined;
  return {
    marital_status: marital || null,
    children_status: children || null,
  };
}

export function formValuesToBirthInfo(values: BirthFormValues): BirthInfoRequest {
  const place = getBirthPlace(values.birth_place);
  const timezone = deriveTimezone({
    birthPlaceId: values.birth_place,
    birthCountry: values.birth_country,
  });
  const lifeContext = buildLifeContext(values);

  return birthInfoSchema.parse({
    day: values.day,
    month: values.month,
    year: values.year,
    hour: values.hour,
    gender: mapGenderToApi(values.gender),
    is_solar: values.is_solar === "true",
    timezone,
    name: values.name?.trim() ? values.name.trim() : null,
    view_year: values.view_year,
    birth_place: place ? toApiBirthPlace(place) : undefined,
    life_context: lifeContext,
  });
}

export function formValuesToBirthContext(values: BirthFormValues): BirthContext {
  return birthContextSchema.parse({
    birthCountry: values.birth_country || "vn",
    birthPlaceId: values.birth_place.trim() ? values.birth_place : null,
    maritalStatus: values.marital_status,
    childrenStatus: values.children_status,
  });
}

export function birthInfoToFormValues(
  info: BirthInfoRequest,
  context?: BirthContext | null,
): BirthFormValues {
  const ctx = normalizeBirthContext(context ?? defaultBirthContext());
  return {
    name: info.name ?? "",
    gender: info.gender === 1 ? "1" : "-1",
    is_solar: info.is_solar ? "true" : "false",
    day: info.day,
    month: info.month,
    year: info.year,
    hour: info.hour,
    view_year: info.view_year ?? new Date().getFullYear(),
    birth_country: ctx.birthCountry || "vn",
    birth_place: ctx.birthPlaceId ?? "",
    marital_status: ctx.maritalStatus,
    children_status: ctx.childrenStatus,
  };
}

export function defaultBirthFormValues(): BirthFormValues {
  const now = new Date();
  const ctx = defaultBirthContext();
  return {
    name: "",
    gender: "1",
    is_solar: "true",
    day: 15,
    month: 8,
    year: 1990,
    hour: 7,
    view_year: now.getFullYear(),
    birth_country: ctx.birthCountry || "vn",
    birth_place: ctx.birthPlaceId ?? "",
    marital_status: ctx.maritalStatus,
    children_status: ctx.childrenStatus,
  };
}
