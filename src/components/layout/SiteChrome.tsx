import Link from "next/link";

import { getBackendRepoUrl, getContactEmail, getFrontendRepoUrl, getSiteUrl } from "@/lib/config";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/da-luu", label: "Lá số đã lưu" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
];

const footerLinkClass = cn(
  "text-[var(--ink-soft)] underline-offset-2 hover:text-[var(--ink)] hover:underline",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
);

export function SiteHeader() {
  return (
    <header className="print:hidden border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[100rem] items-center justify-between gap-4 px-2 py-3 sm:px-3">
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]"
        >
          LasoTuVi
        </Link>
        <nav aria-label="Chính" className="flex flex-wrap items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "inline-flex min-h-11 items-center px-2 text-sm text-[var(--ink-soft)]",
                "hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const siteUrl = getSiteUrl();
  const contactEmail = getContactEmail();
  const frontendRepo = getFrontendRepoUrl();
  const backendRepo = getBackendRepoUrl();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto border-t border-[var(--line)] bg-[var(--paper-muted)]">
      <div className="mx-auto grid w-full max-w-[100rem] gap-8 px-2 py-10 sm:grid-cols-2 sm:px-3 lg:grid-cols-3">
        <div>
          <p className="font-serif text-lg text-[var(--ink)]">LasoTuVi</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
            Lập và xem lá số Tử Vi Đẩu Số tiếng Việt. Mã nguồn mở, dữ liệu chỉ lưu trên thiết bị khi
            bạn chọn lưu — không cần tài khoản.
          </p>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            Trang web:{" "}
            <a href={siteUrl} className={footerLinkClass}>
              {siteUrl.replace(/^https?:\/\//, "")}
            </a>
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--ink)]">Trang trên website</p>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--ink)]">Liên hệ</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--ink-muted)]">
            <li>
              Email:{" "}
              <a href={`mailto:${contactEmail}`} className={footerLinkClass}>
                {contactEmail}
              </a>
            </li>
            <li>
              Frontend:{" "}
              <a
                href={frontendRepo}
                className={footerLinkClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub lasotuvi-web
              </a>
            </li>
            {backendRepo ? (
              <li>
                API / backend:{" "}
                <a
                  href={backendRepo}
                  className={footerLinkClass}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub lasotuvi
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line-soft)]">
        <div className="mx-auto w-full max-w-[100rem] space-y-1 px-2 py-5 text-xs text-[var(--ink-muted)] sm:px-3">
          <p>
            © {year} LasoTuVi. Nội dung mang tính tham khảo văn hóa và nghiên cứu, không thay thế tư
            vấn y tế, tài chính hoặc pháp lý.
          </p>
          <p>Dữ liệu lưu trên trình duyệt của bạn — không đồng bộ lên máy chủ ứng dụng.</p>
        </div>
      </div>
    </footer>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="print:hidden sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-[var(--paper)]"
    >
      Chuyển tới nội dung chính
    </a>
  );
}
