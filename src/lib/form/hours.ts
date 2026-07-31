export type HourBranch = {
  value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  name: string;
  range: string;
  label: string;
};

/** 12 giờ địa chi — không gửi giờ đồng hồ 0..23 vào trường hour. */
export const HOUR_BRANCHES: readonly HourBranch[] = [
  { value: 1, name: "Tý", range: "23:00–00:59", label: "1. Tý — 23:00–00:59" },
  { value: 2, name: "Sửu", range: "01:00–02:59", label: "2. Sửu — 01:00–02:59" },
  { value: 3, name: "Dần", range: "03:00–04:59", label: "3. Dần — 03:00–04:59" },
  { value: 4, name: "Mão", range: "05:00–06:59", label: "4. Mão — 05:00–06:59" },
  { value: 5, name: "Thìn", range: "07:00–08:59", label: "5. Thìn — 07:00–08:59" },
  { value: 6, name: "Tỵ", range: "09:00–10:59", label: "6. Tỵ — 09:00–10:59" },
  { value: 7, name: "Ngọ", range: "11:00–12:59", label: "7. Ngọ — 11:00–12:59" },
  { value: 8, name: "Mùi", range: "13:00–14:59", label: "8. Mùi — 13:00–14:59" },
  { value: 9, name: "Thân", range: "15:00–16:59", label: "9. Thân — 15:00–16:59" },
  { value: 10, name: "Dậu", range: "17:00–18:59", label: "10. Dậu — 17:00–18:59" },
  { value: 11, name: "Tuất", range: "19:00–20:59", label: "11. Tuất — 19:00–20:59" },
  { value: 12, name: "Hợi", range: "21:00–22:59", label: "12. Hợi — 21:00–22:59" },
] as const;

export function getHourBranch(value: number): HourBranch | undefined {
  return HOUR_BRANCHES.find((h) => h.value === value);
}
