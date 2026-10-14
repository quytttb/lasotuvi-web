import { isDisplayableVietnameseMeta } from "@/lib/chart/labels";
import type { ChartResponse } from "@/lib/chart/validate";
import { mapGenderToLabel } from "@/lib/form/birth-schema";

type ChartCenterProps = {
  chart: ChartResponse;
};

function formatSolar(chart: ChartResponse): string {
  const b = chart.birth_info;
  return `${String(b.day).padStart(2, "0")}/${String(b.month).padStart(2, "0")}/${b.year}`;
}

function formatLunar(chart: ChartResponse): string {
  const l = chart.lunar_date;
  const leap = l.is_leap_month ? " (nhuận)" : "";
  return `${String(l.day).padStart(2, "0")}/${String(l.month).padStart(2, "0")}/${l.year}${leap}`;
}

function MetaRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-x-2 text-left">
      <dt className="text-[var(--ink-faint)] text-[0.72rem] uppercase tracking-wide">{label}</dt>
      <dd className="min-w-0 break-words font-medium text-[var(--ink)] text-[0.8rem]">{value}</dd>
    </div>
  );
}

export function ChartCenter({ chart }: ChartCenterProps) {
  const meta = chart.chart_meta ?? chart.earth_plate.chart_meta;
  const sb = chart.stem_branch;
  const name = chart.birth_info.name?.trim() || "Ẩn danh";
  const nayin = isDisplayableVietnameseMeta(meta?.nayin) ? meta?.nayin : null;
  const banMenh = [meta?.ben_ming_name, nayin].filter(Boolean).join(" — ") || null;

  return (
    <div
      className="chart-center flex h-full flex-col justify-center gap-4 border border-[var(--line)] px-4 py-4 leading-snug"
      style={{ gridRow: "2 / 4", gridColumn: "2 / 4" }}
    >
      {/* ── Name & gender ── */}
      <div className="text-center">
        {/* Decorative top ornament */}
        <p
          className="text-[var(--vermillion)] text-sm opacity-40 mb-1.5 select-none"
          aria-hidden="true"
        >
          ✦ ☯ ✦
        </p>
        <p className="font-serif text-xl font-semibold text-[var(--ink)] tracking-wide">{name}</p>
        <p className="mt-0.5 text-[0.8rem] text-[var(--ink-muted)]">
          {mapGenderToLabel(chart.birth_info.gender)}
        </p>
        {/* Thin gold rule */}
        <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" />
      </div>

      {/* ── Metadata grid ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.8rem]">
        <dl className="space-y-1.5">
          <MetaRow
            label="Dương lịch"
            value={`${formatSolar(chart)}${chart.birth_info.is_solar ? "" : " (quy đổi)"}`}
          />
          <MetaRow label="Âm lịch" value={formatLunar(chart)} />
          {sb.year?.label ? <MetaRow label="Năm" value={sb.year.label} /> : null}
          {sb.month?.label ? <MetaRow label="Tháng" value={sb.month.label} /> : null}
          {sb.day?.label ? <MetaRow label="Ngày" value={sb.day.label} /> : null}
          {sb.hour?.label ? <MetaRow label="Giờ" value={sb.hour.label} /> : null}
        </dl>

        <dl className="space-y-1.5 border-l border-[var(--line-faint)] pl-4">
          <MetaRow label="Bản mệnh" value={banMenh} />
          <MetaRow label="Ngũ hành cục" value={chart.earth_plate.wu_xing_ju_name} />
          <MetaRow label="Âm dương" value={meta?.life_yin_yang_status} />
          <MetaRow label="Mệnh chủ" value={meta?.ming_zhu} />
          <MetaRow label="Thân chủ" value={meta?.shen_zhu} />
          <MetaRow label="Sinh khắc" value={meta?.sheng_ke_status} />
          <MetaRow
            label="Năm xem"
            value={
              meta?.view_year
                ? `${meta.view_year}${meta.view_year_branch ? ` (${meta.view_year_branch})` : ""}`
                : null
            }
          />
        </dl>
      </div>

      {/* Bottom ornament */}
      <p
        className="text-center text-[var(--ink-faint)] text-[10px] select-none opacity-40"
        aria-hidden="true"
      >
        — 紫微斗數 —
      </p>
    </div>
  );
}
