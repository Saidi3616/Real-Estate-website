import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  // Hent tallet ved hvert besøg, så nye boliger vises med det samme.
  await connection();
  // Midlertidig test af databasen (Modul 2). Erstattes af boliglisten senere.
  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
        {t("brand")}
      </p>
      <h1 className="text-4xl font-bold text-stone-900 sm:text-6xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-lg text-stone-600">{t("subtitle")}</p>
      <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
        {error ? t("dbError") : t("dbCount", { count: count ?? 0 })}
      </p>
    </main>
  );
}
