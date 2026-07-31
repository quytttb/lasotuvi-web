"use client";

import { useMemo, useState } from "react";

import { Accordion } from "@/components/ui/Accordion";
import { ChartBoard } from "@/components/chart/ChartBoard";
import { PalaceCell } from "@/components/chart/PalaceCell";
import type { ChartResponse } from "@/lib/chart/validate";
import { cn } from "@/lib/utils/cn";

type ChartResultsProps = {
  chart: ChartResponse;
};

export function ChartResults({ chart }: ChartResultsProps) {
  const [showBoardOnMobile, setShowBoardOnMobile] = useState(false);
  const palaces = useMemo(
    () => [...chart.earth_plate.palaces].sort((a, b) => a.index - b.index),
    [chart.earth_plate.palaces],
  );
  const formations =
    chart.formations.length > 0 ? chart.formations : chart.earth_plate.formations;
  const taboo = chart.earth_plate.taboo_palaces ?? [];

  return (
    <section className="space-y-8" aria-labelledby="chart-results-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="chart-results-heading" className="font-serif text-2xl text-[var(--ink)]">
            Kết quả lá số
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Lập lúc {new Date(chart.generated_at).toLocaleString("vi-VN")}
          </p>
        </div>
        <button
          type="button"
          className="print:hidden inline-flex min-h-11 items-center rounded-sm border border-[var(--line)] px-3 text-sm lg:hidden"
          onClick={() => setShowBoardOnMobile((v) => !v)}
        >
          {showBoardOnMobile ? "Ẩn dạng bàn" : "Xem dạng bàn"}
        </button>
      </div>

      {/* Desktop / print board */}
      <div className="hidden lg:block print:block">
        <ChartBoard chart={chart} />
      </div>

      {/* Optional mobile horizontal board */}
      {showBoardOnMobile ? (
        <div className="lg:hidden print:hidden overflow-x-auto">
          <ChartBoard chart={chart} className="min-w-[52rem]" />
        </div>
      ) : null}

      {/* Mobile palace cards */}
      <div className="lg:hidden print:hidden space-y-4">
        <nav aria-label="Chuyển nhanh cung" className="flex flex-wrap gap-2">
          {palaces.map((p) => (
            <a
              key={p.index}
              href={`#cung-${p.index}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-[var(--line)] px-2 text-sm"
            >
              {p.palace_name ?? p.index}
            </a>
          ))}
        </nav>
        <div className="grid gap-3 sm:grid-cols-2">
          {palaces.map((palace) => (
            <div key={palace.index} id={`cung-${palace.index}`}>
              <PalaceCell palace={palace} className="min-h-[12rem]" />
            </div>
          ))}
        </div>
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
              <li key={item}>{item}</li>
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
                      <p className={cn("font-medium text-[var(--ink)]")}>{item.star}</p>
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
