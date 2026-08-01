import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { generateChart } from "@/lib/api/generate-chart";
import type { BirthInfoRequest } from "@/lib/form/birth-schema";
import sampleChart from "@/test/fixtures/sample-chart.json";

const birthInfo: BirthInfoRequest = {
  day: 15,
  month: 8,
  year: 1990,
  hour: 7,
  gender: 1,
  is_solar: true,
  timezone: 7,
  name: "Test",
  view_year: 2026,
};

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe("generateChart", () => {
  it("returns validated chart and request id", async () => {
    server.use(
      http.post("http://localhost:8000/chart/generate", () =>
        HttpResponse.json(sampleChart, {
          headers: { "X-Request-ID": "resp-1" },
        }),
      ),
    );

    const result = await generateChart(birthInfo, { requestId: "client-1" });
    expect(result.requestId).toBe("resp-1");
    expect(result.chart.earth_plate.palaces).toHaveLength(12);
  });

  it("throws on invalid chart body (Zod fail)", async () => {
    const bad = structuredClone(sampleChart);
    bad.earth_plate.palaces = [];

    server.use(http.post("http://localhost:8000/chart/generate", () => HttpResponse.json(bad)));

    await expect(generateChart(birthInfo)).rejects.toMatchObject({
      apiError: expect.objectContaining({ code: "invalid_response" }),
    });
  });

  it("throws invalid_response for empty non-JSON error body", async () => {
    server.use(
      http.post(
        "http://localhost:8000/chart/generate",
        () =>
          new HttpResponse(null, {
            status: 502,
            headers: { "Content-Type": "text/plain" },
          }),
      ),
    );

    await expect(generateChart(birthInfo)).rejects.toMatchObject({
      apiError: expect.objectContaining({ code: "invalid_response" }),
    });
  });

  it("maps 422 validation errors", async () => {
    server.use(
      http.post("http://localhost:8000/chart/generate", () =>
        HttpResponse.json(
          { detail: [{ loc: ["body", "day"], msg: "invalid", type: "value_error" }] },
          { status: 422 },
        ),
      ),
    );

    await expect(generateChart(birthInfo)).rejects.toMatchObject({
      apiError: expect.objectContaining({ code: "validation" }),
    });
  });

  it("times out when the request exceeds timeoutMs", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) {
            reject(new Error("missing signal"));
            return;
          }
          const onAbort = () => {
            signal.removeEventListener("abort", onAbort);
            reject(new DOMException("The operation was aborted.", "AbortError"));
          };
          if (signal.aborted) {
            onAbort();
            return;
          }
          signal.addEventListener("abort", onAbort);
        }),
    );

    await expect(generateChart(birthInfo, { timeoutMs: 20 })).rejects.toMatchObject({
      apiError: expect.objectContaining({ code: "timeout" }),
    });
  });

  it("reports cancelled when the external signal aborts", async () => {
    const controller = new AbortController();
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) {
            reject(new Error("missing signal"));
            return;
          }
          const onAbort = () => {
            signal.removeEventListener("abort", onAbort);
            reject(new DOMException("The operation was aborted.", "AbortError"));
          };
          if (signal.aborted) {
            onAbort();
            return;
          }
          signal.addEventListener("abort", onAbort);
        }),
    );

    const pending = generateChart(birthInfo, {
      signal: controller.signal,
      timeoutMs: 5_000,
    });
    controller.abort();

    await expect(pending).rejects.toMatchObject({
      apiError: expect.objectContaining({ code: "cancelled" }),
    });
  });
});
