import { z } from "zod";

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

function isValidGregorianDate(year: number, month: number, day: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day
  );
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
  })
  .superRefine((data, ctx) => {
    if (data.is_solar) {
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
    timezone: z.number().int().min(-12).max(14),
  })
  .superRefine((data, ctx) => {
    const isSolar = data.is_solar === "true";
    if (isSolar) {
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
    if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(data.hour)) {
      ctx.addIssue({
        code: "custom",
        path: ["hour"],
        message: "Giờ sinh phải là một trong 12 giờ địa chi.",
      });
    }
  });

export type BirthFormValues = z.infer<typeof birthFormSchema>;

export function mapGenderToApi(value: "1" | "-1"): 1 | -1 {
  return value === "1" ? 1 : -1;
}

export function mapGenderToLabel(gender: 1 | -1): string {
  return gender === 1 ? "Nam" : "Nữ";
}

export function formValuesToBirthInfo(values: BirthFormValues): BirthInfoRequest {
  return birthInfoSchema.parse({
    day: values.day,
    month: values.month,
    year: values.year,
    hour: values.hour,
    gender: mapGenderToApi(values.gender),
    is_solar: values.is_solar === "true",
    timezone: values.timezone,
    name: values.name?.trim() ? values.name.trim() : null,
    view_year: values.view_year,
  });
}

export function birthInfoToFormValues(info: BirthInfoRequest): BirthFormValues {
  return {
    name: info.name ?? "",
    gender: info.gender === 1 ? "1" : "-1",
    is_solar: info.is_solar ? "true" : "false",
    day: info.day,
    month: info.month,
    year: info.year,
    hour: info.hour,
    view_year: info.view_year ?? new Date().getFullYear(),
    timezone: info.timezone ?? 7,
  };
}

export function defaultBirthFormValues(): BirthFormValues {
  const now = new Date();
  return {
    name: "",
    gender: "1",
    is_solar: "true",
    day: 15,
    month: 8,
    year: 1990,
    hour: 7,
    view_year: now.getFullYear(),
    timezone: 7,
  };
}
