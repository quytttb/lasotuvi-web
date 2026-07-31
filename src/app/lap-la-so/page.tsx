import type { Metadata } from "next";

import { LapLaSoClient } from "@/components/chart/LapLaSoClient";

export const metadata: Metadata = {
  title: "Lập lá số",
  description: "Nhập ngày giờ sinh và lập lá số Tử Vi Đẩu Số qua LasoTuVi API v2.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/lap-la-so" },
};

export default function LapLaSoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 max-w-2xl">
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
