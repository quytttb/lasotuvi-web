import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  return [
    { url: `${site}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site}/lap-la-so`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site}/gioi-thieu`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
