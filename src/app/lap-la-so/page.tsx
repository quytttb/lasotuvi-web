import type { Metadata } from "next";

import { LapLaSoClient } from "@/components/chart/LapLaSoClient";

export const metadata: Metadata = {
  title: "Lập lá số",
  description:
    "Nhập ngày giờ sinh để lập và luận giải lá số Tử Vi Đẩu Số 12 cung theo bố cục truyền thống.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/lap-la-so" },
};

export default function LapLaSoPage() {
  return (
    <div className="workspace-container py-10 sm:py-14 print:max-w-none print:px-0 print:py-0">
      <header className="print:hidden mx-auto mb-10 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--vermillion)] mb-2">
          Tử Vi Đẩu Số
        </p>
        <h1 className="font-serif text-3xl text-[var(--ink)] sm:text-4xl">Lập lá số</h1>
        <div className="mt-3 h-[2px] w-16 bg-gradient-to-r from-[var(--vermillion)] to-transparent rounded-full" />
        <p className="mt-4 text-[var(--ink-muted)] leading-relaxed text-sm sm:text-base">
          Điền thông tin sinh rồi xem kết quả ngay trên trang này.{" "}
          <span className="text-[var(--ink-faint)]">
            Thông tin sinh được bảo mật hoàn toàn riêng tư.
          </span>
        </p>
      </header>
      <LapLaSoClient />
    </div>
  );
}
