import { routing } from "@/i18n/routing";

// Sidens fulde adresse. Vercel sætter selv VERCEL_PROJECT_PRODUCTION_URL
// (fx dit-projekt.vercel.app eller dit eget domæne). Lokalt bruges localhost.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

// Fortæller Google, hvilken adresse der er "den rigtige" for siden (canonical),
// og hvor de samme sider ligger på de andre sprog (hreflang).
// "path" er adressen uden sprog, fx "/search" eller "/property/villa-agadir".
export function alternates(locale: string, path = "") {
  const languages: Record<string, string> = { "x-default": `/fr${path}` };
  for (const lang of routing.locales) languages[lang] = `/${lang}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}
