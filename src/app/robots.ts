import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/lap-la-so", "/gioi-thieu"],
        disallow: ["/da-luu"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
