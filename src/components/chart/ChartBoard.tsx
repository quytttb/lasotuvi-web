import type { ChartResponse, PalaceInfo } from "@/lib/chart/validate";
import { getPalaceGridStyle } from "@/lib/chart/palace-grid";
import { ChartCenter } from "@/components/chart/ChartCenter";
import { PalaceCell } from "@/components/chart/PalaceCell";
import { cn } from "@/lib/utils/cn";

type ChartBoardProps = {
  chart: ChartResponse;
  className?: string;
};

function palacesByIndex(chart: ChartResponse): Map<number, PalaceInfo> {
  const map = new Map<number, PalaceInfo>();
  for (const palace of chart.earth_plate.palaces) {
    map.set(palace.index, palace);
  }
  return map;
}

export function ChartBoard({ chart, className }: ChartBoardProps) {
  const byIndex = palacesByIndex(chart);

  return (
    <div
      className={cn(
        "chart-board grid grid-cols-4 grid-rows-4 gap-0 overflow-hidden border-2 border-[var(--line)] bg-[var(--paper-muted)] shadow-[0_1px_0_rgba(28,25,20,0.04)]",
        "min-h-[46rem] w-full max-w-7xl",
        className,
      )}
      role="region"
      aria-label="Bàn lá số 12 cung"
      data-testid="chart-board"
    >
      {Array.from({ length: 12 }, (_, i) => i + 1).map((index) => {
        const palace = byIndex.get(index);
        const style = getPalaceGridStyle(index);
        if (!palace || !style) return null;
        return (
          <PalaceCell
            key={index}
            palace={palace}
            style={{ gridRow: style.gridRow, gridColumn: style.gridColumn }}
          />
        );
      })}
      <ChartCenter chart={chart} />
    </div>
  );
}
