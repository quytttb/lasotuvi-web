import type { Metadata } from "next";
import Link from "next/link";

import { getApiBaseUrl, getBackendRepoUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Nguồn dữ liệu LasoTuVi API, quyền riêng tư, giới hạn sản phẩm và cách dữ liệu được xử lý.",
  alternates: { canonical: "/gioi-thieu" },
};

export default function GioiThieuPage() {
  const backendRepo = getBackendRepoUrl();
  const apiUrl = getApiBaseUrl();

  return (
    <div className="site-container py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        {/* ── Page header ── */}
        <div className="mb-10 border-b border-[var(--line)] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--earth)] mb-2">
            Về LasoTuVi
          </p>
          <h1 className="font-serif text-3xl text-[var(--ink)] sm:text-4xl">Giới thiệu</h1>
          <div className="mt-3 h-[2px] w-16 bg-gradient-to-r from-[var(--vermillion)] to-transparent rounded-full" />
          <p className="mt-4 text-[var(--ink-muted)] leading-relaxed">
            LasoTuVi là ứng dụng web tiếng Việt giúp bạn lập và tra cứu lá số Tử Vi Đẩu Số theo bố
            cục truyền thống — dễ dùng, lưu an toàn trên thiết bị và không cần tạo tài khoản.
          </p>
        </div>

        {/* ── Source section ── */}
        <section className="mt-8 group">
          <div className="flex items-start gap-4">
            <span
              className="font-serif text-3xl leading-none select-none opacity-20 shrink-0 mt-0.5"
              style={{ color: "var(--water)" }}
              aria-hidden="true"
            >
              源
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl text-[var(--ink)] mb-3">Nguồn dữ liệu</h2>
              <p className="text-[var(--ink-soft)] leading-relaxed">
                Ứng dụng kết nối trực tiếp với máy chủ tính toán LasoTuVi API ({apiUrl}) để an sao
                và lập lá số theo đúng phép tắc Tử Vi Đẩu Số truyền thống.
              </p>
              {backendRepo ? (
                <p className="mt-3 text-sm text-[var(--ink-muted)]">
                  Mã nguồn backend:{" "}
                  <a
                    href={backendRepo}
                    className="text-[var(--water)] underline underline-offset-2 hover:text-[var(--water-light)] transition-colors"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {backendRepo}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3" aria-hidden="true">
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--line-faint)] to-[var(--line)]" />
          <span className="text-[var(--gold)] opacity-50 text-xs">◈</span>
          <div className="flex-1 h-px bg-gradient-to-l from-[var(--line-faint)] to-[var(--line)]" />
        </div>

        {/* ── Privacy section ── */}
        <section className="mt-8">
          <div className="flex items-start gap-4">
            <span
              className="font-serif text-3xl leading-none select-none opacity-20 shrink-0 mt-0.5"
              style={{ color: "var(--wood)" }}
              aria-hidden="true"
            >
              隱
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl text-[var(--ink)] mb-3">Quyền riêng tư</h2>
              <div className="space-y-4 text-[var(--ink-soft)] leading-relaxed">
                <p>
                  Khi bạn lập lá số, thông tin ngày giờ sinh được gửi tới API công khai để tính
                  toán. Frontend không lưu dữ liệu người dùng trên server riêng. Chỉ khi bạn nhấn
                  &ldquo;Lưu lá số&rdquo;, bản ghi mới được ghi vào IndexedDB trên trình duyệt hiện
                  tại.
                </p>
                <p>
                  Không analytics trong MVP. Không đưa dữ liệu sinh vào URL hay nhật ký phía client
                  ở chế độ production.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3" aria-hidden="true">
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--line-faint)] to-[var(--line)]" />
          <span className="text-[var(--gold)] opacity-50 text-xs">◈</span>
          <div className="flex-1 h-px bg-gradient-to-l from-[var(--line-faint)] to-[var(--line)]" />
        </div>

        {/* ── Limits section ── */}
        <section className="mt-8">
          <div className="flex items-start gap-4">
            <span
              className="font-serif text-3xl leading-none select-none opacity-20 shrink-0 mt-0.5"
              style={{ color: "var(--earth)" }}
              aria-hidden="true"
            >
              限
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl text-[var(--ink)] mb-3">Giới hạn</h2>
              <ul className="space-y-3 text-[var(--ink-soft)]">
                {[
                  "Máy chủ Render Free có thể cold start — vui lòng chờ nếu phản hồi chậm.",
                  "Nhập tháng nhuận âm lịch trực tiếp chưa được hỗ trợ đầy đủ.",
                  "Nội dung luận giải mang tính tham khảo văn hóa/nghiên cứu.",
                  "Không đồng bộ đa thiết bị, không chia sẻ public bằng URL.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 leading-relaxed">
                    <span
                      className="text-[var(--earth)] opacity-50 text-[10px] mt-1.5 shrink-0"
                      aria-hidden="true"
                    >
                      ◆
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="mt-12 border-t border-[var(--line-faint)] pt-8 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-[var(--ink-muted)]">Sẵn sàng xem lá số của bạn?</p>
          <Link
            href="/lap-la-so"
            className={[
              "inline-flex items-center gap-2 min-h-11 px-5",
              "rounded-sm text-sm font-medium",
              "bg-[var(--ink)] text-[var(--paper)]",
              "hover:bg-[var(--ink-soft)] transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
            ].join(" ")}
          >
            <span aria-hidden="true">☰</span>
            Bắt đầu lập lá số
          </Link>
        </div>
      </div>
    </div>
  );
}
