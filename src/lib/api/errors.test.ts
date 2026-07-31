import { describe, expect, it } from "vitest";

import { normalizeApiError, parseRetryAfter } from "@/lib/api/errors";

describe("parseRetryAfter", () => {
  it("parses integer seconds", () => {
    expect(parseRetryAfter("12")).toBe(12);
  });

  it("parses HTTP date", () => {
    const future = new Date(Date.now() + 5000).toUTCString();
    const value = parseRetryAfter(future);
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(6);
  });

  it("returns undefined for empty", () => {
    expect(parseRetryAfter(null)).toBeUndefined();
    expect(parseRetryAfter("")).toBeUndefined();
  });
});

describe("normalizeApiError", () => {
  it("maps 400 detail string", () => {
    const err = normalizeApiError({
      status: 400,
      body: { detail: "bad input" },
      requestId: "abc",
    });
    expect(err).toMatchObject({ code: "bad_request", message: "bad input", requestId: "abc" });
  });

  it("maps 422 field errors from loc", () => {
    const err = normalizeApiError({
      status: 422,
      body: {
        detail: [{ loc: ["body", "day"], msg: "invalid", type: "value_error" }],
      },
    });
    expect(err.code).toBe("validation");
    expect(err.fieldErrors).toEqual({ day: "invalid" });
  });

  it("maps 429 with Retry-After", () => {
    const err = normalizeApiError({
      status: 429,
      body: { detail: "slow down", request_id: "r1" },
      retryAfterHeader: "30",
    });
    expect(err.code).toBe("rate_limited");
    expect(err.retryAfterSeconds).toBe(30);
    expect(err.requestId).toBe("r1");
  });

  it("maps 500 with request id", () => {
    const err = normalizeApiError({
      status: 500,
      body: { error: "Internal Server Error", request_id: "x" },
      requestId: "fallback",
    });
    expect(err.code).toBe("server_error");
    expect(err.message).toContain("x");
  });

  it("maps 503 engine unavailable", () => {
    const err = normalizeApiError({ status: 503, body: { error: "Chart engine unavailable" } });
    expect(err.code).toBe("engine_unavailable");
  });

  it("maps timeout, cancel, network", () => {
    expect(normalizeApiError({ cause: "timeout" }).code).toBe("timeout");
    expect(normalizeApiError({ cause: "cancelled" }).code).toBe("cancelled");
    expect(normalizeApiError({ cause: "network" }).code).toBe("network");
    expect(normalizeApiError({ cause: "cors" }).code).toBe("cors");
  });
});
