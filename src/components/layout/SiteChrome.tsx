import Link from "next/link";

import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/da-luu", label: "Lá số đã lưu" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
];

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
  return (
    <footer className="print:hidden mt-auto border-t border-[var(--line)] bg-[var(--paper-muted)]">
      <div className="mx-auto w-full max-w-[100rem] px-2 py-8 text-sm text-[var(--ink-muted)] sm:px-3">
        <p>
          Nội dung mang tính tham khảo văn hóa và nghiên cứu, không thay thế tư vấn y tế, tài chính
          hoặc pháp lý.
        </p>
        <p className="mt-2">Dữ liệu lưu trên thiết bị của bạn — không cần tài khoản.</p>
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
