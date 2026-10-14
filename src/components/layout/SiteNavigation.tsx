"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/lap-la-so", label: "Lập lá số" },
  { href: "/da-luu", label: "Lá số đã lưu" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Chính"
      className="grid w-full grid-cols-4 gap-1 sm:flex sm:w-auto sm:items-center sm:gap-2"
    >
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-sm px-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
              active
                ? "bg-[var(--paper-raised)] text-[var(--lacquer-deep)] shadow-[inset_0_-2px_0_var(--gold)]"
                : "text-[var(--paper)]/80 hover:bg-white/10 hover:text-[var(--paper-raised)]",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
