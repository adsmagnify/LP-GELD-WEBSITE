import type { MetadataRoute } from "next";

import { SITE_URL } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const paths = [
    "",
    "/about",
    "/webinar",
    "/learn",
    "/speakers",
    "/contact",
    "/performance",
    "/faq",
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
