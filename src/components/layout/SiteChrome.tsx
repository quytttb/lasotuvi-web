import Link from "next/link";

import { getContactFacebook, getContactPhone, getSiteUrl } from "@/lib/config";
import { cn } from "@/lib/utils/cn";
import { SiteNavigation } from "@/components/layout/SiteNavigation";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/da-luu", label: "Lá số đã lưu" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
];

const footerLinkClass = cn(
  "text-[var(--paper)]/80 underline-offset-2 hover:text-[var(--gold-light)] hover:underline transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)]",
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
      <line
        x1="12"
        y1="0"
        x2="12"
        y2="4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Lantern cap */}
      <path d="M7 4 Q12 2 17 4 L16 7 H8 Z" fill="currentColor" opacity="0.8" />
      {/* Lantern body */}
      <path
        d="M6 8 Q3 16 6 24 Q12 27 18 24 Q21 16 18 8 Q12 6 6 8Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M8 8 Q5 16 8 23 Q12 26 16 23 Q19 16 16 8 Q12 6.5 8 8Z"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
      />
      {/* Horizontal rings */}
      <ellipse
        cx="12"
        cy="11"
        rx="5"
        ry="1.2"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
        opacity="0.6"
      />
      <ellipse
        cx="12"
        cy="20"
        rx="5"
        ry="1.2"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
        opacity="0.6"
      />
      {/* Lantern base */}
      <path d="M8 24 Q12 27 16 24 L15 27 H9 Z" fill="currentColor" opacity="0.7" />
      {/* Tassel */}
      <line
        x1="11"
        y1="27"
        x2="10"
        y2="31"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="12"
        y1="27"
        x2="12"
        y2="32"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="13"
        y1="27"
        x2="14"
        y2="31"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="print:hidden sticky top-0 z-40 border-b border-[var(--lacquer-dark)] bg-[var(--lacquer-deep)]/95 text-[var(--paper)] backdrop-blur-sm">
      {/* Thin antique-gold top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--gold-light)] to-transparent" />

      <div className="site-container flex flex-col items-start justify-between gap-2 py-3 sm:flex-row sm:items-center sm:gap-4 sm:py-4">
        {/* ── Branding ── */}
        <Link
          href="/"
          className={cn(
            "flex min-h-11 shrink-0 items-center gap-2.5 group",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)]",
          )}
        >
          <LanternIcon className="h-7 w-auto text-[var(--gold-light)] transition-transform group-hover:scale-110 duration-300" />
          <span className="font-serif text-xl tracking-[0.04em] text-[var(--paper-raised)] group-hover:text-[var(--gold-light)] transition-colors">
            LasoTuVi
          </span>
        </Link>

        {/* ── Navigation ── */}
        <SiteNavigation />
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
    <footer className="print:hidden mt-auto border-t border-[var(--lacquer-dark)] bg-[var(--lacquer-dark)] text-[var(--paper)]">
      {/* Decorative top border pattern */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold-light)]/70 to-transparent" />

      <div className="site-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 lg:py-16">
        {/* ── Brand column ── */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <LanternIcon className="h-7 w-auto text-[var(--gold-light)]" />
            <p className="font-serif text-lg text-[var(--paper-raised)]">LasoTuVi</p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--paper)]/75">
            Lập và xem lá số Tử Vi Đẩu Số tiếng Việt. Dữ liệu chỉ lưu trên thiết bị khi bạn chọn lưu
            — không cần tài khoản.
          </p>
          <p className="mt-4 text-sm text-[var(--paper)]/75">
            Trang web:{" "}
            <a href={siteUrl} className={footerLinkClass} target="_blank" rel="noopener noreferrer">
              {siteUrl.replace(/^https?:\/\//, "")}
            </a>
          </p>
        </div>

        {/* ── Navigation column ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold-light)] mb-4">
            Trang trên website
          </p>
          <ul className="space-y-2.5 text-sm">
            {links.map((link) => (
              <li key={link.href} className="flex items-center gap-2">
                <span className="text-[var(--gold-light)] opacity-80 text-[10px]">◆</span>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact column ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gold-light)] mb-4">
            Liên hệ
          </p>
          <ul className="space-y-2.5 text-sm text-[var(--paper)]/75">
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold-light)] opacity-80 text-[10px]">◆</span>
              <span>
                Điện thoại:{" "}
                <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className={footerLinkClass}>
                  {contactPhone}
                </a>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--gold-light)] opacity-80 text-[10px]">◆</span>
              <span>
                Facebook:{" "}
                <a
                  href={contactFacebook}
                  className={footerLinkClass}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Bùi Hữu Ly
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-[var(--gold)]/25">
        <div className="site-container flex flex-wrap items-center justify-between gap-3 py-5 text-xs leading-relaxed text-[var(--paper)]/65">
          <p>
            © {year} LasoTuVi <span className="mx-1.5 opacity-40">·</span>
            Nội dung chỉ mang tính tham khảo về văn hóa và nghiên cứu, không thay thế tư vấn y tế,
            tài chính hoặc pháp lý.
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
