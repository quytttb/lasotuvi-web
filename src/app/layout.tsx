import type { Metadata } from "next";
import { Be_Vietnam_Pro, Source_Serif_4 } from "next/font/google";

import { SiteFooter, SiteHeader, SkipLink } from "@/components/layout/SiteChrome";
import { getSiteUrl } from "@/lib/config";

import "./globals.css";

const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
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
    "Ứng dụng web tiếng Việt lập lá số Tử Vi Đẩu Số qua LasoTuVi API. Mã nguồn mở, dữ liệu lưu trên thiết bị, không cần tài khoản.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "LasoTuVi",
    title: "LasoTuVi — Lập lá số Tử Vi trực tuyến",
    description:
      "Lập và xem lá số 12 cung. Dữ liệu chỉ lưu trên trình duyệt khi bạn chọn lưu.",
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
