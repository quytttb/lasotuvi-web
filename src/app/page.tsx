import Link from "next/link";
import type { Metadata } from "next";

import { FIVE_ELEMENTS } from "@/components/home/five-elements";
import { HeroChartFigure } from "@/components/home/HeroChartFigure";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: {
    absolute: "LasoTuVi — Lập lá số Tử Vi trực tuyến",
  },
  description:
    "LasoTuVi — lập lá số Tử Vi Đẩu Số tiếng Việt theo bố cục truyền thống. Miễn phí, xem nhanh, riêng tư, không cần tài khoản.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "LasoTuVi — Lập lá số Tử Vi trực tuyến",
    description:
      "Lập lá số Tử Vi Đẩu Số tiếng Việt theo bố cục truyền thống. Miễn phí, xem nhanh, riêng tư, không cần tài khoản.",
  },
};

const ELEMENT_BADGE_CLASSES: Record<string, string> = {
  Kim: "bg-[var(--metal-soft)] border-[var(--metal)]/35 text-[var(--metal)] hover:border-[var(--metal)]/70 hover:shadow-[0_2px_8px_rgba(74,85,104,0.25)]",
  Mộc: "bg-[var(--wood-soft)] border-[var(--wood)]/35 text-[var(--wood)] hover:border-[var(--wood)]/70 hover:shadow-[0_2px_8px_rgba(45,106,64,0.25)]",
  Thủy: "bg-[var(--water-soft)] border-[var(--water)]/35 text-[var(--water)] hover:border-[var(--water)]/70 hover:shadow-[0_2px_8px_rgba(27,77,122,0.25)]",
  Hỏa: "bg-[var(--fire-soft)] border-[var(--fire)]/35 text-[var(--fire)] hover:border-[var(--fire)]/70 hover:shadow-[0_2px_8px_rgba(158,43,30,0.25)]",
  Thổ: "bg-[var(--earth-soft)] border-[var(--earth)]/35 text-[var(--earth)] hover:border-[var(--earth)]/70 hover:shadow-[0_2px_8px_rgba(138,100,32,0.25)]",
};

const FEATURES = [
  {
    icon: "福",
    title: "Xem nhanh & Miễn phí",
    body: "Tra cứu lá số bất cứ lúc nào mà không tốn phí. Bố cục sáng rõ, dễ nhìn, người mới tìm hiểu hay người rành Tử Vi đều xem được ngay.",
  },
  {
    icon: "安",
    title: "Kín đáo & Riêng tư",
    body: "Thông tin ngày giờ sinh chỉ dùng để lập lá số lúc bạn tra cứu. Khi bạn chọn lưu, dữ liệu được giữ an toàn trên thiết bị của bạn, hoàn toàn riêng tư.",
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
      <section className="hero-lacquer relative isolate flex min-h-[calc(100svh-123px)] sm:min-h-[calc(100dvh-79px)] flex-col justify-between overflow-hidden border-b border-[var(--lacquer-dark)]">
        {/* Floating subtle ambient gold dust / clouds */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-[18%] left-[8%] h-28 w-28 rounded-full bg-[var(--gold-light)]/8 blur-2xl animate-[floatCloud_8s_ease-in-out_infinite]" />
          <div className="absolute top-[45%] right-[15%] h-36 w-36 rounded-full bg-[var(--gold)]/10 blur-3xl animate-[floatCloud_11s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-[30%] right-[35%] h-24 w-24 rounded-full bg-[var(--vermillion)]/15 blur-xl animate-[floatCloud_9s_ease-in-out_infinite_1s]" />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] border-l border-[var(--gold)]/30 bg-[var(--lacquer-dark)]/25 lg:block"
          aria-hidden="true"
        />
        <div className="site-container relative grid flex-1 items-center gap-12 py-10 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-16">
          <div className="animate-fade-in-up">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--gold-light)]/40 bg-[var(--lacquer-dark)]/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold-light)] shadow-[0_2px_8px_rgba(0,0,0,0.18)] backdrop-blur-xs sm:text-sm">
              <span className="text-base text-[var(--gold-light)]" aria-hidden="true">
                ☯
              </span>
              Tử Vi Đẩu Số · Truyền thống Á Đông
            </p>
            <h1 className="max-w-xl font-serif text-4xl leading-[1.25] tracking-tight text-[var(--paper-raised)] sm:text-5xl">
              Lập lá số Tử Vi theo bố cục{" "}
              <span className="text-[var(--gold-light)]">truyền thống</span>
            </h1>
            <div
              className="mt-6 h-[2px] w-24 bg-gradient-to-r from-[var(--gold-light)] to-transparent"
              aria-hidden="true"
            />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--paper)]/85 sm:text-lg">
              Nhập ngày giờ sinh để xem 12 cung, cách cục và luận giải. Khám phá lá số của bạn với
              bố cục sáng rõ, dễ theo dõi.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
              <Link
                href="/lap-la-so"
                className="lacquer-cta-light group inline-flex min-h-12 items-center justify-center gap-3 rounded-sm px-7 text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)]"
              >
                Lập lá số
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
              <Link
                href="/gioi-thieu"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-[var(--gold-light)]/70 px-6 text-base font-medium text-[var(--paper-raised)] transition-all duration-200 hover:border-[var(--gold-light)] hover:bg-white/10 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)]"
              >
                Tìm hiểu thêm
              </Link>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[var(--paper)]/70">
              Miễn phí · Không cần tài khoản · Lưu trên thiết bị khi bạn chọn
            </p>
          </div>

          <HeroChartFigure />
        </div>
        <div className="relative z-20 mt-auto border-t border-[var(--gold)]/40 bg-[var(--lacquer-dark)] shadow-[0_-4px_20px_rgba(48,15,13,0.35)]">
          <div className="site-container flex flex-wrap items-center justify-between gap-4 py-4 sm:py-5">
            <p className="flex items-center gap-2 text-sm text-[var(--paper)]/85">
              <span className="text-[var(--gold-light)]" aria-hidden="true">
                ☯
              </span>
              Tinh hoa truyền thống, trải nghiệm hiện đại
            </p>
            <div className="flex items-center gap-2.5">
              <span className="hidden text-xs font-medium tracking-wider text-[var(--gold-light)]/90 sm:inline-block">
                NGŨ HÀNH:
              </span>
              <ul
                className="flex flex-wrap items-center gap-1.5 rounded-sm border border-[var(--gold)]/60 bg-gradient-to-r from-[#fdf9f2] via-[#f7ecda] to-[#fdf9f2] p-1.5 shadow-[0_3px_12px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)_inset] ring-1 ring-[var(--gold-light)]/40 sm:gap-2 sm:px-3 sm:py-1.5"
                aria-label="Ngũ hành"
              >
                {FIVE_ELEMENTS.map((el) => {
                  const badgeClass =
                    ELEMENT_BADGE_CLASSES[el.name] ??
                    "bg-[var(--paper-muted)] border-[var(--line)] text-[var(--ink)]";
                  return (
                    <li
                      key={el.name}
                      className={cn(
                        "flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs sm:text-sm font-medium shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-default",
                        badgeClass,
                      )}
                    >
                      <span
                        className="font-serif text-base font-bold sm:text-lg"
                        aria-hidden="true"
                      >
                        {el.symbol}
                      </span>
                      <span>{el.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES — Ba điểm chính
          ═══════════════════════════════════════════════════ */}
      <section className="site-container py-16 sm:py-24">
        {/* Section header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--vermillion)]">
            Đặc điểm nổi bật
          </p>
          <h2 className="heading-decorated mx-auto inline-block font-serif text-2xl text-[var(--ink)] sm:text-3xl">
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
                "hover:shadow-[0_6px_24px_rgba(89,24,22,0.14)] hover:border-[var(--vermillion)]/60",
                "hover:-translate-y-1",
              ].join(" ")}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Corner accent marks (Á Đông) */}
              <span
                className="absolute top-2 left-2 text-[10px] text-[var(--gold)] opacity-40 select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
                aria-hidden="true"
              >
                ⌜
              </span>
              <span
                className="absolute top-2 right-2 text-[10px] text-[var(--gold)] opacity-40 select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
                aria-hidden="true"
              >
                ⌝
              </span>
              <span
                className="absolute bottom-2 left-2 text-[10px] text-[var(--gold)] opacity-40 select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
                aria-hidden="true"
              >
                ⌞
              </span>
              <span
                className="absolute bottom-2 right-2 text-[10px] text-[var(--gold)] opacity-40 select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
                aria-hidden="true"
              >
                ⌟
              </span>

              {/* Background Chinese character */}
              <div
                className="absolute -bottom-4 -right-2 font-serif text-7xl text-[var(--vermillion)] opacity-[0.05] select-none pointer-events-none transition-transform duration-500 group-hover:scale-115 group-hover:opacity-[0.09]"
                aria-hidden="true"
              >
                {item.icon}
              </div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--vermillion)]/60 via-[var(--gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <span
                  className="font-serif text-3xl text-[var(--vermillion)] opacity-35 select-none transition-opacity duration-300 group-hover:opacity-60"
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
      <section className="relative overflow-hidden border-y border-[var(--lacquer-dark)] bg-[var(--lacquer-deep)] text-[var(--paper)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,245,223,0.12),transparent_60%)]" />
        <div
          className="absolute left-6 top-0 bottom-0 w-32 hidden items-center justify-center pointer-events-none sm:flex"
          aria-hidden="true"
        >
          <span className="font-serif text-[6rem] text-[var(--gold-light)] opacity-[0.08] leading-none select-none">
            運
          </span>
        </div>
        <div
          className="absolute right-6 top-0 bottom-0 w-32 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-serif text-[6rem] text-[var(--gold-light)] opacity-[0.12] leading-none select-none">
            命
          </span>
        </div>

        <div className="site-container relative py-14 text-center sm:py-16">
          <p className="font-serif text-2xl text-[var(--paper-raised)] sm:text-3xl">
            Khám phá lá số của bạn
          </p>
          <p className="mt-3 text-[var(--paper)]/80 max-w-md mx-auto text-sm leading-relaxed">
            Nhập ngày tháng năm sinh để xem 12 cung Tử Vi theo bố cục truyền thống Á Đông.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/lap-la-so"
              className={[
                "lacquer-cta-light group",
                "inline-flex min-h-12 items-center justify-center rounded-sm px-8 text-base font-medium",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)]",
              ].join(" ")}
            >
              <span
                className="mr-2 inline-block transition-transform duration-300 ease-out group-hover:scale-x-150 origin-left"
                aria-hidden="true"
              >
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
