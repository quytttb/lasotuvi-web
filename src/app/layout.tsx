import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";

import { SiteFooter, SiteHeader, SkipLink } from "@/components/layout/SiteChrome";
import { getSiteUrl } from "@/lib/config";

import "./globals.css";

/**
 * Sans-serif: Be Vietnam Pro — excellent Vietnamese glyph support,
 * modern yet warm enough for traditional content.
 */
const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * Serif: Noto Serif — covers Vietnamese, Chinese (CJK) characters beautifully.
 * Perfect for the Tử Vi aesthetic as it renders 紫微斗數 chars elegantly.
 */
const serif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LasoTuVi — Lập lá số Tử Vi trực tuyến",
    template: "%s · LasoTuVi",
  },
  description:
    "Ứng dụng web tiếng Việt lập lá số Tử Vi Đẩu Số theo bố cục truyền thống. Dễ dùng, kín đáo, lưu trên thiết bị, không cần đăng ký tài khoản.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "LasoTuVi",
    title: "LasoTuVi — Lập lá số Tử Vi trực tuyến",
    description:
      "Lập và xem lá số 12 cung theo bố cục truyền thống. Riêng tư, bảo mật, lưu an toàn trên thiết bị.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SkipLink />
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
