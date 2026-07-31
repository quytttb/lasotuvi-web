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

export function ChartCenter({ chart }: ChartCenterProps) {
  const meta = chart.chart_meta ?? chart.earth_plate.chart_meta;
  const sb = chart.stem_branch;
  const name = chart.birth_info.name?.trim() || "Ẩn danh";

  return (
    <div
      className="chart-center flex h-full flex-col justify-center gap-1.5 border border-[var(--line)] bg-[var(--paper)] p-3 text-center text-[0.75rem] leading-snug"
      style={{ gridRow: "2 / 4", gridColumn: "2 / 4" }}
    >
      <p className="font-serif text-base font-semibold text-[var(--ink)]">{name}</p>
      <p>{mapGenderToLabel(chart.birth_info.gender)}</p>
      <p>
        Dương lịch: {formatSolar(chart)}
        {chart.birth_info.is_solar ? "" : " (quy đổi)"}
      </p>
      <p>Âm lịch: {formatLunar(chart)}</p>
      <div className="mt-1 space-y-0.5 text-[var(--ink-soft)]">
        {sb.year?.label ? <p>Năm: {sb.year.label}</p> : null}
        {sb.month?.label ? <p>Tháng: {sb.month.label}</p> : null}
        {sb.day?.label ? <p>Ngày: {sb.day.label}</p> : null}
        {sb.hour?.label ? <p>Giờ: {sb.hour.label}</p> : null}
      </div>
      <div className="mt-1 space-y-0.5 border-t border-[var(--line-soft)] pt-1.5">
        {meta?.ben_ming_name || meta?.nayin ? (
          <p>
            Bản mệnh / Nạp âm: {[meta?.ben_ming_name, meta?.nayin].filter(Boolean).join(" — ")}
          </p>
        ) : null}
        <p>Ngũ hành cục: {chart.earth_plate.wu_xing_ju_name}</p>
        {meta?.life_yin_yang_status ? <p>Âm dương: {meta.life_yin_yang_status}</p> : null}
        {meta?.ming_zhu ? <p>Mệnh chủ: {meta.ming_zhu}</p> : null}
        {meta?.shen_zhu ? <p>Thân chủ: {meta.shen_zhu}</p> : null}
        {meta?.sheng_ke_status ? <p>Sinh khắc: {meta.sheng_ke_status}</p> : null}
        {meta?.view_year ? (
          <p>
            Năm xem: {meta.view_year}
            {meta.view_year_branch ? ` (${meta.view_year_branch})` : ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}
