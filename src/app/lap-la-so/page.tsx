import type { Metadata } from "next";

import { LapLaSoClient } from "@/components/chart/LapLaSoClient";

export const metadata: Metadata = {
  title: "Lập lá số",
  description: "Nhập ngày giờ sinh và lập lá số Tử Vi Đẩu Số qua LasoTuVi API.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/lap-la-so" },
};

export default function LapLaSoPage() {
  return (
    <div className="mx-auto w-full max-w-[100rem] px-3 py-6 sm:px-5 sm:py-10 print:max-w-none print:px-0 print:py-0">
      <header className="print:hidden mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--earth)] mb-2">
          Tử Vi Đẩu Số
        </p>
        <h1 className="font-serif text-3xl text-[var(--ink)] sm:text-4xl">Lập lá số</h1>
        <div className="mt-3 h-[2px] w-16 bg-gradient-to-r from-[var(--vermillion)] to-transparent rounded-full" />
        <p className="mt-4 text-[var(--ink-muted)] leading-relaxed text-sm sm:text-base">
          Điền thông tin sinh rồi xem kết quả ngay trên trang này.{" "}
          <span className="text-[var(--ink-faint)]">Thông tin sinh không được đưa vào URL.</span>
        </p>
      </header>
      <LapLaSoClient />
    </div>
  );
}
