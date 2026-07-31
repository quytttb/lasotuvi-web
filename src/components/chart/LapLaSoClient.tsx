"use client";

import { useEffect, useState } from "react";

import { ChartWorkspace } from "@/components/chart/ChartWorkspace";
import { consumeOpenChartId } from "@/components/saved/SavedChartsList";
import { birthInfoToFormValues, type BirthInfoRequest } from "@/lib/form/birth-schema";
import type { ChartResponse } from "@/lib/chart/validate";
import { getChart } from "@/lib/storage/repository";

/** Survive React Strict Mode double-mount in dev (consume is one-shot). */
let openChartIdForMount: string | null | undefined;

function takeOpenChartIdOnce(): string | null {
  if (openChartIdForMount !== undefined) return openChartIdForMount;
  openChartIdForMount = consumeOpenChartId();
  return openChartIdForMount;
}

export function LapLaSoClient() {
  const [initial, setInitial] = useState<{
    birthInput: BirthInfoRequest;
    chart: ChartResponse;
  } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = takeOpenChartIdOnce();
    if (!id) {
      queueMicrotask(() => {
        if (!cancelled) setReady(true);
      });
      return () => {
        cancelled = true;
      };
    }
    void getChart(id)
      .then((saved) => {
        if (cancelled || !saved) return;
        setInitial({ birthInput: saved.birthInput, chart: saved.chart });
      })
      .finally(() => {
        if (!cancelled) {
          openChartIdForMount = undefined;
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <p className="text-sm text-[var(--ink-muted)]">Đang tải…</p>;
  }

  return (
    <ChartWorkspace
      initial={initial}
      initialFormValues={initial ? birthInfoToFormValues(initial.birthInput) : undefined}
    />
  );
}
