import { describe, expect, it } from "vitest";

import {
  deriveTimezone,
  formatTrueSolarHint,
  longitudeCorrectionMinutes,
  summarizeBirthContext,
} from "@/lib/form/birth-context";
import {
  BIRTH_PLACES,
  getBirthPlace,
  placesForCountry,
} from "@/lib/form/birth-places";

describe("birth places catalog", () => {
  it("covers all VN provinces/cities", () => {
    const vn = placesForCountry("vn");
    expect(vn).toHaveLength(63);
    expect(getBirthPlace("vn-ha-noi")?.timezone).toBe(7);
    expect(getBirthPlace("vn-ho-chi-minh")?.latitude).toBeCloseTo(10.78, 1);
  });

  it("filters by country", () => {
    expect(placesForCountry("tw").every((p) => p.country === "tw")).toBe(true);
    expect(getBirthPlace("tw-taipei")?.timezone).toBe(8);
    expect(BIRTH_PLACES.every((p) => p.latitude != null && p.longitude != null)).toBe(true);
  });
});

describe("timezone derive", () => {
  it("uses place timezone when set", () => {
    expect(deriveTimezone({ birthPlaceId: "tw-taipei", birthCountry: "vn" })).toBe(8);
  });

  it("falls back to country then 7", () => {
    expect(deriveTimezone({ birthCountry: "cn" })).toBe(8);
    expect(deriveTimezone({})).toBe(7);
  });
});

describe("true solar longitude hint", () => {
  it("is near zero for Hanoi on UTC+7", () => {
    const place = getBirthPlace("vn-ha-noi")!;
    const minutes = longitudeCorrectionMinutes(place.longitude, place.timezone);
    expect(Math.abs(minutes)).toBeLessThan(5);
  });

  it("is large for Urumqi on UTC+8", () => {
    const place = getBirthPlace("cn-urumqi")!;
    const minutes = longitudeCorrectionMinutes(place.longitude, place.timezone);
    expect(minutes).toBeLessThan(-100);
  });

  it("formats a readable hint", () => {
    expect(formatTrueSolarHint("vn-ho-chi-minh")).toMatch(/chỉnh giờ theo kinh độ/i);
    expect(formatTrueSolarHint("")).toBeNull();
  });
});

describe("birth context summary", () => {
  it("joins selected labels", () => {
    expect(
      summarizeBirthContext({
        birthCountry: "vn",
        birthPlaceId: "vn-ha-noi",
        maritalStatus: "married",
        childrenStatus: "has_children",
      }),
    ).toEqual(["Sinh tại Hà Nội", "Đã kết hôn", "Có con"]);
  });
});
