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
    <div className="mx-auto w-full max-w-[100rem] px-2 py-6 sm:px-3 sm:py-8 print:max-w-none print:px-0 print:py-0">
      <header className="print:hidden mb-6 max-w-2xl">
        <h1 className="font-serif text-3xl text-[var(--ink)]">Lập lá số</h1>
        <p className="mt-2 text-[var(--ink-muted)]">
          Điền thông tin sinh rồi xem kết quả ngay trên trang này. Thông tin sinh không được đưa vào
          URL.
        </p>
      </header>
      <LapLaSoClient />
    </div>
  );
}
