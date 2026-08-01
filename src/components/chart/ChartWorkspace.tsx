"use client";

import { useCallback, useEffect, useState } from "react";

import { BirthForm } from "@/components/form/BirthForm";
import { ChartResults } from "@/components/chart/ChartResults";
import { Button } from "@/components/ui/Button";
import type { ChartResponse } from "@/lib/chart/validate";
import type { BirthContext } from "@/lib/form/birth-context";
import {
  birthInfoToFormValues,
  type BirthFormValues,
  type BirthInfoRequest,
} from "@/lib/form/birth-schema";
import {
  checkStorageAvailability,
  saveChart,
  type StorageAvailability,
} from "@/lib/storage/repository";
import { defaultTitleFromBirth } from "@/lib/storage/schema";

type WorkspaceState = {
  birthInput: BirthInfoRequest;
  chart: ChartResponse;
  birthContext: BirthContext | null;
} | null;

type ChartWorkspaceProps = {
  initial?: WorkspaceState;
  initialFormValues?: BirthFormValues;
  /** When opening a saved chart, pass its id so "Lưu" updates instead of inserting a duplicate. */
  initialSavedId?: string | null;
};

export function ChartWorkspace({
  initial = null,
  initialFormValues,
  initialSavedId = null,
}: ChartWorkspaceProps) {
  const [result, setResult] = useState<WorkspaceState>(initial);
  const [savedId, setSavedId] = useState<string | null>(initialSavedId);
  const [storage, setStorage] = useState<StorageAvailability | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void checkStorageAvailability().then(setStorage);
  }, []);

  const onSuccess = useCallback((payload: NonNullable<WorkspaceState>) => {
    setResult(payload);
    setSavedId(null);
    setSaveMessage(null);
    setSaveError(null);
    // Scroll results into view without putting birth info in URL.
    requestAnimationFrame(() => {
      document
        .getElementById("chart-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const saved = await saveChart({
        id: savedId ?? undefined,
        birthInput: result.birthInput,
        chart: result.chart,
        birthContext: result.birthContext,
        title: defaultTitleFromBirth(result.birthInput),
      });
      setSavedId(saved.id);
      setSaveMessage(`Đã lưu “${saved.title}” trên thiết bị này.`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Không thể lưu lá số.");
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const storageDisabled = storage?.available === false;

  return (
    <div className="space-y-10 print:space-y-0">
      <BirthForm
        onSuccess={onSuccess}
        initialValues={
          initialFormValues ??
          (initial
            ? birthInfoToFormValues(initial.birthInput, initial.birthContext)
            : undefined)
        }
        disabledSaveHint={
          storageDisabled
            ? storage.reason
            : "Dữ liệu chỉ nằm trên trình duyệt này khi bạn nhấn Lưu."
        }
      />

      {result ? (
        <div id="chart-results" className="space-y-4 print:space-y-0">
          <div className="print:hidden flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || storageDisabled}
              data-testid="save-chart"
            >
              {saving ? "Đang lưu…" : "Lưu lá số"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrint}
              data-testid="print-chart"
            >
              In / Lưu PDF
            </Button>
          </div>
          {saveMessage ? (
            <p
              className="print:hidden text-sm text-[var(--wood)]"
              role="status"
              data-testid="save-success"
            >
              {saveMessage}
            </p>
          ) : null}
          {saveError ? (
            <p
              className="print:hidden text-sm text-[var(--fire)]"
              role="alert"
              data-testid="save-error"
            >
              {saveError}
            </p>
          ) : null}

          <div className="chart-print-sheet">
            <ChartResults chart={result.chart} birthContext={result.birthContext} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
