import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import {
  defaultTitleFromBirth,
  migrateSavedChart,
  SAVED_CHART_SCHEMA_VERSION,
  type SavedChart,
} from "@/lib/storage/schema";
import type { BirthInfoRequest } from "@/lib/form/birth-schema";
import type { ChartResponse } from "@/lib/chart/validate";

const DB_NAME = "lasotuvi-web";
const DB_VERSION = 1;
const STORE = "charts";

interface LasoTuViDB extends DBSchema {
  charts: {
    key: string;
    value: SavedChart;
    indexes: { "by-updated": string; "by-title": string };
  };
}

export type StorageAvailability = { available: true } | { available: false; reason: string };

let dbPromise: Promise<IDBPDatabase<LasoTuViDB>> | null = null;

export async function resetDbForTests(): Promise<void> {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      db.close();
    } catch {
      // ignore
    }
  }
  dbPromise = null;
}

async function getDb(): Promise<IDBPDatabase<LasoTuViDB>> {
  if (!dbPromise) {
    dbPromise = openDB<LasoTuViDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("by-updated", "updatedAt");
          store.createIndex("by-title", "title");
        }
      },
    });
  }
  return dbPromise;
}

export async function checkStorageAvailability(): Promise<StorageAvailability> {
  if (typeof indexedDB === "undefined") {
    return {
      available: false,
      reason: "Trình duyệt không hỗ trợ IndexedDB. Bạn vẫn có thể lập và xem lá số.",
    };
  }
  try {
    const db = await getDb();
    await db.getAllKeys(STORE);
    return { available: true };
  } catch {
    return {
      available: false,
      reason:
        "Không thể mở bộ nhớ cục bộ (IndexedDB bị chặn hoặc không khả dụng). Lập/xem lá số vẫn hoạt động; lưu bị tắt.",
    };
  }
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException && (error.name === "QuotaExceededError" || error.code === 22)
  );
}

export async function saveChart(params: {
  birthInput: BirthInfoRequest;
  chart: ChartResponse;
  title?: string;
  id?: string;
}): Promise<SavedChart> {
  const now = new Date().toISOString();
  const existing = params.id ? await getChart(params.id) : undefined;
  const record: SavedChart = {
    id: params.id ?? crypto.randomUUID(),
    schemaVersion: SAVED_CHART_SCHEMA_VERSION,
    title: (
      params.title?.trim() ||
      existing?.title ||
      defaultTitleFromBirth(params.birthInput)
    ).slice(0, 200),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    birthInput: params.birthInput,
    chart: params.chart,
  };

  try {
    const db = await getDb();
    await db.put(STORE, record);
    return record;
  } catch (error) {
    if (isQuotaError(error)) {
      throw new Error(
        "Bộ nhớ trình duyệt đã đầy. Hãy xóa bớt lá số đã lưu hoặc giải phóng dung lượng rồi thử lại.",
      );
    }
    throw error;
  }
}

export async function listCharts(): Promise<SavedChart[]> {
  const db = await getDb();
  const all = await db.getAll(STORE);
  const migrated: SavedChart[] = [];
  for (const raw of all) {
    try {
      migrated.push(migrateSavedChart(raw));
    } catch {
      // Skip unsupported/corrupt records rather than crashing the list.
    }
  }
  return migrated.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getChart(id: string): Promise<SavedChart | undefined> {
  const db = await getDb();
  const raw = await db.get(STORE, id);
  if (!raw) return undefined;
  return migrateSavedChart(raw);
}

export async function renameChart(id: string, title: string): Promise<SavedChart> {
  const existing = await getChart(id);
  if (!existing) throw new Error("Không tìm thấy lá số đã lưu.");
  const trimmed = title.trim();
  if (!trimmed) throw new Error("Tên lá số không được để trống.");
  const updated: SavedChart = {
    ...existing,
    title: trimmed.slice(0, 200),
    updatedAt: new Date().toISOString(),
  };
  const db = await getDb();
  await db.put(STORE, updated);
  return updated;
}

export async function deleteChart(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, id);
}

export async function importChart(
  raw: unknown,
  options: { overwrite?: boolean } = {},
): Promise<SavedChart> {
  const parsed = migrateSavedChart(raw);
  const existing = await getChart(parsed.id);
  if (existing && !options.overwrite) {
    throw new Error(
      "Đã tồn tại lá số với cùng ID. Chọn ghi đè tường minh hoặc đổi ID trước khi nhập.",
    );
  }
  const now = new Date().toISOString();
  const record: SavedChart = {
    ...parsed,
    updatedAt: now,
    createdAt: existing?.createdAt ?? parsed.createdAt ?? now,
  };
  try {
    const db = await getDb();
    await db.put(STORE, record);
    return record;
  } catch (error) {
    if (isQuotaError(error)) {
      throw new Error("Bộ nhớ trình duyệt đã đầy. Hãy xóa bớt lá số đã lưu rồi thử lại.");
    }
    throw error;
  }
}

export function exportChartJson(chart: SavedChart): string {
  return JSON.stringify(chart, null, 2);
}
