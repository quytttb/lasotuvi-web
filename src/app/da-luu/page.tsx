import type { Metadata } from "next";

import { SavedChartsList } from "@/components/saved/SavedChartsList";

export const metadata: Metadata = {
  title: "Lá số đã lưu",
  description: "Danh sách lá số Tử Vi đã lưu trên thiết bị của bạn (IndexedDB).",
  robots: { index: false, follow: false },
  alternates: { canonical: "/da-luu" },
};

export default function DaLuuPage() {
  return (
    <div className="site-container py-10 sm:py-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--earth)]">
          Thư viện của bạn
        </p>
        <h1 className="font-serif text-3xl text-[var(--ink)] sm:text-4xl">Lá số đã lưu</h1>
        <p className="mt-4 leading-relaxed text-[var(--ink-muted)]">
          Mở lại, đổi tên, xuất JSON hoặc xóa. Dữ liệu chỉ tồn tại trên trình duyệt này.
        </p>
      </header>
      <SavedChartsList />
    </div>
  );
}
