import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { supabase } from "@/lib/supabase";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

// sitemap.xml: listen over alle offentlige sider, som Google kan læse.
// Hver side står på alle tre sprog, og hver linje fortæller om de andre sprogversioner.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Lav listen ved hvert besøg, så nye boliger kommer med med det samme.
  await connection();
  const { data } = await supabase
    .from("properties")
    .select("slug, city, updated_at")
    .eq("status", "published");
  const properties = data ?? [];

  // Adresser uden sprog, fx "/search" eller "/property/villa-agadir".
  const cities = [...new Set(properties.map((p) => p.city.toLowerCase()))];
  const pages: { path: string; lastModified?: string }[] = [
    { path: "" },
    { path: "/search" },
    ...cities.map((city) => ({ path: `/city/${encodeURIComponent(city)}` })),
    ...properties.map((p) => ({
      path: `/property/${p.slug}`,
      lastModified: p.updated_at,
    })),
  ];

  return pages.flatMap(({ path, lastModified }) => {
    const languages = Object.fromEntries(
      routing.locales.map((lang) => [lang, `${siteUrl}/${lang}${path}`]),
    );
    return routing.locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      lastModified,
      alternates: { languages },
    }));
  });
}
