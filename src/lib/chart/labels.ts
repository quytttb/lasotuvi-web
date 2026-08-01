/** API mutagen codes → nhãn tiếng Việt (Tứ Hóa). */
const MUTAGEN_LABELS: Record<string, string> = {
  hua_lu: "Hóa Lộc",
  hua_quan: "Hóa Quyền",
  hua_ke: "Hóa Khoa",
  hua_ji: "Hóa Kỵ",
};

/** Ngũ hành từ API (không dấu / Hán Việt) → nhãn. */
const ELEMENT_LABELS: Record<string, string> = {
  moc: "Mộc",
  mộc: "Mộc",
  木: "Mộc",
  hoa: "Hỏa",
  hỏa: "Hỏa",
  hoả: "Hỏa",
  火: "Hỏa",
  tho: "Thổ",
  thổ: "Thổ",
  土: "Thổ",
  kim: "Kim",
  金: "Kim",
  thuy: "Thủy",
  thủy: "Thủy",
  thuỷ: "Thủy",
  水: "Thủy",
};

/** Địa chi pinyin (taboo_palaces, …) → Hán Việt. */
const BRANCH_PINYIN_LABELS: Record<string, string> = {
  zi: "Tý",
  chou: "Sửu",
  yin: "Dần",
  mao: "Mão",
  chen: "Thìn",
  si: "Tỵ",
  wu: "Ngọ",
  wei: "Mùi",
  shen: "Thân",
  you: "Dậu",
  xu: "Tuất",
  hai: "Hợi",
};

/** Độ sáng (miao_wang) code → nhãn. */
const MIAO_WANG_LABELS: Record<string, string> = {
  m: "Miếu",
  v: "Vượng",
  đ: "Đắc",
  d: "Đắc",
  h: "Hãm",
  b: "Bình",
  miếu: "Miếu",
  miao: "Miếu",
  vượng: "Vượng",
  wang: "Vượng",
  đắc: "Đắc",
  de: "Đắc",
  hãm: "Hãm",
  xian: "Hãm",
  bình: "Bình",
  ping: "Bình",
};

/** Nhóm sao API → nhãn tiếng Việt. */
const CATEGORY_LABELS: Record<string, string> = {
  major_star: "Chính tinh",
  minor_star: "Phụ tinh",
  malefic_star: "Sát tinh",
  blessing_star: "Cát tinh",
  noble_star: "Quý tinh",
  peach_blossom_star: "Đào hoa",
};

/**
 * Star pinyin codes → Vietnamese display names.
 * Aligned with backend `iztro_adapter._STAR_ROWS`.
 */
const STAR_CODE_LABELS: Record<string, string> = {
  palace_tone: "Luận cung",
  zi_wei: "Tử vi",
  lian_zhen: "Liêm trinh",
  tian_tong: "Thiên đồng",
  wu_qu: "Vũ khúc",
  tai_yang: "Thái Dương",
  tian_ji: "Thiên cơ",
  tian_fu: "Thiên phủ",
  tai_yin: "Thái âm",
  tan_lang: "Tham lang",
  ju_men: "Cự môn",
  tian_xiang: "Thiên tướng",
  tian_liang: "Thiên lương",
  qi_sha: "Thất sát",
  po_jun: "Phá quân",
  lu_cun: "Lộc tồn",
  tuo_luo: "Đà la",
  qing_yang: "Kình dương",
  di_kong: "Địa không",
  di_jie: "Địa kiếp",
  ling_xing: "Linh tinh",
  huo_xing: "Hỏa tinh",
  wen_chang: "Văn xương",
  wen_qu: "Văn Khúc",
  tian_kui: "Thiên khôi",
  tian_yue: "Thiên việt",
  zuo_fu: "Tả phù",
  you_bi: "Hữu bật",
  long_chi: "Long trì",
  feng_ge: "Phượng các",
  san_tai: "Tam thai",
  ba_zuo: "Bát tọa",
  en_guang: "Ân quang",
  tian_gui: "Thiên quý",
  tian_ku: "Thiên khốc",
  tian_xu: "Thiên hư",
  tian_de: "Thiên đức",
  yue_de: "Nguyệt đức",
  tian_xing: "Thiên hình",
  tian_yao: "Thiên riêu",
  hong_luan: "Hồng loan",
  tian_xi: "Thiên hỷ",
  jie_shen: "Giải thần",
  tai_fu: "Thai phụ",
  feng_gao: "Phong cáo",
  tian_cai: "Thiên tài",
  tian_shou: "Thiên thọ",
  tian_shang: "Thiên thương",
  tian_shi: "Thiên sứ",
  gu_chen: "Cô thần",
  gua_su: "Quả tú",
  tian_ma: "Thiên mã",
  po_sui: "Phá toái",
  tian_guan: "Thiên quan",
  tian_fu_blessing: "Thiên phúc",
  tian_chu: "Thiên trù",
  hua_gai: "Hoa cái",
  tian_kong: "Thiên không",
  xian_chi: "Hàm trì",
  kong_wang: "Không vong",
  nian_jie: "Niên giải",
  fei_lian: "Phi liêm",
  tian_yue_month: "Thiên nguyệt",
  tian_wu: "Thiên vu",
  jie_lu: "Triệt lộ",
  xun_kong: "Tuần không",
  yin_sha: "Âm sát",
};

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
}

/** True when meta string looks like usable Vietnamese (not engine placeholders). */
export function isDisplayableVietnameseMeta(value: string | null | undefined): boolean {
  if (value == null) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  // Placeholders / dashes only.
  if (/^[0\-–—]+$/.test(trimmed)) return false;
  // Pure ASCII tokens (O, K, kim, hua_lu, …) are engine codes — not UI copy.
  if (/^[a-z0-9_]+$/i.test(trimmed)) return false;
  return true;
}

export function formatMutagenLabel(mutagen: string | null | undefined): string | null {
  if (!mutagen) return null;
  const key = normalizeKey(mutagen);
  return MUTAGEN_LABELS[key] ?? (isDisplayableVietnameseMeta(mutagen) ? mutagen : null);
}

export function formatElementLabel(element: string | null | undefined): string | null {
  if (!element) return null;
  const key = normalizeKey(element);
  if (key === "o" || key === "0" || key === "-") return null;
  return ELEMENT_LABELS[key] ?? (isDisplayableVietnameseMeta(element) ? element : null);
}

export function formatBranchPinyinLabel(value: string | null | undefined): string {
  if (!value) return "";
  const key = normalizeKey(value);
  return BRANCH_PINYIN_LABELS[key] ?? value;
}

export function formatMiaoWangLabel(
  code: string | null | undefined,
  label?: string | null,
): string | null {
  if (label && isDisplayableVietnameseMeta(label)) return label.trim();
  if (!code) return null;
  const key = normalizeKey(code);
  return MIAO_WANG_LABELS[key] ?? (isDisplayableVietnameseMeta(code) ? code : null);
}

export function formatCategoryLabel(category: string | null | undefined): string | null {
  if (!category) return null;
  const key = normalizeKey(category);
  return CATEGORY_LABELS[key] ?? (isDisplayableVietnameseMeta(category) ? category : null);
}

export function formatStarCodeLabel(code: string | null | undefined): string {
  if (!code) return "";
  const key = normalizeKey(code);
  if (STAR_CODE_LABELS[key]) return STAR_CODE_LABELS[key];
  if (isDisplayableVietnameseMeta(code)) return code.trim();
  // Avoid Title-Case English fallback (e.g. "Fei Lian"); keep stable Vietnamese-looking token.
  return key.replace(/_/g, " ");
}

export function mutagenToneClass(mutagen: string | null | undefined): string | undefined {
  const key = mutagen ? normalizeKey(mutagen) : "";
  switch (key) {
    case "hua_lu":
      return "text-[var(--star-lu)]";
    case "hua_quan":
      return "text-[var(--star-quan)]";
    case "hua_ke":
      return "text-[var(--star-ke)]";
    case "hua_ji":
      return "text-[var(--star-ji)]";
    default:
      return undefined;
  }
}

export function categoryToneClass(categoryLabel: string | null | undefined): string | undefined {
  const key = categoryLabel ? normalizeKey(categoryLabel) : "";
  switch (key) {
    case "major_star":
      return "text-[var(--ink)]";
    case "malefic_star":
      return "text-[var(--star-malefic)]";
    case "blessing_star":
      return "text-[var(--star-blessing)]";
    case "noble_star":
      return "text-[var(--star-noble)]";
    case "peach_blossom_star":
      return "text-[var(--star-peach)]";
    case "minor_star":
      return "text-[var(--ink-soft)]";
    default:
      return "text-[var(--ink-soft)]";
  }
}
