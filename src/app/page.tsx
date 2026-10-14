import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "LasoTuVi — lập lá số Tử Vi Đẩu Số tiếng Việt theo bố cục truyền thống. Miễn phí, xem nhanh, riêng tư, không cần tài khoản.",
  alternates: { canonical: "/" },
};

const FIVE_ELEMENTS = [
  { symbol: "木", name: "Mộc", color: "var(--wood)", desc: "Sinh trưởng · Nhân từ" },
  { symbol: "火", name: "Hỏa", color: "var(--fire)", desc: "Sáng soi · Lễ nghĩa" },
  { symbol: "土", name: "Thổ", color: "var(--earth)", desc: "Bền vững · Tín trung" },
  { symbol: "金", name: "Kim", color: "var(--metal)", desc: "Cương trực · Nghĩa khí" },
  { symbol: "水", name: "Thủy", color: "var(--water)", desc: "Uyển chuyển · Trí tuệ" },
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
    body: "Ngày giờ sinh và các lá số đã lưu chỉ nằm gọn trên điện thoại hay máy tính của riêng bạn, an tâm không bị chuyển đi đâu.",
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
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        {/* Layered atmospheric background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(27,77,122,0.08),transparent_50%),radial-gradient(ellipse_at_85%_10%,rgba(158,43,30,0.07),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(138,100,32,0.06),transparent_55%)]" />

        {/* Decorative background Chinese characters */}
        <div
          className="absolute right-8 top-6 font-serif text-[8rem] leading-none text-[var(--ink)] opacity-[0.025] select-none pointer-events-none"
          aria-hidden="true"
        >
          紫
        </div>
        <div
          className="absolute left-4 bottom-4 font-serif text-[6rem] leading-none text-[var(--ink)] opacity-[0.03] select-none pointer-events-none"
          aria-hidden="true"
        >
          斗
        </div>

        {/* Thin top border accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-32">
          {/* Subtitle badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-[var(--earth)]/30 bg-[var(--earth-soft)]/60 px-3 py-1.5">
            <span className="text-[var(--earth)] text-xs" aria-hidden="true">
              ☯
            </span>
            <span className="text-xs font-medium tracking-[0.08em] text-[var(--earth)]">
              Tử Vi Đẩu Số · Truyền thống Á Đông
            </span>
          </div>

          {/* Main title */}
          <div className="relative">
            <p className="font-serif text-5xl tracking-[0.06em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
              LasoTuVi
            </p>
            {/* Gold underline brush stroke */}
            <div className="mt-2 h-[2px] w-24 bg-gradient-to-r from-[var(--vermillion)] via-[var(--gold)] to-transparent rounded-full" />
          </div>

          <h1 className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed text-[var(--ink-soft)] sm:text-3xl lg:text-4xl">
            Lập lá số Tử Vi theo bố cục
            <br className="hidden sm:block" />{" "}
            <span className="text-[var(--vermillion)]">truyền thống</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
            Nhập ngày giờ sinh, xem 12 cung, cách cục và luận giải — dữ liệu chỉ lưu trên thiết bị
            khi bạn chọn lưu.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/lap-la-so"
              className={[
                "btn-primary-oriental",
                "inline-flex min-h-12 items-center justify-center rounded-sm px-7 text-base font-medium",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
              ].join(" ")}
            >
              <span className="mr-2 opacity-70" aria-hidden="true">
                ☰
              </span>
              Lập lá số
            </Link>
            <Link
              href="/gioi-thieu"
              className={[
                "inline-flex min-h-12 items-center justify-center rounded-sm",
                "border border-[var(--line)] bg-[var(--paper-raised)]/80 px-7 text-base font-medium text-[var(--ink)]",
                "hover:bg-[var(--paper-muted)] hover:border-[var(--earth)]/50 transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
              ].join(" ")}
            >
              Tìm hiểu thêm
            </Link>
          </div>

          {/* ── Five Elements row ── */}
          <div className="mt-14 flex flex-wrap gap-3 sm:gap-4">
            {FIVE_ELEMENTS.map((el) => (
              <div
                key={el.symbol}
                className="flex items-center gap-2 rounded-sm border border-[var(--line-faint)] bg-[var(--paper-raised)]/70 px-3 py-2 backdrop-blur-sm"
              >
                <span
                  className="font-serif text-xl font-semibold leading-none"
                  style={{ color: el.color }}
                  aria-hidden="true"
                >
                  {el.symbol}
                </span>
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold text-[var(--ink)]"
                    style={{ color: el.color }}
                  >
                    {el.name}
                  </p>
                  <p className="text-[10px] text-[var(--ink-faint)]">{el.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES — Ba điểm chính
          ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--earth)] mb-2">
            Đặc điểm nổi bật
          </p>
          <h2 className="font-serif text-2xl text-[var(--ink)] sm:text-3xl heading-decorated mx-auto inline-block">
            Ba điểm chính
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((item, i) => (
            <li
              key={item.title}
              className={[
                "group relative overflow-hidden rounded-sm",
                "border border-[var(--line)] bg-[var(--paper-raised)]",
                "p-6 transition-all duration-300",
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

        <div className="relative mx-auto max-w-6xl px-5 py-14 text-center">
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
        <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-[var(--ink-muted)]">
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
