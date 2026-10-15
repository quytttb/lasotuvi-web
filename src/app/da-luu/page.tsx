import type { Metadata } from "next";

import { SavedChartsList } from "@/components/saved/SavedChartsList";

export const metadata: Metadata = {
  title: "Lá số đã lưu",
  description: "Danh sách lá số Tử Vi đã lưu an toàn trên thiết bị của bạn.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/da-luu" },
};

export default function DaLuuPage() {
  return (
    <div className="site-container py-10 sm:py-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--vermillion)]">
          Thư viện của bạn
        </p>
        <h1 className="font-serif text-3xl text-[var(--ink)] sm:text-4xl">Lá số đã lưu</h1>
        <p className="mt-4 leading-relaxed text-[var(--ink-muted)]">
          Mở lại, đổi tên, tải về hoặc xóa. Lá số được lưu an toàn và riêng tư trên thiết bị của
          bạn.
        </p>
      </header>
      <SavedChartsList />
    </div>
  );
}
