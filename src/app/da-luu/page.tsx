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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-serif text-3xl text-[var(--ink)]">Lá số đã lưu</h1>
        <p className="mt-2 text-[var(--ink-muted)]">
          Mở lại, đổi tên, xuất JSON hoặc xóa. Dữ liệu chỉ tồn tại trên trình duyệt này.
        </p>
      </header>
      <SavedChartsList />
    </div>
  );
}
