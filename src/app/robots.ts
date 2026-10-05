import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// robots.txt: Google må læse hele siden undtagen admin, og får adressen på sitemap'en.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/admin" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
