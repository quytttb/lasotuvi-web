"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import {
  checkStorageAvailability,
  deleteChart,
  exportChartJson,
  importChart,
  listCharts,
  renameChart,
  type StorageAvailability,
} from "@/lib/storage/repository";
import type { SavedChart } from "@/lib/storage/schema";
import { downloadTextFile, formatDateVi } from "@/lib/utils/cn";

const OPEN_KEY = "lasotuvi:open-chart-id";

export function persistOpenChartId(id: string) {
  sessionStorage.setItem(OPEN_KEY, id);
}

export function consumeOpenChartId(): string | null {
  const id = sessionStorage.getItem(OPEN_KEY);
  if (id) sessionStorage.removeItem(OPEN_KEY);
  return id;
}

export function SavedChartsList() {
  const router = useRouter();
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [query, setQuery] = useState("");
  const [storage, setStorage] = useState<StorageAvailability | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<SavedChart | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SavedChart | null>(null);
  const [importOverwrite, setImportOverwrite] = useState(false);

  const refresh = useCallback(async () => {
    const availability = await checkStorageAvailability();
    setStorage(availability);
    if (!availability.available) {
      setCharts([]);
      return;
    }
    setCharts(await listCharts());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const availability = await checkStorageAvailability();
      if (cancelled) return;
      setStorage(availability);
      if (!availability.available) {
        setCharts([]);
        return;
      }
      const items = await listCharts();
      if (!cancelled) setCharts(items);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return charts;
    return charts.filter((c) => c.title.toLowerCase().includes(q));
  }, [charts, query]);

  function openChart(id: string) {
    persistOpenChartId(id);
    router.push("/lap-la-so");
  }

  async function confirmRename() {
    if (!renameTarget) return;
    try {
      await renameChart(renameTarget.id, renameValue);
      setRenameTarget(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không đổi được tên.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteChart(deleteTarget.id);
      setDeleteTarget(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không xóa được lá số.");
    }
  }

  function exportOne(chart: SavedChart) {
    downloadTextFile(`lasotuvi-${chart.id}.json`, exportChartJson(chart));
  }

  async function onImportFile(file: File) {
    setError(null);
    try {
      const text = await file.text();
      const raw = JSON.parse(text) as unknown;
      await importChart(raw, { overwrite: importOverwrite });
      setImportOverwrite(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không nhập được tệp JSON.");
    }
  }

  if (storage && !storage.available) {
    return (
      <div
        className="rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] p-6"
        role="status"
      >
        <p className="font-medium">Không thể dùng bộ nhớ cục bộ</p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">{storage.reason}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label htmlFor="search-charts" className="mb-1 block text-sm font-medium">
            Tìm theo tên
          </label>
          <input
            id="search-charts"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-11 w-full max-w-md rounded-sm border border-[var(--line)] bg-[var(--paper)] px-3"
            placeholder="Ví dụ: Nguyễn…"
            data-testid="search-charts"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={importOverwrite}
              onChange={(e) => setImportOverwrite(e.target.checked)}
            />
            Ghi đè khi trùng ID
          </label>
          <label className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-[var(--line)] px-3 text-sm">
            Nhập JSON
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              data-testid="import-json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onImportFile(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <p className="text-sm text-[var(--ink-muted)]">
        Dữ liệu chỉ nằm trên trình duyệt này. Không đồng bộ lên máy chủ.
      </p>

      {error ? (
        <p className="text-sm text-[var(--fire)]" role="alert">
          {error}
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div
          className="rounded-sm border border-dashed border-[var(--line)] bg-[var(--paper-muted)] px-6 py-12 text-center"
          data-testid="empty-saved"
        >
          <p className="font-serif text-xl text-[var(--ink)]">Chưa có lá số nào được lưu</p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Lập lá số rồi nhấn “Lưu lá số” để xem lại tại đây.
          </p>
          <Button className="mt-6" onClick={() => router.push("/lap-la-so")}>
            Lập lá số
          </Button>
        </div>
      ) : (
        <ul
          className="divide-y divide-[var(--line)] border border-[var(--line)]"
          data-testid="saved-list"
        >
          {filtered.map((chart) => (
            <li
              key={chart.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[var(--ink)]">{chart.title}</p>
                <p className="text-sm text-[var(--ink-muted)]">
                  Cập nhật {formatDateVi(chart.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => openChart(chart.id)}
                  data-testid={`open-${chart.id}`}
                >
                  Mở lại
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setRenameTarget(chart);
                    setRenameValue(chart.title);
                  }}
                >
                  Đổi tên
                </Button>
                <Button size="sm" variant="secondary" onClick={() => exportOne(chart)}>
                  Xuất JSON
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(chart)}>
                  Xóa
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={Boolean(renameTarget)}
        title="Đổi tên lá số"
        onClose={() => setRenameTarget(null)}
        hideCloseButton
      >
        <label htmlFor="rename-input" className="mb-1 block text-sm font-medium">
          Tên mới
        </label>
        <input
          id="rename-input"
          className="min-h-11 w-full rounded-sm border border-[var(--line)] px-3"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          maxLength={200}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setRenameTarget(null)}>
            Hủy
          </Button>
          <Button onClick={() => void confirmRename()} data-testid="confirm-rename">
            Lưu tên
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        title="Xóa lá số?"
        description={
          deleteTarget
            ? `Bạn sắp xóa “${deleteTarget.title}”. Thao tác này không thể hoàn tác.`
            : undefined
        }
        onClose={() => setDeleteTarget(null)}
        hideCloseButton
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={() => void confirmDelete()}
            data-testid="confirm-delete"
          >
            Xóa
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
