import Link from "next/link";

import { getContactFacebook, getContactPhone, getSiteUrl } from "@/lib/config";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/da-luu", label: "Lá số đã lưu" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
];

const footerLinkClass = cn(
  "text-[var(--ink-muted)] underline-offset-2 hover:text-[var(--vermillion)] hover:underline transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
);

/** 🏮 Decorative Lantern SVG for header branding */
function LanternIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Lantern string */}
      <line x1="12" y1="0" x2="12" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      {/* Lantern cap */}
      <path d="M7 4 Q12 2 17 4 L16 7 H8 Z" fill="currentColor" opacity="0.8"/>
      {/* Lantern body */}
      <path d="M6 8 Q3 16 6 24 Q12 27 18 24 Q21 16 18 8 Q12 6 6 8Z" fill="currentColor" opacity="0.15"/>
      <path d="M8 8 Q5 16 8 23 Q12 26 16 23 Q19 16 16 8 Q12 6.5 8 8Z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.7"/>
      {/* Horizontal rings */}
      <ellipse cx="12" cy="11" rx="5" ry="1.2" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.6"/>
      <ellipse cx="12" cy="20" rx="5" ry="1.2" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.6"/>
      {/* Lantern base */}
      <path d="M8 24 Q12 27 16 24 L15 27 H9 Z" fill="currentColor" opacity="0.7"/>
      {/* Tassel */}
      <line x1="11" y1="27" x2="10" y2="31" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
      <line x1="12" y1="27" x2="12" y2="32" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
      <line x1="13" y1="27" x2="14" y2="31" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

/** ✦ Decorative compass/star mark */
function CompassMark({ className }: { className?: string }) {
  return (
    <span className={cn("select-none opacity-40", className)} aria-hidden="true">
      ✦
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="print:hidden sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-sm">
      {/* Thin vermillion top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--vermillion)]/60 to-transparent" />

      <div className="mx-auto flex w-full max-w-[100rem] items-center justify-between gap-4 px-3 py-2.5 sm:px-5">
        {/* ── Branding ── */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 group",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
          )}
        >
          <LanternIcon className="h-7 w-auto text-[var(--vermillion)] transition-transform group-hover:scale-110 duration-300" />
          <span className="font-serif text-xl tracking-[0.04em] text-[var(--ink)] group-hover:text-[var(--vermillion)] transition-colors">
            LasoTuVi
          </span>
        </Link>

        {/* ── Navigation ── */}
        <nav aria-label="Chính" className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative inline-flex min-h-10 items-center px-2.5 text-sm text-[var(--ink-muted)]",
                "hover:text-[var(--ink)] transition-colors duration-200",
                "after:absolute after:bottom-1 after:left-2.5 after:right-2.5 after:h-px",
                "after:bg-[var(--vermillion)] after:scale-x-0 after:transition-transform after:duration-200 after:origin-left",
                "hover:after:scale-x-100",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
              )}
            >
              {i > 0 && <CompassMark className="absolute -left-px text-[8px]" />}
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
  const contactPhone = getContactPhone();
  const contactFacebook = getContactFacebook();
  const year = new Date().getFullYear();

  return (
    <footer className="print:hidden mt-auto border-t border-[var(--line)] bg-[var(--paper-muted)]">
      {/* Decorative top border pattern */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

      <div className="mx-auto grid w-full max-w-[100rem] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
        {/* ── Brand column ── */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <LanternIcon className="h-7 w-auto text-[var(--vermillion)] opacity-80" />
            <p className="font-serif text-lg text-[var(--ink)]">LasoTuVi</p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
            Lập và xem lá số Tử Vi Đẩu Số tiếng Việt. Dữ liệu chỉ lưu trên thiết bị khi bạn chọn lưu
            — không cần tài khoản.
          </p>
          <p className="mt-4 text-sm text-[var(--ink-muted)]">
            Trang web:{" "}
            <a href={siteUrl} className={footerLinkClass}>
              {siteUrl.replace(/^https?:\/\//, "")}
            </a>
          </p>
        </div>

        {/* ── Navigation column ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)] mb-4">
            Trang trên website
          </p>
          <ul className="space-y-2.5 text-sm">
            {links.map((link) => (
              <li key={link.href} className="flex items-center gap-2">
                <span className="text-[var(--vermillion)] opacity-50 text-[10px]">◆</span>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact column ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)] mb-4">
            Liên hệ
          </p>
          <ul className="space-y-2.5 text-sm text-[var(--ink-muted)]">
            <li className="flex items-center gap-2">
              <span className="text-[var(--water)] opacity-50 text-[10px]">◆</span>
              <span>
                Điện thoại:{" "}
                <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className={footerLinkClass}>
                  {contactPhone}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--water)] opacity-50 text-[10px]">◆</span>
              <span>
                Facebook:{" "}
                <a
                  href={contactFacebook}
                  className={footerLinkClass}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Bùi Hữu Lý
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-[var(--line-soft)]">
        <div className="mx-auto w-full max-w-[100rem] flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-[var(--ink-faint)] sm:px-5">
          <p>
            © {year} LasoTuVi{" "}
            <span className="mx-1.5 opacity-40">·</span>
            Nội dung mang tính tham khảo văn hóa và nghiên cứu, không thay thế tư vấn y tế, tài chính hoặc pháp lý.
          </p>
          <p className="flex items-center gap-1.5 opacity-70">
            <span>☯</span>
            <span>Tử Vi Đẩu Số</span>
          </p>
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
