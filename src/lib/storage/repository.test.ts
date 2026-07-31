import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import sampleChart from "@/test/fixtures/sample-chart.json";
import { validateChartResponse } from "@/lib/chart/validate";
import {
  deleteChart,
  getChart,
  importChart,
  listCharts,
  renameChart,
  resetDbForTests,
  saveChart,
} from "@/lib/storage/repository";
import { migrateSavedChart } from "@/lib/storage/schema";

const chart = validateChartResponse(sampleChart);
const birthInput = chart.birth_info;

describe("IndexedDB repository", () => {
  beforeEach(async () => {
    await resetDbForTests();
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase("lasotuvi-web");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error("deleteDatabase failed"));
      req.onblocked = () => resolve();
    });
  });

  it("saves, lists, gets, renames and deletes", async () => {
    const saved = await saveChart({ birthInput, chart, title: "Test A" });
    expect(saved.id).toBeTruthy();
    expect(await listCharts()).toHaveLength(1);
    expect((await getChart(saved.id))?.title).toBe("Test A");

    await renameChart(saved.id, "Test B");
    expect((await getChart(saved.id))?.title).toBe("Test B");

    await deleteChart(saved.id);
    expect(await listCharts()).toHaveLength(0);
  });

  it("rejects unsupported schemaVersion", () => {
    expect(() =>
      migrateSavedChart({
        id: "1",
        schemaVersion: 99,
        title: "x",
        createdAt: "",
        updatedAt: "",
        birthInput,
        chart,
      }),
    ).toThrow(/chưa được hỗ trợ/);
  });

  it("does not silently overwrite on import", async () => {
    const saved = await saveChart({ birthInput, chart, title: "Original" });
    await expect(
      importChart({ ...saved, title: "Imported" }, { overwrite: false }),
    ).rejects.toThrow(/cùng ID/);
    const overwritten = await importChart({ ...saved, title: "Imported" }, { overwrite: true });
    expect(overwritten.title).toBe("Imported");
  });
});
