import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "LasoTuVi — lập lá số Tử Vi Đẩu Số tiếng Việt theo bố cục truyền thống. Miễn phí, xem nhanh, riêng tư, không cần tài khoản.",
  alternates: { canonical: "/" },
};

const FIVE_ELEMENTS = [
  { symbol: "木", name: "Mộc", color: "var(--wood)" },
  { symbol: "火", name: "Hỏa", color: "var(--fire)" },
  { symbol: "土", name: "Thổ", color: "var(--earth)" },
  { symbol: "金", name: "Kim", color: "var(--metal)" },
  { symbol: "水", name: "Thủy", color: "var(--water)" },
];

const FEATURES = [
  {
    icon: "福",
    title: "Xem nhanh & Miễn phí",
    body: "Tra cứu lá số bất cứ lúc nào mà không tốn phí. Bố cục sáng rõ, dễ nhìn, người mới tìm hiểu hay người rành Tử Vi đều xem được ngay.",
  },
  {
    icon: "安",
    title: "Kín đáo & Riêng tư",
    body: "Thông tin sinh được gửi tới API để tính lá số. Khi bạn chọn lưu, lá số chỉ được lưu trên trình duyệt hiện tại, không đồng bộ lên máy chủ.",
  },
  {
    icon: "簡",
    title: "Không cần đăng ký",
    body: "Không bắt tạo tài khoản, không phải nhớ mật khẩu hay khai báo thông tin phiền toái. Cứ mở trang lên, nhập ngày giờ sinh là có ngay lá số.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ═══════════════════════════════════════════════════
          HERO — Banner Á Đông bóng bẩy
          ═══════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden border-b border-[var(--line)] bg-[var(--paper-raised)]">
        <div
          className="absolute inset-y-0 right-0 hidden w-[42%] border-l border-[var(--line-faint)] bg-[var(--paper-muted)]/60 lg:block"
          aria-hidden="true"
        />
        <div className="site-container relative grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--earth)] sm:text-sm">
              <span className="text-lg" aria-hidden="true">
                ☯
              </span>
              Tử Vi Đẩu Số · Truyền thống Á Đông
            </p>
            <h1 className="max-w-xl font-serif text-4xl leading-[1.25] tracking-tight text-[var(--ink)] sm:text-5xl">
              Lập lá số Tử Vi theo bố cục{" "}
              <span className="text-[var(--vermillion)]">truyền thống</span>
            </h1>
            <div className="mt-6 h-[2px] w-20 bg-[var(--gold)]" aria-hidden="true" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
              Nhập ngày giờ sinh để xem 12 cung, cách cục và luận giải. Khám phá lá số của bạn với
              bố cục sáng rõ, dễ theo dõi.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
              <Link
                href="/lap-la-so"
                className="btn-primary-oriental inline-flex min-h-12 items-center justify-center gap-3 rounded-sm px-7 text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]"
              >
                Lập lá số
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/gioi-thieu"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-[var(--line)] px-6 text-base font-medium text-[var(--ink)] transition-colors hover:border-[var(--earth)] hover:bg-[var(--paper-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]"
              >
                Tìm hiểu thêm
              </Link>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[var(--ink-muted)]">
              Miễn phí · Không cần tài khoản · Lưu trên thiết bị khi bạn chọn
            </p>
          </div>

          <figure className="relative min-w-0 lg:-mr-8">
            <div className="hero-chart-frame">
              <Image
                src="/images/hero-chart.webp"
                alt="Lá số Tử Vi mẫu của LasoTuVi với bàn 12 cung theo bố cục truyền thống"
                width={1440}
                height={881}
                sizes="(min-width: 1200px) 530px, (min-width: 1024px) 46vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                preload
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-6 flex items-center justify-between gap-3 text-xs leading-relaxed text-[var(--ink-muted)] sm:text-sm">
              <span>Lá số minh họa · Dữ liệu mẫu</span>
              <span className="shrink-0 font-serif text-[var(--earth)]">12 cung · Ngũ hành</span>
            </figcaption>
          </figure>
        </div>
        <div className="border-t border-[var(--line-faint)]">
          <div className="site-container flex flex-wrap items-center justify-between gap-4 py-5">
            <p className="text-sm text-[var(--ink-muted)]">
              Tinh hoa truyền thống, trải nghiệm hiện đại
            </p>
            <ul className="flex flex-wrap gap-5 sm:gap-6" aria-label="Ngũ hành">
              {FIVE_ELEMENTS.map((el) => (
                <li
                  key={el.name}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: el.color }}
                >
                  <span className="font-serif text-lg" aria-hidden="true">
                    {el.symbol}
                  </span>
                  {el.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES — Ba điểm chính
          ═══════════════════════════════════════════════════ */}
      <section className="site-container py-14 sm:py-20">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--earth)] mb-2">
            Đặc điểm nổi bật
          </p>
          <h2 className="font-serif text-2xl text-[var(--ink)] sm:text-3xl heading-decorated mx-auto inline-block">
            Bắt đầu đơn giản, xem lá số rõ ràng
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((item, i) => (
            <li
              key={item.title}
              className={[
                "group relative overflow-hidden rounded-sm",
                "border border-[var(--line)] bg-[var(--paper-raised)]",
                "p-6 sm:p-8 transition-all duration-300",
                "hover:shadow-[0_4px_20px_rgba(26,21,16,0.08)] hover:border-[var(--earth)]/40",
                "hover:-translate-y-0.5",
              ].join(" ")}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Background Chinese character */}
              <div
                className="absolute -bottom-4 -right-2 font-serif text-7xl text-[var(--ink)] opacity-[0.03] select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]"
                aria-hidden="true"
              >
                {item.icon}
              </div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--vermillion)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <span
                  className="font-serif text-3xl text-[var(--ink)] opacity-20 select-none"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <h3 className="mt-3 font-serif text-xl text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA BANNER — Lập lá số ngay
          ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--paper-deep)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(158,43,30,0.05),transparent_60%)]" />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-serif text-[5rem] text-[var(--vermillion)] opacity-[0.04] leading-none">
            命
          </span>
        </div>

        <div className="site-container relative py-14 text-center sm:py-16">
          <p className="font-serif text-2xl text-[var(--ink)] sm:text-3xl">
            Khám phá lá số của bạn
          </p>
          <p className="mt-3 text-[var(--ink-muted)] max-w-md mx-auto text-sm leading-relaxed">
            Nhập ngày tháng năm sinh để xem 12 cung Tử Vi theo bố cục truyền thống Á Đông.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/lap-la-so"
              className={[
                "btn-primary-oriental",
                "inline-flex min-h-12 items-center justify-center rounded-sm px-8 text-base font-medium",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
              ].join(" ")}
            >
              <span className="mr-2" aria-hidden="true">
                ☰
              </span>
              Bắt đầu lập lá số
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DISCLAIMER
          ═══════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--line-faint)] bg-[var(--paper-muted)]/50">
        <div className="site-container py-8 text-sm text-[var(--ink-muted)] sm:py-10">
          <div className="flex items-start gap-3">
            <span className="text-[var(--earth)] opacity-60 text-base mt-0.5" aria-hidden="true">
              ☯
            </span>
            <div>
              <h2 className="font-serif text-base text-[var(--ink)] mb-1.5">
                Miễn trừ trách nhiệm
              </h2>
              <p className="max-w-3xl leading-relaxed">
                Nội dung mang tính tham khảo văn hóa và nghiên cứu. Không thay thế tư vấn y tế, tài
                chính hoặc pháp lý. Hãy tự cân nhắc khi diễn giải kết quả.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
