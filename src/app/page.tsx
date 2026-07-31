import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "LasoTuVi — lập lá số Tử Vi Đẩu Số tiếng Việt. Mã nguồn mở, lưu trên thiết bị, không cần tài khoản.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(30,77,107,0.12),transparent_50%),radial-gradient(ellipse_at_90%_20%,rgba(143,106,47,0.14),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="font-serif text-5xl tracking-wide text-[var(--ink)] sm:text-6xl">LasoTuVi</p>
          <h1 className="mt-6 max-w-2xl font-serif text-3xl leading-snug text-[var(--ink-soft)] sm:text-4xl">
            Lập lá số Tử Vi theo bố cục truyền thống
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--ink-muted)] sm:text-lg">
            Nhập ngày giờ sinh, xem 12 cung, cách cục và luận giải — dữ liệu chỉ lưu trên thiết bị
            khi bạn chọn lưu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lap-la-so"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[var(--ink)] px-6 text-base font-medium text-[var(--paper)] hover:bg-[var(--ink-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]"
            >
              Lập lá số
            </Link>
            <Link
              href="/gioi-thieu"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] px-6 text-base font-medium text-[var(--ink)] hover:bg-[var(--paper-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-2xl text-[var(--ink)]">Ba điểm chính</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Mã nguồn mở",
              body: "Bộ máy và API LasoTuVi công khai; frontend cũng mở để kiểm chứng và đóng góp.",
            },
            {
              title: "Dữ liệu trên thiết bị",
              body: "Lá số đã lưu nằm trong IndexedDB trình duyệt của bạn — không đồng bộ lên máy chủ frontend.",
            },
            {
              title: "Không cần tài khoản",
              body: "Không đăng nhập, không cookie phiên. Chỉ gửi thông tin sinh tới API công khai để tính lá số.",
            },
          ].map((item) => (
            <li key={item.title} className="border-t border-[var(--line)] pt-4">
              <h3 className="font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--paper-muted)]/60">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[var(--ink-muted)]">
          <h2 className="font-serif text-lg text-[var(--ink)]">Miễn trừ trách nhiệm</h2>
          <p className="mt-2 max-w-3xl leading-relaxed">
            Nội dung mang tính tham khảo văn hóa và nghiên cứu. Không thay thế tư vấn y tế, tài chính
            hoặc pháp lý. Hãy tự cân nhắc khi diễn giải kết quả.
          </p>
        </div>
      </section>
    </div>
  );
}
