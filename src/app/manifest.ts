import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LasoTuVi — Lập lá số Tử Vi trực tuyến",
    short_name: "LasoTuVi",
    description:
      "Ứng dụng lập lá số Tử Vi Đẩu Số tiếng Việt theo bố cục truyền thống Á Đông. Kín đáo, riêng tư, không cần tài khoản.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ed",
    theme_color: "#75201d",
    icons: [
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
