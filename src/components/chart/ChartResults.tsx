"use client";

import { useMemo } from "react";

import { Accordion } from "@/components/ui/Accordion";
import { ChartBoard } from "@/components/chart/ChartBoard";
import {
  formatBranchPinyinLabel,
  formatStarCodeLabel,
} from "@/lib/chart/labels";
import type { ChartResponse } from "@/lib/chart/validate";
import { cn } from "@/lib/utils/cn";

type ChartResultsProps = {
  chart: ChartResponse;
};

export function ChartResults({ chart }: ChartResultsProps) {
  const palaces = useMemo(
    () => [...chart.earth_plate.palaces].sort((a, b) => a.index - b.index),
    [chart.earth_plate.palaces],
  );
  const formations =
    chart.formations.length > 0 ? chart.formations : chart.earth_plate.formations;
  const taboo = chart.earth_plate.taboo_palaces ?? [];

  return (
    <section className="space-y-8" aria-labelledby="chart-results-heading">
      <div>
        <h2 id="chart-results-heading" className="font-serif text-2xl text-[var(--ink)]">
          Kết quả lá số
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Lập lúc {new Date(chart.generated_at).toLocaleString("vi-VN")}
        </p>
      </div>

      <div className="w-full max-w-full overflow-x-auto overscroll-x-contain print:overflow-visible">
        <ChartBoard chart={chart} className="min-w-[52rem] lg:min-w-0 lg:max-w-6xl" />
      </div>

      <section aria-labelledby="formations-heading" className="space-y-3">
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
                className="border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3"
              >
                <p className="font-medium text-[var(--ink)]">{f.name}</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{f.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {taboo.length > 0 ? (
        <section aria-labelledby="taboo-heading" className="space-y-2">
          <h3 id="taboo-heading" className="font-serif text-xl">
            Cung cần lưu ý
          </h3>
          <p className="text-sm text-[var(--ink-muted)]">
            Danh sách mang tính tham khảo theo bộ máy; diễn đạt trung tính, không phải kết luận tuyệt
            đối.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {taboo.map((item) => (
              <li key={item}>{formatBranchPinyinLabel(item)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="palace-interp-heading" className="space-y-3">
        <h3 id="palace-interp-heading" className="font-serif text-xl">
          Luận giải từng cung
        </h3>
        <Accordion
          items={palaces.map((palace) => ({
            id: String(palace.index),
            title: `${palace.palace_name ?? `Cung ${palace.index}`} — ${palace.branch_name}`,
            content: (
              <div className="space-y-3">
                {(palace.interpretations?.length ?? 0) === 0 ? (
                  <p className="text-[var(--ink-muted)]">Chưa có luận giải cho cung này.</p>
                ) : (
                  palace.interpretations.map((item) => (
                    <div key={`${palace.index}-${item.star}`}>
                      <p className={cn("font-medium text-[var(--ink)]")}>
                        {formatStarCodeLabel(item.star)}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-[var(--ink-soft)]">
                        {item.interpretation}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ),
          }))}
        />
      </section>
    </section>
  );
}
