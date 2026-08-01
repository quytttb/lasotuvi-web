export type BirthCountryCode = "vn" | "tw" | "cn" | "hk";

export type BirthPlace = {
  id: string;
  country: BirthCountryCode;
  label: string;
  /** Approximate longitude east of Greenwich (degrees). */
  longitude: number;
  /** Approximate latitude (degrees); optional for API but preferred. */
  latitude: number;
  /** Civil timezone offset used for standard time (e.g. VN = 7). */
  timezone: number;
};

export const BIRTH_COUNTRIES = [
  { value: "vn" as const, label: "Việt Nam", timezone: 7 },
  { value: "tw" as const, label: "Đài Loan", timezone: 8 },
  { value: "cn" as const, label: "Trung Quốc", timezone: 8 },
  { value: "hk" as const, label: "Hồng Kông", timezone: 8 },
] as const;

export function getCountryTimezone(country: string | null | undefined): number {
  const found = BIRTH_COUNTRIES.find((c) => c.value === country);
  return found?.timezone ?? 7;
}

function vn(id: string, label: string, longitude: number, latitude: number): BirthPlace {
  return { id: `vn-${id}`, country: "vn", label, longitude, latitude, timezone: 7 };
}

/**
 * Curated birth regions. Longitudes/latitudes are city/province centroids —
 * accurate enough for 2-hour địa chi windows.
 * Việt Nam: đủ tỉnh/thành (danh mục hành chính phổ biến khi khai sinh).
 */
export const BIRTH_PLACES: readonly BirthPlace[] = [
  // —— Việt Nam (63 tỉnh/thành) ——
  vn("an-giang", "An Giang", 105.13, 10.52),
  vn("ba-ria-vung-tau", "Bà Rịa – Vũng Tàu", 107.17, 10.5),
  vn("bac-giang", "Bắc Giang", 106.19, 21.28),
  vn("bac-kan", "Bắc Kạn", 105.83, 22.15),
  vn("bac-lieu", "Bạc Liêu", 105.72, 9.29),
  vn("bac-ninh", "Bắc Ninh", 106.08, 21.19),
  vn("ben-tre", "Bến Tre", 106.38, 10.24),
  vn("binh-dinh", "Bình Định", 109.12, 13.78),
  vn("binh-duong", "Bình Dương", 106.65, 11.17),
  vn("binh-phuoc", "Bình Phước", 106.92, 11.65),
  vn("binh-thuan", "Bình Thuận", 108.1, 10.93),
  vn("ca-mau", "Cà Mau", 105.15, 9.18),
  vn("can-tho", "Cần Thơ", 105.78, 10.05),
  vn("cao-bang", "Cao Bằng", 106.25, 22.67),
  vn("da-nang", "Đà Nẵng", 108.2, 16.05),
  vn("dak-lak", "Đắk Lắk", 108.05, 12.67),
  vn("dak-nong", "Đắk Nông", 107.69, 12.0),
  vn("dien-bien", "Điện Biên", 103.02, 21.39),
  vn("dong-nai", "Đồng Nai", 106.97, 10.95),
  vn("dong-thap", "Đồng Tháp", 105.63, 10.45),
  vn("gia-lai", "Gia Lai", 108.0, 13.98),
  vn("ha-giang", "Hà Giang", 104.98, 22.82),
  vn("ha-nam", "Hà Nam", 105.92, 20.54),
  vn("ha-noi", "Hà Nội", 105.85, 21.03),
  vn("ha-tinh", "Hà Tĩnh", 105.9, 18.34),
  vn("hai-duong", "Hải Dương", 106.33, 20.94),
  vn("hai-phong", "Hải Phòng", 106.69, 20.84),
  vn("hau-giang", "Hậu Giang", 105.64, 9.78),
  vn("hoa-binh", "Hòa Bình", 105.34, 20.81),
  vn("hung-yen", "Hưng Yên", 106.05, 20.65),
  vn("khanh-hoa", "Khánh Hòa", 109.19, 12.25),
  vn("kien-giang", "Kiên Giang", 105.08, 10.01),
  vn("kon-tum", "Kon Tum", 108.0, 14.35),
  vn("lai-chau", "Lai Châu", 103.16, 22.4),
  vn("lam-dong", "Lâm Đồng", 108.44, 11.94),
  vn("lang-son", "Lạng Sơn", 106.76, 21.85),
  vn("lao-cai", "Lào Cai", 103.97, 22.49),
  vn("long-an", "Long An", 106.41, 10.7),
  vn("nam-dinh", "Nam Định", 106.17, 20.42),
  vn("nghe-an", "Nghệ An", 105.69, 18.67),
  vn("ninh-binh", "Ninh Bình", 105.97, 20.25),
  vn("ninh-thuan", "Ninh Thuận", 108.99, 11.56),
  vn("phu-tho", "Phú Thọ", 105.31, 21.4),
  vn("phu-yen", "Phú Yên", 109.18, 13.09),
  vn("quang-binh", "Quảng Bình", 106.62, 17.47),
  vn("quang-nam", "Quảng Nam", 108.34, 15.57),
  vn("quang-ngai", "Quảng Ngãi", 108.79, 15.12),
  vn("quang-ninh", "Quảng Ninh", 107.08, 21.01),
  vn("quang-tri", "Quảng Trị", 107.19, 16.75),
  vn("soc-trang", "Sóc Trăng", 105.97, 9.6),
  vn("son-la", "Sơn La", 103.91, 21.33),
  vn("tay-ninh", "Tây Ninh", 106.1, 11.31),
  vn("thai-binh", "Thái Bình", 106.34, 20.45),
  vn("thai-nguyen", "Thái Nguyên", 105.84, 21.59),
  vn("thanh-hoa", "Thanh Hóa", 105.78, 19.81),
  vn("thua-thien-hue", "Thừa Thiên Huế", 107.59, 16.46),
  vn("tien-giang", "Tiền Giang", 106.36, 10.36),
  vn("ho-chi-minh", "TP. Hồ Chí Minh", 106.7, 10.78),
  vn("tra-vinh", "Trà Vinh", 106.34, 9.93),
  vn("tuyen-quang", "Tuyên Quang", 105.22, 21.82),
  vn("vinh-long", "Vĩnh Long", 105.97, 10.25),
  vn("vinh-phuc", "Vĩnh Phúc", 105.6, 21.31),
  vn("yen-bai", "Yên Bái", 104.87, 21.7),

  // —— Đài Loan ——
  {
    id: "tw-taipei",
    country: "tw",
    label: "Đài Bắc",
    longitude: 121.57,
    latitude: 25.03,
    timezone: 8,
  },
  {
    id: "tw-new-taipei",
    country: "tw",
    label: "Tân Bắc",
    longitude: 121.47,
    latitude: 25.02,
    timezone: 8,
  },
  {
    id: "tw-keelung",
    country: "tw",
    label: "Cơ Long",
    longitude: 121.74,
    latitude: 25.13,
    timezone: 8,
  },
  {
    id: "tw-taoyuan",
    country: "tw",
    label: "Đào Viên",
    longitude: 121.3,
    latitude: 24.99,
    timezone: 8,
  },
  {
    id: "tw-hsinchu",
    country: "tw",
    label: "Tân Trúc",
    longitude: 120.97,
    latitude: 24.8,
    timezone: 8,
  },
  {
    id: "tw-miaoli",
    country: "tw",
    label: "Miêu Lật",
    longitude: 120.82,
    latitude: 24.56,
    timezone: 8,
  },
  {
    id: "tw-taichung",
    country: "tw",
    label: "Đài Trung",
    longitude: 120.67,
    latitude: 24.15,
    timezone: 8,
  },
  {
    id: "tw-changhua",
    country: "tw",
    label: "Chương Hóa",
    longitude: 120.53,
    latitude: 24.08,
    timezone: 8,
  },
  {
    id: "tw-nantou",
    country: "tw",
    label: "Nam Đầu",
    longitude: 120.68,
    latitude: 23.91,
    timezone: 8,
  },
  {
    id: "tw-yunlin",
    country: "tw",
    label: "Vân Lâm",
    longitude: 120.43,
    latitude: 23.71,
    timezone: 8,
  },
  {
    id: "tw-chiayi",
    country: "tw",
    label: "Gia Nghĩa",
    longitude: 120.45,
    latitude: 23.48,
    timezone: 8,
  },
  {
    id: "tw-tainan",
    country: "tw",
    label: "Đài Nam",
    longitude: 120.21,
    latitude: 22.99,
    timezone: 8,
  },
  {
    id: "tw-kaohsiung",
    country: "tw",
    label: "Cao Hùng",
    longitude: 120.31,
    latitude: 22.63,
    timezone: 8,
  },
  {
    id: "tw-pingtung",
    country: "tw",
    label: "Bình Đông",
    longitude: 120.49,
    latitude: 22.67,
    timezone: 8,
  },
  {
    id: "tw-yilan",
    country: "tw",
    label: "Nghi Lan",
    longitude: 121.75,
    latitude: 24.75,
    timezone: 8,
  },
  {
    id: "tw-hualien",
    country: "tw",
    label: "Hoa Liên",
    longitude: 121.61,
    latitude: 23.99,
    timezone: 8,
  },
  {
    id: "tw-taitung",
    country: "tw",
    label: "Đài Đông",
    longitude: 121.14,
    latitude: 22.76,
    timezone: 8,
  },
  {
    id: "tw-penghu",
    country: "tw",
    label: "Bành Hồ",
    longitude: 119.58,
    latitude: 23.57,
    timezone: 8,
  },

  // —— Trung Quốc (một số thành phố phổ biến) ——
  {
    id: "cn-beijing",
    country: "cn",
    label: "Bắc Kinh",
    longitude: 116.41,
    latitude: 39.9,
    timezone: 8,
  },
  {
    id: "cn-shanghai",
    country: "cn",
    label: "Thượng Hải",
    longitude: 121.47,
    latitude: 31.23,
    timezone: 8,
  },
  {
    id: "cn-guangzhou",
    country: "cn",
    label: "Quảng Châu",
    longitude: 113.26,
    latitude: 23.13,
    timezone: 8,
  },
  {
    id: "cn-shenzhen",
    country: "cn",
    label: "Thâm Quyến",
    longitude: 114.06,
    latitude: 22.54,
    timezone: 8,
  },
  {
    id: "cn-chengdu",
    country: "cn",
    label: "Thành Đô",
    longitude: 104.07,
    latitude: 30.57,
    timezone: 8,
  },
  {
    id: "cn-chongqing",
    country: "cn",
    label: "Trùng Khánh",
    longitude: 106.55,
    latitude: 29.56,
    timezone: 8,
  },
  {
    id: "cn-wuhan",
    country: "cn",
    label: "Vũ Hán",
    longitude: 114.31,
    latitude: 30.59,
    timezone: 8,
  },
  {
    id: "cn-xian",
    country: "cn",
    label: "Tây An",
    longitude: 108.94,
    latitude: 34.34,
    timezone: 8,
  },
  {
    id: "cn-kunming",
    country: "cn",
    label: "Côn Minh",
    longitude: 102.71,
    latitude: 25.04,
    timezone: 8,
  },
  {
    id: "cn-urumqi",
    country: "cn",
    label: "Ürümqi",
    longitude: 87.62,
    latitude: 43.83,
    timezone: 8,
  },

  // —— Hồng Kông ——
  {
    id: "hk-hongkong",
    country: "hk",
    label: "Hồng Kông",
    longitude: 114.17,
    latitude: 22.32,
    timezone: 8,
  },
] as const;

const placeById = new Map(BIRTH_PLACES.map((p) => [p.id, p]));

export function getBirthPlace(id: string | null | undefined): BirthPlace | undefined {
  if (!id) return undefined;
  return placeById.get(id);
}

export function birthPlaceLabel(id: string | null | undefined): string | null {
  return getBirthPlace(id)?.label ?? null;
}

export function placesForCountry(country: string | null | undefined): BirthPlace[] {
  if (!country) return [];
  return BIRTH_PLACES.filter((p) => p.country === country);
}

export function countryFromPlaceId(id: string | null | undefined): BirthCountryCode | "" {
  return getBirthPlace(id)?.country ?? "";
}

export function toApiBirthPlace(place: BirthPlace): {
  label: string;
  longitude: number;
  latitude: number;
} {
  return {
    label: place.label,
    longitude: place.longitude,
    latitude: place.latitude,
  };
}
