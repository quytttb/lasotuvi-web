export type ApiErrorCode =
  | "validation"
  | "bad_request"
  | "rate_limited"
  | "engine_unavailable"
  | "server_error"
  | "timeout"
  | "cancelled"
  | "network"
  | "cors"
  | "invalid_response";

export type ApiError = {
  status?: number;
  code: ApiErrorCode;
  message: string;
  requestId?: string;
  retryAfterSeconds?: number;
  fieldErrors?: Record<string, string>;
};

export class ApiClientError extends Error {
  readonly apiError: ApiError;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = "ApiClientError";
    this.apiError = apiError;
  }
}

export function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const trimmed = header.trim();
  if (!trimmed) return undefined;

  const asSeconds = Number(trimmed);
  if (Number.isFinite(asSeconds) && asSeconds >= 0) {
    return Math.ceil(asSeconds);
  }

  const asDate = Date.parse(trimmed);
  if (!Number.isNaN(asDate)) {
    const delta = Math.ceil((asDate - Date.now()) / 1000);
    return delta > 0 ? delta : 0;
  }

  return undefined;
}

type FastApiValidationItem = {
  loc?: unknown[];
  msg?: string;
  type?: string;
};

function safeString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function fieldFromLoc(loc: unknown[] | undefined): string | undefined {
  if (!loc || loc.length === 0) return undefined;
  const last = loc[loc.length - 1];
  return typeof last === "string" || typeof last === "number" ? String(last) : undefined;
}

export function normalizeApiError(params: {
  status?: number;
  body?: unknown;
  requestId?: string;
  retryAfterHeader?: string | null;
  cause?: "timeout" | "cancelled" | "network" | "cors" | "invalid_response";
  fallbackMessage?: string;
}): ApiError {
  const { status, body, requestId, retryAfterHeader, cause, fallbackMessage } = params;

  if (cause === "timeout") {
    return {
      code: "timeout",
      message: "Yêu cầu hết thời gian chờ. Máy chủ có thể đang khởi động hoặc quá tải.",
      requestId,
    };
  }
  if (cause === "cancelled") {
    return {
      code: "cancelled",
      message: "Đã hủy yêu cầu lập lá số.",
      requestId,
    };
  }
  if (cause === "cors") {
    return {
      code: "cors",
      message:
        "Không thể gọi API do CORS. Frontend chưa được phép trong LASOTUVI_CORS_ORIGINS hoặc API chưa truy cập được.",
      requestId,
    };
  }
  if (cause === "network") {
    return {
      code: "network",
      message:
        "Không thể kết nối tới API. Kiểm tra NEXT_PUBLIC_LASOTUVI_API_URL và cấu hình CORS backend.",
      requestId,
    };
  }
  if (cause === "invalid_response") {
    return {
      code: "invalid_response",
      message: fallbackMessage ?? "Phản hồi API không hợp lệ hoặc thiếu dữ liệu cần thiết.",
      requestId,
      status,
    };
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const detail = record?.detail;
  const errorField = safeString(record?.error);
  const bodyRequestId =
    safeString(record?.request_id) ?? safeString(record?.requestId) ?? requestId;

  if (status === 422 && Array.isArray(detail)) {
    const fieldErrors: Record<string, string> = {};
    const messages: string[] = [];
    for (const item of detail as FastApiValidationItem[]) {
      const field = fieldFromLoc(item.loc);
      const msg = safeString(item.msg) ?? "Giá trị không hợp lệ";
      if (field) fieldErrors[field] = msg;
      messages.push(field ? `${field}: ${msg}` : msg);
    }
    return {
      status,
      code: "validation",
      message: messages.join("; ") || "Dữ liệu không hợp lệ.",
      requestId: bodyRequestId,
      fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
    };
  }

  if (status === 400) {
    const message = safeString(detail) ?? errorField ?? fallbackMessage ?? "Yêu cầu không hợp lệ.";
    return {
      status,
      code: "bad_request",
      message,
      requestId: bodyRequestId,
    };
  }

  if (status === 429) {
    const message =
      safeString(detail) ?? errorField ?? "Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ rồi thử lại.";
    return {
      status,
      code: "rate_limited",
      message,
      requestId: bodyRequestId,
      retryAfterSeconds: parseRetryAfter(retryAfterHeader ?? null),
    };
  }

  if (status === 503) {
    return {
      status,
      code: "engine_unavailable",
      message:
        safeString(detail) ??
        errorField ??
        "Bộ máy lập lá số đang bận hoặc chưa sẵn sàng. Bạn có thể thử lại thủ công.",
      requestId: bodyRequestId,
    };
  }

  if (status && status >= 500) {
    const idNote = bodyRequestId ? ` Mã yêu cầu: ${bodyRequestId}.` : "";
    return {
      status,
      code: "server_error",
      message: (safeString(detail) ?? errorField ?? "Máy chủ gặp lỗi khi lập lá số.") + idNote,
      requestId: bodyRequestId,
    };
  }

  return {
    status,
    code: "server_error",
    message: fallbackMessage ?? "Đã xảy ra lỗi không xác định.",
    requestId: bodyRequestId,
  };
}
