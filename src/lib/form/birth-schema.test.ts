import { describe, expect, it } from "vitest";

import {
  birthFormSchema,
  birthInfoSchema,
  formValuesToBirthInfo,
  mapGenderToApi,
} from "@/lib/form/birth-schema";
import { HOUR_BRANCHES } from "@/lib/form/hours";
import { getPalaceGridStyle, PALACE_GRID_POSITION } from "@/lib/chart/palace-grid";
import { safeValidateChartResponse } from "@/lib/chart/validate";
import sampleChart from "@/test/fixtures/sample-chart.json";

describe("birth schemas", () => {
  it("accepts valid solar dates including leap years", () => {
    expect(
      birthInfoSchema.parse({
        day: 29,
        month: 2,
        year: 2024,
        hour: 1,
        gender: 1,
        is_solar: true,
        timezone: 7,
        view_year: 2026,
      }),
    ).toMatchObject({ day: 29, month: 2, year: 2024 });
  });

  it("rejects invalid solar dates", () => {
    const result = birthFormSchema.safeParse({
      name: "",
      gender: "1",
      is_solar: "true",
      day: 31,
      month: 2,
      year: 1990,
      hour: 7,
      view_year: 2026,
      birth_country: "vn",
      birth_place: "",
      marital_status: "",
      children_status: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects lunar day > 30", () => {
    const result = birthInfoSchema.safeParse({
      day: 31,
      month: 1,
      year: 1990,
      hour: 1,
      gender: -1,
      is_solar: false,
      timezone: 7,
      view_year: 2026,
    });
    expect(result.success).toBe(false);
  });

  it("maps gender form values", () => {
    expect(mapGenderToApi("1")).toBe(1);
    expect(mapGenderToApi("-1")).toBe(-1);
    const info = formValuesToBirthInfo({
      name: "A",
      gender: "-1",
      is_solar: "false",
      day: 10,
      month: 5,
      year: 1995,
      hour: 3,
      view_year: 2026,
      birth_country: "vn",
      birth_place: "",
      marital_status: "",
      children_status: "",
    });
    expect(info.gender).toBe(-1);
    expect(info.is_solar).toBe(false);
    expect(info.hour).toBe(3);
    expect(info.timezone).toBe(7);
    expect(info.birth_place).toBeUndefined();
    expect(info.life_context).toBeUndefined();
  });

  it("sends birth_place, timezone and life_context from form", () => {
    const info = formValuesToBirthInfo({
      name: "",
      gender: "1",
      is_solar: "true",
      day: 15,
      month: 8,
      year: 1990,
      hour: 7,
      view_year: 2026,
      birth_country: "tw",
      birth_place: "tw-taipei",
      marital_status: "married",
      children_status: "has_children",
    });
    expect(info.timezone).toBe(8);
    expect(info.birth_place).toMatchObject({
      label: "Đài Bắc",
      longitude: 121.57,
      latitude: 25.03,
    });
    expect(info.life_context).toEqual({
      marital_status: "married",
      children_status: "has_children",
    });
  });

  it("derives timezone from country when place omitted", () => {
    const info = formValuesToBirthInfo({
      name: "",
      gender: "1",
      is_solar: "true",
      day: 1,
      month: 1,
      year: 2000,
      hour: 1,
      view_year: 2026,
      birth_country: "hk",
      birth_place: "",
      marital_status: "",
      children_status: "",
    });
    expect(info.timezone).toBe(8);
    expect(info.birth_place).toBeUndefined();
  });
});

describe("hour branches", () => {
  it("has 12 địa chi hours", () => {
    expect(HOUR_BRANCHES).toHaveLength(12);
    expect(HOUR_BRANCHES[0]).toMatchObject({ value: 1, name: "Tý" });
    expect(HOUR_BRANCHES[11]).toMatchObject({ value: 12, name: "Hợi" });
  });
});

describe("palace grid", () => {
  it("maps indexes to traditional coordinates", () => {
    expect(PALACE_GRID_POSITION[6]).toEqual({ row: 1, col: 1 });
    expect(PALACE_GRID_POSITION[1]).toEqual({ row: 4, col: 3 });
    expect(PALACE_GRID_POSITION[12]).toEqual({ row: 4, col: 4 });
    expect(getPalaceGridStyle(7)).toEqual({ gridRow: 1, gridColumn: 2 });
  });
});

describe("chart validation", () => {
  it("accepts sample chart fixture", () => {
    const result = safeValidateChartResponse(sampleChart);
    expect(result.ok).toBe(true);
  });

  it("rejects missing palace", () => {
    const bad = structuredClone(sampleChart);
    bad.earth_plate.palaces = bad.earth_plate.palaces.filter(
      (p: { index: number }) => p.index !== 5,
    );
    const result = safeValidateChartResponse(bad);
    expect(result.ok).toBe(false);
  });

  it("rejects duplicate palace index", () => {
    const bad = structuredClone(sampleChart);
    bad.earth_plate.palaces[0].index = bad.earth_plate.palaces[1].index;
    const result = safeValidateChartResponse(bad);
    expect(result.ok).toBe(false);
  });
});
