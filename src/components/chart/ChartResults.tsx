"use client";

import { useMemo } from "react";

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
        "rounded-sm border px-2.5 py-2.5",
        isMajor
          ? "border-[var(--line)] bg-[var(--paper)]"
          : "border-[var(--line)]/70 bg-[var(--paper-muted)]/40",
      )}
      data-testid={isMajor ? "star-interp-major" : "star-interp-minor"}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h4 className="font-serif text-base font-medium text-[var(--ink)]">{title}</h4>
        {!isMajor && parsed.minor?.role ? (
          <span className="text-[0.7rem] text-[var(--ink-muted)]">{parsed.minor.role}</span>
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
        <div className="mt-2 space-y-2.5 text-sm leading-relaxed text-[var(--ink-soft)]">
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
      className="rounded-sm border border-[var(--line)] bg-[var(--paper-muted)]/50 px-2.5 py-2.5"
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
      className="rounded-sm border border-[var(--line-soft)] bg-[var(--paper-muted)]/40 px-2.5 py-2.5"
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
    <div className="space-y-3">
      {lifeContextNote?.interpretation ? (
        <LifeContextNoteBlock text={lifeContextNote.interpretation} />
      ) : contextHint ? (
        <p
          className="rounded-sm border border-[var(--line-soft)] bg-[var(--paper-muted)]/50 px-2.5 py-2 text-sm text-[var(--ink-soft)]"
          data-testid="palace-context-hint"
        >
          {contextHint}
        </p>
      ) : null}
      <div
        className="rounded-sm border border-[var(--line)] bg-[var(--paper)] px-2.5 py-2.5"
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
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-soft)]">
          {tone.note}
        </p>
        <p className="mt-2 text-[0.7rem] text-[var(--ink-muted)]">
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
              <div className="grid gap-2 sm:grid-cols-2">
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
                <p className="text-[0.7rem] leading-snug text-[var(--ink-muted)]">
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
      className="border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2.5"
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
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{reading.text}</p>
      {reading.disclaimer ? (
        <p
          className="mt-2 text-[0.7rem] leading-snug text-[var(--ink-muted)]"
          data-testid="period-disclaimer"
        >
          {reading.disclaimer}
        </p>
      ) : null}
    </li>
  );
}

export function ChartResults({ chart, birthContext = null }: ChartResultsProps) {
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
    <section className="w-full space-y-6 print:space-y-0" aria-labelledby="chart-results-heading">
      <div className="print:hidden">
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
          className="print:hidden space-y-3"
          data-testid="overview-section"
        >
          <h3 id="overview-heading" className="font-serif text-xl">
            Tổng quan
          </h3>
          <ul className="space-y-2">
            {overview.map((item) => (
              <li
                key={item.code}
                className="border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2.5"
                data-testid="overview-item"
                data-code={item.code}
              >
                <p className="font-medium text-[var(--ink)]">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="chart-print-board w-full max-w-full overflow-x-auto overscroll-x-contain print:overflow-visible">
        <ChartBoard
          chart={chart}
          className="mx-auto min-w-[56rem] w-full max-w-7xl print:min-w-0 print:max-w-none lg:min-w-0"
        />
      </div>

      <section
        aria-labelledby="formations-heading"
        className="print:hidden space-y-3"
        data-testid="formations-section"
      >
        <h3 id="formations-heading" className="font-serif text-xl">
          Cách cục
        </h3>
        {formations.length === 0 ? (
          <p className="text-sm text-[var(--ink-muted)]">Không có cách cục được phát hiện.</p>
        ) : (
          <ul className="space-y-2">
            {formations.map((f) => {
              const qualityLabel = formatFormationQualityLabel(f.quality);
              return (
                <li
                  key={f.code}
                  className="border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2.5"
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
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">{f.description}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {periodReadings.length > 0 ? (
        <section
          aria-labelledby="period-readings-heading"
          className="print:hidden space-y-3"
          data-testid="period-readings-section"
        >
          <h3 id="period-readings-heading" className="font-serif text-xl">
            Hạn
          </h3>
          <ul className="space-y-2">
            {periodReadings.map((reading) => (
              <PeriodReadingCard key={`${reading.scope}-${reading.code}`} reading={reading} />
            ))}
          </ul>
        </section>
      ) : null}

      {taboo.length > 0 ? (
        <section
          aria-labelledby="taboo-heading"
          className="print:hidden space-y-2"
          data-testid="taboo-section"
        >
          <h3 id="taboo-heading" className="font-serif text-xl">
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
        className="print:hidden w-full space-y-2"
        data-testid="palace-interp-section"
      >
        <h3 id="palace-interp-heading" className="font-serif text-xl">
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
