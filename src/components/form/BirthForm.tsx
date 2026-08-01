"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  COLD_START_HINT_MS,
  STILL_PROCESSING_HINT_MS,
  generateChart,
  toApiError,
} from "@/lib/api/generate-chart";
import type { ApiError } from "@/lib/api/errors";
import type { ChartResponse } from "@/lib/chart/validate";
import {
  CHILDREN_STATUS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  formatTrueSolarHint,
  type BirthContext,
} from "@/lib/form/birth-context";
import { BIRTH_COUNTRIES, placesForCountry } from "@/lib/form/birth-places";
import {
  birthFormSchema,
  defaultBirthFormValues,
  formValuesToBirthContext,
  formValuesToBirthInfo,
  type BirthFormValues,
  type BirthInfoRequest,
} from "@/lib/form/birth-schema";
import { HOUR_BRANCHES } from "@/lib/form/hours";

type BirthFormProps = {
  onSuccess: (payload: {
    birthInput: BirthInfoRequest;
    chart: ChartResponse;
    birthContext: BirthContext;
  }) => void;
  initialValues?: BirthFormValues;
  disabledSaveHint?: string;
};

const GENDER_OPTIONS = [
  { value: "1" as const, label: "Nam" },
  { value: "-1" as const, label: "Nữ" },
];

const CALENDAR_OPTIONS = [
  { value: "true" as const, label: "Dương lịch" },
  { value: "false" as const, label: "Âm lịch" },
];

const MARITAL_OPTIONS = MARITAL_STATUS_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

const CHILDREN_OPTIONS = CHILDREN_STATUS_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

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
  const birthCountry = useWatch({ control: form.control, name: "birth_country" });
  const birthPlaceValue = useWatch({ control: form.control, name: "birth_place" });
  const isSolar = isSolarValue === "true";
  const dayMax = isSolar ? 31 : 30;
  const regionOptions = useMemo(() => placesForCountry(birthCountry), [birthCountry]);
  const placeSelectOptions = useMemo(
    () => regionOptions.map((p) => ({ value: p.id, label: p.label })),
    [regionOptions],
  );
  const trueSolarHint = formatTrueSolarHint(birthPlaceValue || null);

  useEffect(() => {
    if (!birthPlaceValue) return;
    const stillValid = regionOptions.some((p) => p.id === birthPlaceValue);
    if (!stillValid) {
      form.setValue("birth_place", "", { shouldDirty: true });
    }
  }, [birthCountry, birthPlaceValue, form, regionOptions]);

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
      const birthContext = formValuesToBirthContext(values);
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
        onSuccess({ birthInput, chart, birthContext });
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
  const hintClass = "mt-1 text-sm font-normal text-[var(--ink-muted)]";
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

        <Controller
          name="gender"
          control={form.control}
          render={({ field }) => (
            <SegmentedControl
              id="gender"
              label="Giới tính"
              value={field.value}
              options={GENDER_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="is_solar"
          control={form.control}
          render={({ field }) => (
            <SegmentedControl
              id="is_solar"
              label="Lịch"
              value={field.value}
              options={CALENDAR_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />

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
          <label htmlFor="birth_country" className={labelClass}>
            Quốc gia
          </label>
          <select id="birth_country" className={fieldClass} {...form.register("birth_country")}>
            {BIRTH_COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Controller
          name="birth_place"
          control={form.control}
          render={({ field }) => (
            <div className="sm:col-span-2">
              <SearchableSelect
                id="birth_place"
                label="Khu vực sinh"
                hint="(để chỉnh giờ theo kinh độ, nếu cần)"
                value={field.value}
                options={placeSelectOptions}
                onChange={field.onChange}
                placeholder="Chọn khu vực (không bắt buộc)"
                emptyOptionLabel="Không chọn"
                data-testid="birth-place"
              />
              {trueSolarHint ? <p className={hintClass}>{trueSolarHint}</p> : null}
              {form.formState.errors.birth_place ? (
                <p className={errorClass}>{form.formState.errors.birth_place.message}</p>
              ) : null}
            </div>
          )}
        />

        <Controller
          name="marital_status"
          control={form.control}
          render={({ field }) => (
            <SegmentedControl
              id="marital_status"
              label="Tình trạng hôn nhân"
              hint="(tùy chọn, hỗ trợ luận cung Phu thê)"
              value={field.value}
              options={MARITAL_OPTIONS}
              onChange={field.onChange}
              wrap
              className="sm:col-span-2"
            />
          )}
        />

        <Controller
          name="children_status"
          control={form.control}
          render={({ field }) => (
            <SegmentedControl
              id="children_status"
              label="Tình trạng con cái"
              hint="(tùy chọn, hỗ trợ luận cung Tử tức)"
              value={field.value}
              options={CHILDREN_OPTIONS}
              onChange={field.onChange}
              wrap
              className="sm:col-span-2"
            />
          )}
        />
      </div>

      {!isSolar ? (
        <p className="text-sm text-[var(--ink-muted)]">
          Ghi chú: tháng nhuận âm lịch chưa được hỗ trợ. Nếu sinh vào tháng nhuận, hãy chọn tháng
          thường gần nhất hoặc dùng lịch dương.
        </p>
      ) : null}

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
