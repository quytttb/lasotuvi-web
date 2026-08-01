"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import {
  COLD_START_HINT_MS,
  STILL_PROCESSING_HINT_MS,
  generateChart,
  toApiError,
} from "@/lib/api/generate-chart";
import type { ApiError } from "@/lib/api/errors";
import type { ChartResponse } from "@/lib/chart/validate";
import {
  birthFormSchema,
  defaultBirthFormValues,
  formValuesToBirthInfo,
  type BirthFormValues,
  type BirthInfoRequest,
} from "@/lib/form/birth-schema";
import { HOUR_BRANCHES } from "@/lib/form/hours";

type BirthFormProps = {
  onSuccess: (payload: { birthInput: BirthInfoRequest; chart: ChartResponse }) => void;
  initialValues?: BirthFormValues;
  disabledSaveHint?: string;
};

function loadingHint(elapsedMs: number): string {
  if (elapsedMs >= STILL_PROCESSING_HINT_MS) {
    return "Lá số vẫn đang được xử lý, vui lòng chờ…";
  }
  if (elapsedMs >= COLD_START_HINT_MS) {
    return "Máy chủ miễn phí có thể đang khởi động…";
  }
  return "Đang lập lá số…";
}

export function BirthForm({ onSuccess, initialValues, disabledSaveHint }: BirthFormProps) {
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [retryAfterLeft, setRetryAfterLeft] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const form = useForm<BirthFormValues>({
    resolver: zodResolver(birthFormSchema),
    defaultValues: initialValues ?? defaultBirthFormValues(),
    mode: "onSubmit",
  });

  const isSolarValue = useWatch({ control: form.control, name: "is_solar" });
  const isSolar = isSolarValue === "true";
  const dayMax = isSolar ? 31 : 30;

  useEffect(() => {
    if (apiError?.code !== "rate_limited" || apiError.retryAfterSeconds == null) {
      setRetryAfterLeft(null);
      return;
    }
    setRetryAfterLeft(apiError.retryAfterSeconds);
    const id = window.setInterval(() => {
      setRetryAfterLeft((prev) => {
        if (prev == null || prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [apiError]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const onSubmit = useCallback(
    async (values: BirthFormValues) => {
      setApiError(null);
      const birthInput = formValuesToBirthInfo(values);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setElapsedMs(0);
      startedAtRef.current = performance.now();
      timerRef.current = window.setInterval(() => {
        setElapsedMs(performance.now() - startedAtRef.current);
      }, 500);

      try {
        const { chart } = await generateChart(birthInput, { signal: controller.signal });
        onSuccess({ birthInput, chart });
      } catch (error) {
        const normalized = toApiError(error);
        setApiError(normalized);
        if (normalized.fieldErrors) {
          for (const [field, message] of Object.entries(normalized.fieldErrors)) {
            if (field in values) {
              form.setError(field as keyof BirthFormValues, { message });
            }
          }
        }
      } finally {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setLoading(false);
        setElapsedMs(0);
      }
    },
    [form, onSuccess],
  );

  const handleFormSubmit = form.handleSubmit(onSubmit);

  function cancelRequest() {
    abortRef.current?.abort();
  }

  const fieldClass =
    "min-h-11 w-full rounded-sm border border-[var(--line)] bg-[var(--paper)] px-3 text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]";
  const labelClass = "mb-1 block text-sm font-medium text-[var(--ink)]";
  const errorClass = "mt-1 text-sm text-[var(--fire)]";

  return (
    <form
      onSubmit={handleFormSubmit}
      className="print:hidden space-y-5 rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] p-5"
      noValidate
      data-testid="birth-form"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            Họ tên <span className="font-normal text-[var(--ink-muted)]">(không bắt buộc)</span>
          </label>
          <input
            id="name"
            className={fieldClass}
            maxLength={100}
            autoComplete="name"
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className={errorClass}>{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="gender" className={labelClass}>
            Giới tính
          </label>
          <select id="gender" className={fieldClass} {...form.register("gender")}>
            <option value="1">Nam</option>
            <option value="-1">Nữ</option>
          </select>
        </div>

        <div>
          <label htmlFor="is_solar" className={labelClass}>
            Lịch
          </label>
          <select id="is_solar" className={fieldClass} {...form.register("is_solar")}>
            <option value="true">Dương lịch</option>
            <option value="false">Âm lịch</option>
          </select>
        </div>

        <div>
          <label htmlFor="day" className={labelClass}>
            Ngày
          </label>
          <input
            id="day"
            type="number"
            inputMode="numeric"
            min={1}
            max={dayMax}
            className={fieldClass}
            {...form.register("day", { valueAsNumber: true })}
          />
          {form.formState.errors.day ? (
            <p className={errorClass} role="alert">
              {form.formState.errors.day.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="month" className={labelClass}>
            Tháng
          </label>
          <input
            id="month"
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            className={fieldClass}
            {...form.register("month", { valueAsNumber: true })}
          />
          {form.formState.errors.month ? (
            <p className={errorClass}>{form.formState.errors.month.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="year" className={labelClass}>
            Năm sinh
          </label>
          <input
            id="year"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            className={fieldClass}
            {...form.register("year", { valueAsNumber: true })}
          />
          {form.formState.errors.year ? (
            <p className={errorClass}>{form.formState.errors.year.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="hour" className={labelClass}>
            Giờ sinh (địa chi)
          </label>
          <select
            id="hour"
            className={fieldClass}
            {...form.register("hour", { valueAsNumber: true })}
          >
            {HOUR_BRANCHES.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
          {form.formState.errors.hour ? (
            <p className={errorClass}>{form.formState.errors.hour.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="view_year" className={labelClass}>
            Năm xem
          </label>
          <input
            id="view_year"
            type="number"
            inputMode="numeric"
            min={1900}
            max={2200}
            className={fieldClass}
            {...form.register("view_year", { valueAsNumber: true })}
          />
          {form.formState.errors.view_year ? (
            <p className={errorClass}>{form.formState.errors.view_year.message}</p>
          ) : null}
        </div>
      </div>

      {!isSolar ? (
        <p className="text-sm text-[var(--ink-muted)]">
          Ghi chú: tháng nhuận âm lịch chưa được hỗ trợ. Nếu sinh vào tháng nhuận, hãy chọn tháng
          thường gần nhất hoặc dùng lịch dương.
        </p>
      ) : null}

      <details className="rounded-sm border border-[var(--line-soft)] p-3">
        <summary className="cursor-pointer text-sm font-medium">Tùy chọn nâng cao</summary>
        <div className="mt-3 max-w-xs">
          <label htmlFor="timezone" className={labelClass}>
            Múi giờ (mặc định +7)
          </label>
          <input
            id="timezone"
            type="number"
            inputMode="numeric"
            min={-12}
            max={14}
            className={fieldClass}
            {...form.register("timezone", { valueAsNumber: true })}
          />
          {form.formState.errors.timezone ? (
            <p className={errorClass}>{form.formState.errors.timezone.message}</p>
          ) : null}
        </div>
      </details>

      {disabledSaveHint ? (
        <p className="text-sm text-[var(--ink-muted)]">{disabledSaveHint}</p>
      ) : null}

      {apiError ? (
        <div
          role="alert"
          className="rounded-sm border border-[var(--fire)]/30 bg-[var(--fire-soft)] px-4 py-3 text-sm"
          data-testid="api-error"
        >
          <p className="font-medium text-[var(--fire)]">{apiError.message}</p>
          {apiError.requestId ? (
            <p className="mt-1 text-[var(--ink-muted)]">Mã yêu cầu: {apiError.requestId}</p>
          ) : null}
          {apiError.code === "rate_limited" ? (
            <p className="mt-1" data-testid="retry-after">
              {retryAfterLeft != null
                ? `Thử lại sau: ${retryAfterLeft}s`
                : "Vui lòng chờ rồi thử lại thủ công (không tự gửi lại)."}
            </p>
          ) : null}
          {apiError.code === "engine_unavailable" ? (
            <p className="mt-2 text-[var(--ink-soft)]">
              Bạn có thể nhấn “Lập lá số” để thử lại thủ công.
            </p>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-[var(--water)]" data-testid="loading-message" aria-live="polite">
          {loadingHint(elapsedMs)}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} data-testid="submit-chart">
          {loading ? "Đang lập…" : "Lập lá số"}
        </Button>
        {loading ? (
          <Button
            type="button"
            variant="secondary"
            onClick={cancelRequest}
            data-testid="cancel-request"
          >
            Hủy
          </Button>
        ) : null}
      </div>
    </form>
  );
}
