"use client";

import { useMemo, useState } from "react";

import { ChartBoard } from "@/components/chart/ChartBoard";
import { PalaceInterpTabs } from "@/components/chart/PalaceInterpTabs";
import { parseInterpretation } from "@/lib/chart/format-interpretation";
import {
  formatBranchPinyinLabel,
  formatFormationQualityLabel,
  formatPeriodScopeLabel,
  formatPeriodToneLabel,
  formatStarCodeLabel,
  formationQualityToneClass,
  periodToneClass,
} from "@/lib/chart/labels";
import {
  getPalaceTonePresentation,
  isMajorStar,
  supportEffectToneClass,
} from "@/lib/chart/palace-tone";
import type { ChartResponse, PalaceInfo, PeriodReading } from "@/lib/chart/validate";
import {
  childrenStatusLabel,
  hasBirthContextDetails,
  maritalStatusLabel,
  summarizeBirthContext,
  type BirthContext,
} from "@/lib/form/birth-context";
import { birthPlaceLabel } from "@/lib/form/birth-places";
import { HOUR_BRANCHES } from "@/lib/form/hours";
import { cn } from "@/lib/utils/cn";

type ChartResultsProps = {
  chart: ChartResponse;
  birthContext?: BirthContext | null;
};

const SPECIAL_INTERP_STARS = new Set(["palace_tone", "mutagen_note", "life_context_note"]);

function findStarForCode(palace: PalaceInfo, starCode: string) {
  const label = formatStarCodeLabel(starCode).trim().toLowerCase();
  return palace.stars.find((s) => s.name.trim().toLowerCase() === label);
}

function StarInterpretationBlock({
  starCode,
  text,
  isMajor,
}: {
  starCode: string;
  text: string;
  isMajor: boolean;
}) {
  const parsed = useMemo(() => parseInterpretation(text), [text]);
  const title = formatStarCodeLabel(starCode);

  return (
    <article
      className={cn(
        "rounded-sm border p-4 sm:p-5 transition-all duration-200",
        isMajor
          ? "border-[var(--line)] bg-[var(--paper)] shadow-xs"
          : "border-[var(--line)]/70 bg-[var(--paper-muted)]/40",
      )}
      data-testid={isMajor ? "star-interp-major" : "star-interp-minor"}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <h4 className="font-serif text-base font-semibold text-[var(--ink)]">{title}</h4>
        {isMajor ? (
          <span className="rounded-xs border border-[var(--gold)]/40 bg-[var(--gold-soft)] px-1.5 py-0.5 text-[0.68rem] font-medium text-[var(--earth)]">
            🌟 Chính tinh chủ đạo
          </span>
        ) : parsed.minor?.role ? (
          <span
            className={cn(
              "rounded-xs px-1.5 py-0.5 text-[0.68rem] font-medium border",
              parsed.minor.role.toLowerCase().includes("sát") ||
                parsed.minor.role.toLowerCase().includes("hung") ||
                parsed.minor.role.toLowerCase().includes("bại")
                ? "border-[var(--fire)]/30 bg-[var(--fire-soft)] text-[var(--fire)]"
                : parsed.minor.role.toLowerCase().includes("cát") ||
                    parsed.minor.role.toLowerCase().includes("quý") ||
                    parsed.minor.role.toLowerCase().includes("phúc")
                  ? "border-[var(--wood)]/30 bg-[var(--wood-soft)] text-[var(--wood)]"
                  : "border-[var(--line)] bg-[var(--paper-muted)]/80 text-[var(--ink-muted)]",
            )}
          >
            {parsed.minor.role.toLowerCase().includes("sát") ||
            parsed.minor.role.toLowerCase().includes("hung")
              ? `⚡ ${parsed.minor.role} (Cần lưu ý)`
              : parsed.minor.role.toLowerCase().includes("cát") ||
                  parsed.minor.role.toLowerCase().includes("quý")
                ? `🌟 ${parsed.minor.role} (Tốt)`
                : parsed.minor.role}
          </span>
        ) : null}
      </div>

      {parsed.isMinorTemplate && parsed.minor ? (
        <dl className="mt-2 space-y-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">
          {parsed.minor.nature ? (
            <div>
              <dt className="inline font-medium text-[var(--ink)]">Chủ: </dt>
              <dd className="inline">{parsed.minor.nature}</dd>
            </div>
          ) : null}
          {parsed.minor.favorable ? (
            <div>
              <dt className="inline font-medium text-[var(--wood)]">Thuận: </dt>
              <dd className="inline">{parsed.minor.favorable}</dd>
            </div>
          ) : null}
          {parsed.minor.caution ? (
            <div>
              <dt className="inline font-medium text-[var(--fire)]">Cần để ý: </dt>
              <dd className="inline">{parsed.minor.caution}</dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <div className="mt-3 max-w-[70ch] space-y-3 text-base leading-relaxed text-[var(--ink-soft)]">
          {parsed.paragraphs.map((paragraph, index) => (
            <p key={`${starCode}-p-${index}`}>{paragraph}</p>
          ))}
        </div>
      )}

      {parsed.elementNote ? (
        <p
          className="mt-2 border-t border-[var(--line)] pt-2 text-[0.75rem] leading-snug text-[var(--ink-muted)]"
          data-testid="element-note"
        >
          Ngũ hành: {parsed.elementNote}
        </p>
      ) : null}
    </article>
  );
}

function MutagenNoteBlock({ text }: { text: string }) {
  return (
    <article
      className="rounded-sm border border-[var(--line)] bg-[var(--paper-muted)]/50 p-4 sm:p-5"
      data-testid="mutagen-note"
    >
      <p className="font-medium text-[var(--ink)]">Tứ hóa nguyên cục</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-soft)]">
        {text}
      </p>
    </article>
  );
}

function LifeContextNoteBlock({ text }: { text: string }) {
  return (
    <article
      className="rounded-sm border border-[var(--line-soft)] bg-[var(--paper-muted)]/40 p-4 sm:p-5"
      data-testid="life-context-note"
    >
      <p className="font-medium text-[var(--ink)]">Ngữ cảnh người xem</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-soft)]">
        {text}
      </p>
    </article>
  );
}

function palaceContextHint(
  palace: PalaceInfo,
  birthContext: BirthContext | null | undefined,
): string | null {
  if (!birthContext) return null;
  const name = (palace.palace_name ?? "").trim().toLowerCase();
  if (name === "phu thê") {
    const label = maritalStatusLabel(birthContext.maritalStatus);
    return label ? `Ngữ cảnh người xem: ${label} — cân nhắc khi luận cung Phu thê.` : null;
  }
  if (name === "tử tức") {
    const label = childrenStatusLabel(birthContext.childrenStatus);
    return label ? `Ngữ cảnh người xem: ${label} — cân nhắc khi luận cung Tử tức.` : null;
  }
  return null;
}

function PalaceInterpretations({
  palace,
  birthContext,
}: {
  palace: PalaceInfo;
  birthContext?: BirthContext | null;
}) {
  const tone = getPalaceTonePresentation(palace);
  const mutagenNote = palace.interpretations?.find((item) => item.star === "mutagen_note");
  const lifeContextNote = palace.interpretations?.find((item) => item.star === "life_context_note");
  const contextHint = palaceContextHint(palace, birthContext);

  const { majorInterps, minorInterps } = useMemo(() => {
    const seen = new Set<string>();
    const majors: NonNullable<PalaceInfo["interpretations"]> = [];
    const minors: NonNullable<PalaceInfo["interpretations"]> = [];

    for (const item of palace.interpretations ?? []) {
      if (SPECIAL_INTERP_STARS.has(item.star)) continue;
      const key = item.star.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      const matched = findStarForCode(palace, item.star);
      const byCategory = matched ? isMajorStar(matched) : null;
      const isMajor =
        byCategory === true ||
        (byCategory === null && !parseInterpretation(item.interpretation).isMinorTemplate);

      if (isMajor) majors.push(item);
      else minors.push(item);
    }

    return { majorInterps: majors, minorInterps: minors };
  }, [palace]);

  const hasMajorStars = palace.stars.some(isMajorStar);
  const hasAnyInterp = majorInterps.length + minorInterps.length > 0;
  const showMinorDisclaimer = minorInterps.some(
    (item) => parseInterpretation(item.interpretation).isMinorTemplate,
  );

  return (
    <div className="space-y-5">
      {lifeContextNote?.interpretation ? (
        <LifeContextNoteBlock text={lifeContextNote.interpretation} />
      ) : contextHint ? (
        <p
          className="rounded-sm border border-[var(--line-soft)] bg-[var(--paper-muted)]/50 p-4 text-sm leading-relaxed text-[var(--ink-soft)]"
          data-testid="palace-context-hint"
        >
          {contextHint}
        </p>
      ) : null}
      <div
        className="rounded-sm border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5"
        data-testid="palace-tone"
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-[var(--ink)]">Luận cung</p>
          <span
            className={cn(
              "inline-flex rounded-sm border px-1.5 py-0.5 text-[0.7rem] font-medium",
              supportEffectToneClass(tone.effect),
            )}
            data-testid="support-effect"
            data-effect={tone.effect}
          >
            {tone.effectLabel}
          </span>
        </div>
        <p className="mt-3 max-w-[70ch] whitespace-pre-wrap text-base leading-relaxed text-[var(--ink-soft)]">
          {tone.note}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[var(--ink-muted)]">
          Không tuyệt đối hóa Miếu/Hãm — độ sáng chính tinh xét cùng phụ tinh trong cung.
        </p>
      </div>

      {mutagenNote?.interpretation ? <MutagenNoteBlock text={mutagenNote.interpretation} /> : null}

      {!hasAnyInterp ? (
        <p className="text-sm text-[var(--ink-muted)]">
          {hasMajorStars
            ? "Chưa có luận giải sao riêng cho cung này."
            : "Cung vô chính diệu — chưa có chính tinh đóng cung; xem Luận cung ở trên và mượn chính tinh cung xung chiếu để tham khảo."}
        </p>
      ) : (
        <div className="space-y-4">
          {majorInterps.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--ink-muted)]">
                Chính tinh
              </p>
              <div className="space-y-2">
                {majorInterps.map((item, index) => (
                  <StarInterpretationBlock
                    key={`major-${palace.index}-${item.star}-${index}`}
                    starCode={item.star}
                    text={item.interpretation}
                    isMajor
                  />
                ))}
              </div>
            </div>
          ) : null}

          {minorInterps.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--ink-muted)]">
                Phụ tinh
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {minorInterps.map((item, index) => (
                  <StarInterpretationBlock
                    key={`minor-${palace.index}-${item.star}-${index}`}
                    starCode={item.star}
                    text={item.interpretation}
                    isMajor={false}
                  />
                ))}
              </div>
              {showMinorDisclaimer ? (
                <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
                  Phụ tinh là “màu” bổ sung của cung — đọc kèm chính tinh và toàn cục, không tách
                  một sao để kết luận. Chỉ mang tính tham khảo.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function PeriodReadingCard({ reading }: { reading: PeriodReading }) {
  const toneLabel = formatPeriodToneLabel(reading.tone);
  const ageRange =
    reading.da_xian_age != null
      ? reading.da_xian_end_age != null
        ? `${reading.da_xian_age}–${reading.da_xian_end_age}`
        : String(reading.da_xian_age)
      : null;

  return (
    <li
      className="rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] p-4 sm:p-5 shadow-[0_2px_8px_rgba(26,21,16,0.04)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(26,21,16,0.08)] hover:-translate-y-0.5"
      data-testid="period-reading"
      data-scope={reading.scope}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-[var(--ink)]">{formatPeriodScopeLabel(reading.scope)}</p>
        {toneLabel ? (
          <span
            className={cn(
              "inline-flex rounded-sm border px-1.5 py-0.5 text-[0.7rem] font-medium",
              periodToneClass(reading.tone),
            )}
          >
            {toneLabel}
          </span>
        ) : null}
        {reading.palace_name ? (
          <span className="text-[0.75rem] text-[var(--ink-muted)]">{reading.palace_name}</span>
        ) : null}
        {ageRange ? (
          <span className="text-[0.75rem] text-[var(--ink-muted)]">Tuổi {ageRange}</span>
        ) : null}
        {reading.view_year != null ? (
          <span className="text-[0.75rem] text-[var(--ink-muted)]">Năm {reading.view_year}</span>
        ) : null}
      </div>
      <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-[var(--ink-soft)]">
        {reading.text}
      </p>
      {reading.disclaimer ? (
        <p
          className="mt-3 text-xs leading-relaxed text-[var(--ink-muted)]"
          data-testid="period-disclaimer"
        >
          {reading.disclaimer}
        </p>
      ) : null}
    </li>
  );
}

export function ChartResults({ chart, birthContext = null }: ChartResultsProps) {
  const [zoomScale, setZoomScale] = useState<number>(100);
  const palaces = useMemo(
    () => [...chart.earth_plate.palaces].sort((a, b) => a.index - b.index),
    [chart.earth_plate.palaces],
  );
  const contextSummary = summarizeBirthContext(birthContext);
  const placeName = birthPlaceLabel(birthContext?.birthPlaceId);
  const meta = chart.chart_meta ?? chart.earth_plate.chart_meta;
  const trueSolarApplied = meta?.true_solar_applied === true;
  const trueSolarOffset = meta?.true_solar_offset_minutes;
  const hourApplied = meta?.hour_applied;
  const hourBranchLabel =
    hourApplied != null
      ? (HOUR_BRANCHES.find((h) => h.value === hourApplied)?.label ?? `Giờ ${hourApplied}`)
      : null;
  const formations = chart.formations.length > 0 ? chart.formations : chart.earth_plate.formations;
  const overview = chart.overview.length > 0 ? chart.overview : (chart.earth_plate.overview ?? []);
  const periodReadings =
    chart.period_readings.length > 0
      ? chart.period_readings
      : (chart.earth_plate.period_readings ?? []);
  const taboo = chart.earth_plate.taboo_palaces ?? [];

  return (
    <section className="w-full space-y-8 print:space-y-0" aria-labelledby="chart-results-heading">
      <div className="print:hidden mx-auto max-w-5xl">
        <h2 id="chart-results-heading" className="font-serif text-2xl text-[var(--ink)]">
          Kết quả lá số
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Lập lúc {new Date(chart.generated_at).toLocaleString("vi-VN")}
        </p>
        {hasBirthContextDetails(birthContext) && contextSummary.length > 0 ? (
          <p
            className="mt-3 rounded-sm border border-[var(--line-soft)] bg-[var(--paper-muted)]/40 px-3 py-2 text-sm text-[var(--ink-soft)]"
            data-testid="birth-context-summary"
          >
            Ngữ cảnh: {contextSummary.join(" · ")}
            {placeName && !trueSolarApplied ? (
              <span className="mt-1 block text-[0.75rem] text-[var(--ink-muted)]">
                Khu vực sinh gửi kèm kinh độ để chỉnh giờ nếu cần; giờ địa chi chỉ đổi khi có giờ
                đồng hồ chi tiết.
              </span>
            ) : null}
          </p>
        ) : null}
        {trueSolarApplied || (trueSolarOffset != null && Math.abs(trueSolarOffset) >= 1) ? (
          <p
            className="mt-2 rounded-sm border border-[var(--line-soft)] bg-[var(--paper-muted)]/40 px-3 py-2 text-sm text-[var(--ink-soft)]"
            data-testid="true-solar-meta"
          >
            {trueSolarApplied
              ? `Đã chỉnh giờ theo kinh độ ${Math.round(trueSolarOffset ?? 0)} phút`
              : `Ước tính chỉnh giờ theo kinh độ ~${Math.round(trueSolarOffset ?? 0)} phút`}
            {hourBranchLabel ? ` — giờ áp dụng: ${hourBranchLabel}` : null}
            {meta?.birth_place_label ? ` (${meta.birth_place_label})` : null}.
          </p>
        ) : null}
      </div>

      {overview.length > 0 ? (
        <section
          aria-labelledby="overview-heading"
          className="print:hidden mx-auto max-w-5xl space-y-4"
          data-testid="overview-section"
        >
          <h3 id="overview-heading" className="font-serif text-xl heading-decorated">
            Tổng quan
          </h3>
          <ul className="space-y-3">
            {overview.map((item) => (
              <li
                key={item.code}
                className="rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] p-4 sm:p-5 shadow-[0_2px_8px_rgba(26,21,16,0.04)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(26,21,16,0.08)] hover:-translate-y-0.5"
                data-testid="overview-item"
                data-code={item.code}
              >
                <p className="font-medium text-[var(--ink)]">{item.title}</p>
                <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-[var(--ink-soft)]">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Bàn lá số & Thanh điều khiển thu phóng trên di động ── */}
      <div className="mx-auto max-w-7xl space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[var(--ink-muted)] print:hidden">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">📱</span>
            <span>Vuốt ngang để xem trọn 12 cung, hoặc dùng nút thu phóng:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.max(70, prev - 15))}
              className="rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] px-2.5 py-1 font-medium hover:bg-[var(--paper-muted)] active:scale-95 transition-all text-[var(--ink)] cursor-pointer"
              aria-label="Thu nhỏ bàn lá số"
            >
              − Thu nhỏ
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(100)}
              className="rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] px-2.5 py-1 font-semibold text-[var(--ink)] hover:bg-[var(--paper-muted)] cursor-pointer"
              aria-label="Đặt lại cỡ chuẩn 100%"
            >
              {zoomScale}%
            </button>
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.min(130, prev + 15))}
              className="rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] px-2.5 py-1 font-medium hover:bg-[var(--paper-muted)] active:scale-95 transition-all text-[var(--ink)] cursor-pointer"
              aria-label="Phóng to bàn lá số"
            >
              + Phóng to
            </button>
          </div>
        </div>

        <div className="chart-print-board w-full max-w-full overflow-x-auto overscroll-x-contain rounded-sm border border-[var(--line-soft)] bg-[var(--paper-muted)]/20 p-1 sm:p-2 print:overflow-visible print:border-none print:p-0">
          <ChartBoard
            chart={chart}
            style={
              zoomScale !== 100
                ? {
                    transform: `scale(${zoomScale / 100})`,
                    transformOrigin: "top left",
                    width: `${(100 / zoomScale) * 100}%`,
                  }
                : undefined
            }
            className="mx-auto min-w-[56rem] w-full max-w-7xl print:min-w-0 print:max-w-none lg:min-w-0 transition-transform duration-200"
          />
        </div>
      </div>

      {/* ── Hướng dẫn nhanh: Xem sao Tốt & sao Cần lưu ý ── */}
      <section
        aria-labelledby="star-guide-heading"
        className="print:hidden mx-auto max-w-5xl rounded-sm border border-[var(--gold)]/35 bg-[var(--paper-raised)] p-4 sm:p-6 shadow-[0_2px_12px_rgba(26,21,16,0.06)] ring-1 ring-inset ring-[var(--line-faint)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line-soft)] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg text-[var(--gold)]" aria-hidden="true">
              📜
            </span>
            <h3
              id="star-guide-heading"
              className="font-serif text-lg font-semibold text-[var(--ink)]"
            >
              Hướng dẫn nhanh: Xem sao Tốt & sao Cần lưu ý
            </h3>
          </div>
          <span className="text-xs text-[var(--ink-muted)] hidden sm:inline">
            Dành cho người mới xem
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {/* Cát tinh */}
          <div className="rounded-sm border border-[var(--wood)]/30 bg-[var(--wood-soft)]/50 p-3.5 space-y-1.5">
            <p className="font-serif font-semibold text-[var(--wood)] flex items-center gap-1.5">
              <span>🌟</span> Sao Tốt (Cát tinh · Quý tinh)
            </p>
            <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
              Đem lại may mắn, phúc đức, tài lộc hanh thông và có quý nhân tương trợ khi gặp khó
              khăn.
            </p>
            <p className="text-[0.75rem] text-[var(--ink-muted)] italic">
              Ví dụ: Tử Vi, Thiên Phủ, Hóa Lộc, Hóa Quyền, Thiên Khôi, Thiên Việt, Văn Xương, Văn
              Khúc...
            </p>
          </div>

          {/* Sát tinh */}
          <div className="rounded-sm border border-[var(--fire)]/30 bg-[var(--fire-soft)]/50 p-3.5 space-y-1.5">
            <p className="font-serif font-semibold text-[var(--fire)] flex items-center gap-1.5">
              <span>⚡</span> Sao Cần Lưu Ý (Sát tinh · Hung tinh)
            </p>
            <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
              Chủ về thử thách, biến động, rèn luyện ý chí. Khi gặp sao này nên giữ tâm bình tĩnh,
              làm việc cẩn trọng.
            </p>
            <p className="text-[0.75rem] text-[var(--ink-muted)] italic">
              Ví dụ: Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp, Hóa Kỵ...
            </p>
          </div>

          {/* Độ sáng & Tứ hóa */}
          <div className="rounded-sm border border-[var(--earth)]/30 bg-[var(--earth-soft)]/50 p-3.5 space-y-1.5 sm:col-span-2 lg:col-span-1">
            <p className="font-serif font-semibold text-[var(--earth)] flex items-center gap-1.5">
              <span>☀️</span> Độ Sáng (Miếu · Vượng · Hãm)
            </p>
            <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
              <strong>Miếu/Vượng:</strong> Sao sáng rực rỡ, phát huy trọn vẹn đặc tính tốt đẹp.
              <br />
              <strong>Hãm:</strong> Năng lượng bị bó hẹp, nhắc nhở ta kiên trì tu dưỡng và cẩn thận.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="formations-heading"
        className="print:hidden mx-auto max-w-5xl space-y-4"
        data-testid="formations-section"
      >
        <h3 id="formations-heading" className="font-serif text-xl heading-decorated">
          Cách cục
        </h3>
        {formations.length === 0 ? (
          <p className="text-sm text-[var(--ink-muted)]">Không có cách cục được phát hiện.</p>
        ) : (
          <ul className="space-y-3">
            {formations.map((f) => {
              const qualityLabel = formatFormationQualityLabel(f.quality);
              return (
                <li
                  key={f.code}
                  className="rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] p-4 sm:p-5 shadow-[0_2px_8px_rgba(26,21,16,0.04)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(26,21,16,0.08)] hover:-translate-y-0.5"
                  data-testid="formation-item"
                  data-quality={f.quality ?? undefined}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[var(--ink)]">{f.name}</p>
                    {qualityLabel ? (
                      <span
                        className={cn(
                          "inline-flex rounded-sm border px-1.5 py-0.5 text-[0.7rem] font-medium",
                          formationQualityToneClass(f.quality),
                        )}
                        data-testid="formation-quality"
                      >
                        {qualityLabel}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-[var(--ink-soft)]">
                    {f.description}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {periodReadings.length > 0 ? (
        <section
          aria-labelledby="period-readings-heading"
          className="print:hidden mx-auto max-w-5xl space-y-4"
          data-testid="period-readings-section"
        >
          <h3 id="period-readings-heading" className="font-serif text-xl heading-decorated">
            Hạn
          </h3>
          <ul className="space-y-3">
            {periodReadings.map((reading) => (
              <PeriodReadingCard key={`${reading.scope}-${reading.code}`} reading={reading} />
            ))}
          </ul>
        </section>
      ) : null}

      {taboo.length > 0 ? (
        <section
          aria-labelledby="taboo-heading"
          className="print:hidden mx-auto max-w-5xl space-y-3"
          data-testid="taboo-section"
        >
          <h3 id="taboo-heading" className="font-serif text-xl heading-decorated">
            Cung cần lưu ý
          </h3>
          <p className="text-sm text-[var(--ink-muted)]">
            Danh sách mang tính tham khảo theo bộ máy; diễn đạt trung tính, không phải kết luận
            tuyệt đối.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {taboo.map((item) => (
              <li key={item}>{formatBranchPinyinLabel(item)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        aria-labelledby="palace-interp-heading"
        className="print:hidden mx-auto w-full max-w-5xl space-y-4"
        data-testid="palace-interp-section"
      >
        <h3 id="palace-interp-heading" className="font-serif text-xl heading-decorated">
          Luận giải từng cung
        </h3>
        <PalaceInterpTabs
          key={chart.generated_at}
          palaces={palaces}
          renderPanel={(palace) => (
            <PalaceInterpretations palace={palace} birthContext={birthContext} />
          )}
        />
      </section>
    </section>
  );
}
