"use client";

import { useMemo } from "react";

import { ChartBoard } from "@/components/chart/ChartBoard";
import { PalaceInterpTabs } from "@/components/chart/PalaceInterpTabs";
import { parseInterpretation } from "@/lib/chart/format-interpretation";
import { formatBranchPinyinLabel, formatStarCodeLabel } from "@/lib/chart/labels";
import {
  getPalaceTonePresentation,
  isMajorStar,
  supportEffectToneClass,
} from "@/lib/chart/palace-tone";
import type { ChartResponse, PalaceInfo } from "@/lib/chart/validate";
import { cn } from "@/lib/utils/cn";

type ChartResultsProps = {
  chart: ChartResponse;
};

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

function PalaceInterpretations({ palace }: { palace: PalaceInfo }) {
  const tone = getPalaceTonePresentation(palace);

  const { majorInterps, minorInterps } = useMemo(() => {
    const seen = new Set<string>();
    const majors: NonNullable<PalaceInfo["interpretations"]> = [];
    const minors: NonNullable<PalaceInfo["interpretations"]> = [];

    for (const item of palace.interpretations ?? []) {
      if (item.star === "palace_tone") continue;
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

export function ChartResults({ chart }: ChartResultsProps) {
  const palaces = useMemo(
    () => [...chart.earth_plate.palaces].sort((a, b) => a.index - b.index),
    [chart.earth_plate.palaces],
  );
  const formations = chart.formations.length > 0 ? chart.formations : chart.earth_plate.formations;
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
      </div>

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
            {formations.map((f) => (
              <li
                key={f.code}
                className="border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2.5"
              >
                <p className="font-medium text-[var(--ink)]">{f.name}</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{f.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

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
          renderPanel={(palace) => <PalaceInterpretations palace={palace} />}
        />
      </section>
    </section>
  );
}
