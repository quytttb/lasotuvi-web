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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl text-[var(--ink)]">Giới thiệu</h1>

      <section className="mt-8 space-y-3">
        <h2 className="font-serif text-xl">Nguồn dữ liệu</h2>
        <p className="text-[var(--ink-soft)] leading-relaxed">
          Ứng dụng gọi trực tiếp LasoTuVi API ({apiUrl}) để lập lá số. Không có proxy hay Server
          Actions trung gian. Endpoint chính của MVP:{" "}
          <code className="text-sm">POST /chart/generate</code>.
        </p>
        {backendRepo ? (
          <p>
            Mã nguồn backend:{" "}
            <a
              href={backendRepo}
              className="underline underline-offset-2 hover:text-[var(--water)]"
              rel="noopener noreferrer"
              target="_blank"
            >
              {backendRepo}
            </a>
          </p>
        ) : null}
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-serif text-xl">Quyền riêng tư</h2>
        <p className="text-[var(--ink-soft)] leading-relaxed">
          Khi bạn lập lá số, thông tin ngày giờ sinh được gửi tới API công khai để tính toán.
          Frontend không lưu dữ liệu người dùng trên server riêng. Chỉ khi bạn nhấn “Lưu lá số”, bản
          ghi mới được ghi vào IndexedDB trên trình duyệt hiện tại.
        </p>
        <p className="text-[var(--ink-soft)] leading-relaxed">
          Không analytics trong MVP. Không đưa dữ liệu sinh vào URL hay nhật ký phía client ở chế độ
          production.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-serif text-xl">Giới hạn</h2>
        <ul className="list-disc space-y-2 pl-5 text-[var(--ink-soft)]">
          <li>Máy chủ Render Free có thể cold start — vui lòng chờ nếu phản hồi chậm.</li>
          <li>Nhập tháng nhuận âm lịch trực tiếp chưa được hỗ trợ đầy đủ.</li>
          <li>Nội dung luận giải mang tính tham khảo văn hóa/nghiên cứu.</li>
          <li>Không đồng bộ đa thiết bị, không chia sẻ public bằng URL.</li>
        </ul>
      </section>

      <p className="mt-10">
        <Link href="/lap-la-so" className="underline underline-offset-2">
          Bắt đầu lập lá số →
        </Link>
      </p>
    </div>
  );
}
