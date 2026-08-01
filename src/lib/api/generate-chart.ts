import { joinApiUrl } from "@/lib/config";
import { ApiClientError, normalizeApiError, type ApiError } from "@/lib/api/errors";
import type { BirthInfoRequest } from "@/lib/form/birth-schema";
import { safeValidateChartResponse, type ChartResponse } from "@/lib/chart/validate";

export const API_TIMEOUT_MS = 90_000;
export const COLD_START_HINT_MS = 8_000;
export const STILL_PROCESSING_HINT_MS = 30_000;

export type GenerateChartOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  requestId?: string;
};

export type GenerateChartResult = {
  chart: ChartResponse;
  requestId: string;
};

async function readBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }
  try {
    const text = await response.text();
    return text ? { detail: text.slice(0, 500) } : undefined;
  } catch {
    return undefined;
  }
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

/**
 * POST /chart/generate — no automatic retries.
 * Browser calls NEXT_PUBLIC_LASOTUVI_API_URL directly with credentials: "omit".
 */
export async function generateChart(
  birthInfo: BirthInfoRequest,
  options: GenerateChartOptions = {},
): Promise<GenerateChartResult> {
  const requestId = options.requestId ?? crypto.randomUUID();
  const timeoutMs = options.timeoutMs ?? API_TIMEOUT_MS;
  const controller = new AbortController();
  const external = options.signal;

  const onExternalAbort = () => controller.abort(external?.reason);
  if (external) {
    if (external.aborted) {
      controller.abort(external.reason);
    } else {
      external.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException("Timeout", "TimeoutError"));
  }, timeoutMs);

  try {
    let response: Response;
    try {
      response = await fetch(joinApiUrl("/chart/generate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Request-ID": requestId,
        },
        body: JSON.stringify(birthInfo),
        credentials: "omit",
        signal: controller.signal,
      });
    } catch (error) {
      if (isAbortError(error)) {
        const reason = controller.signal.reason;
        const timedOut = reason instanceof DOMException && reason.name === "TimeoutError";
        const userCancelled = Boolean(external?.aborted) && !timedOut;
        throw new ApiClientError(
          normalizeApiError({
            requestId,
            cause: timedOut ? "timeout" : userCancelled ? "cancelled" : "timeout",
          }),
        );
      }

      const message = error instanceof Error ? error.message : String(error);
      const looksLikeCors =
        message.toLowerCase().includes("cors") || message.toLowerCase().includes("failed to fetch");
      throw new ApiClientError(
        normalizeApiError({
          requestId,
          cause: looksLikeCors ? "cors" : "network",
        }),
      );
    }

    const responseRequestId = response.headers.get("X-Request-ID") ?? requestId;
    const body = await readBody(response);

    if (!response.ok) {
      if (body === undefined && !response.headers.get("content-type")?.includes("json")) {
        throw new ApiClientError(
          normalizeApiError({
            status: response.status,
            requestId: responseRequestId,
            cause: "invalid_response",
            fallbackMessage: "Máy chủ trả về phản hồi không phải JSON.",
          }),
        );
      }

      throw new ApiClientError(
        normalizeApiError({
          status: response.status,
          body,
          requestId: responseRequestId,
          retryAfterHeader: (() => {
            const fromHeader =
              response.headers.get("Retry-After") ?? response.headers.get("retry-after");
            if (fromHeader) return fromHeader;
            if (body && typeof body === "object" && "retry_after" in body) {
              const value = (body as { retry_after?: unknown }).retry_after;
              if (typeof value === "number" || typeof value === "string") return String(value);
            }
            return null;
          })(),
        }),
      );
    }

    const validated = safeValidateChartResponse(body);
    if (!validated.ok) {
      throw new ApiClientError(
        normalizeApiError({
          status: response.status,
          requestId: responseRequestId,
          cause: "invalid_response",
          fallbackMessage: validated.message,
        }),
      );
    }

    return { chart: validated.data, requestId: responseRequestId };
  } finally {
    clearTimeout(timeoutId);
    external?.removeEventListener("abort", onExternalAbort);
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiClientError) return error.apiError;
  return normalizeApiError({
    cause: "network",
    fallbackMessage: error instanceof Error ? error.message : "Lỗi không xác định.",
  });
}
