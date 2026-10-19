import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Về LasoTuVi — tri thức Tử Vi Đẩu Số truyền thống, tôn trọng quyền riêng tư và chiêm nghiệm văn hóa Á Đông.",
  alternates: { canonical: "/gioi-thieu" },
};

export default function GioiThieuPage() {
  return (
    <div className="site-container py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        {/* ── Page header ── */}
        <div className="mb-10 border-b border-[var(--line)] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--vermillion)] mb-2">
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
              <h2 className="font-serif text-xl text-[var(--ink)] mb-3">Nguồn cội & Học thuật</h2>
              <p className="text-[var(--ink-soft)] leading-relaxed">
                Khoa Tử Vi Đẩu Số là tinh hoa văn hóa truyền thống phương Đông, lấy thời khắc sinh
                của mỗi người để đối chiếu can chi ngũ hành, từ đó an định 12 cung số và hệ thống
                các vì sao. Hệ thống được xây dựng bám sát phép tắc kinh điển, giúp bạn dễ dàng lập
                lá số sáng rõ và chuẩn xác.
              </p>
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
              <h2 className="font-serif text-xl text-[var(--ink)] mb-3">Kín đáo & Riêng tư</h2>
              <div className="space-y-4 text-[var(--ink-soft)] leading-relaxed">
                <p>
                  Thông tin ngày giờ sinh của bạn chỉ được dùng cho một mục đích duy nhất: tính toán
                  và hiển thị lá số ngay tại thời điểm bạn tra cứu. Chúng tôi không thu thập hay lưu
                  trữ thông tin cá nhân của bạn.
                </p>
                <p>
                  Khi bạn bấm “Lưu lá số”, bản ghi được cất giữ an toàn ngay trên chính thiết bị bạn
                  đang dùng, không chuyển đi bất kỳ đâu và không ai khác có thể xem được ngoài bạn.
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
              <h2 className="font-serif text-xl text-[var(--ink)] mb-3">Chiêm nghiệm & Lưu ý</h2>
              <ul className="space-y-3 text-[var(--ink-soft)]">
                {[
                  "Nội dung luận giải mang tính chiêm nghiệm văn hóa và tri thức truyền thống giúp thấu hiểu bản thân.",
                  "Đức năng thắng số, nhân định thắng thiên — lá số như một bức tranh tham khảo để bạn định hướng cuộc sống tích cực hơn.",
                  "Lá số lưu trên thiết bị nào thì xem lại trên thiết bị đó để bảo đảm tính kín đáo tuyệt đối.",
                  "Nếu sinh vào tháng nhuận âm lịch, hãy chọn tháng thường gần nhất hoặc dùng ngày dương lịch để an sao chuẩn xác.",
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

        <section id="nguon-minh-hoa" className="mt-10 border-t border-[var(--line-faint)] pt-8">
          <h2 className="font-serif text-xl text-[var(--ink)] mb-3">Nguồn minh họa</h2>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
            Minh họa bàn tay bấm cung được chỉnh sửa từ{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Hand.svg"
              className="underline underline-offset-4"
            >
              Hand.svg
            </a>{" "}
            của LucasVB (Kieff), dựa trên phiên bản trước của Kenny sh, theo giấy phép{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/3.0/"
              className="underline underline-offset-4"
            >
              CC BY-SA 3.0
            </a>
            . LasoTuVi đã lật sang tay trái, thu phóng đồng đều, làm mượt đường bao và thêm nếp tay.
            Bản minh họa chỉnh sửa được phân phối theo cùng giấy phép; xem{" "}
            <a href="/illustrations/left-palm.LICENSE.txt" className="underline underline-offset-4">
              ghi công và chi tiết giấy phép
            </a>
            .
          </p>
        </section>

        {/* ── CTA ── */}
        <div className="mt-12 border-t border-[var(--line-faint)] pt-8 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-[var(--ink-muted)]">Sẵn sàng xem lá số của bạn?</p>
          <Link
            href="/lap-la-so"
            className={[
              "inline-flex items-center gap-2 min-h-11 px-5",
              "rounded-sm text-sm font-medium",
              "bg-[var(--lacquer)] text-[var(--paper-raised)]",
              "hover:bg-[var(--lacquer-deep)] transition-colors",
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
