export type FiveElement = {
  symbol: string;
  name: string;
  color: string;
};

/** Ngũ hành theo thứ tự Kim – Mộc – Thủy – Hỏa – Thổ (trái sang phải). */
export const FIVE_ELEMENTS: FiveElement[] = [
  { symbol: "金", name: "Kim", color: "var(--metal)" },
  { symbol: "木", name: "Mộc", color: "var(--wood)" },
  { symbol: "水", name: "Thủy", color: "var(--water)" },
  { symbol: "火", name: "Hỏa", color: "var(--fire)" },
  { symbol: "土", name: "Thổ", color: "var(--earth)" },
];
