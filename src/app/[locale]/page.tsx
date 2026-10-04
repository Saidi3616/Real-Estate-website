import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";
import HomeSearch from "@/components/HomeSearch";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  // Hent boligerne ved hvert besøg, så nye boliger vises med det samme.
  await connection();
  // Kun offentliggjorte boliger, nyeste først.
  const { data: properties, error } = await supabase
    .from("properties")
    .select(
      "id, slug, title_fr, title_ar, title_en, listing_type, price, rent_period, city, neighborhood, area_m2, bedrooms, images",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Alle byer med udgivne boliger, til "By"-listen i søgebaren (hver by kun én gang).
  const cities = [...new Set((properties ?? []).map((row) => row.city))].sort();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      {/* Stor søgebar øverst ("hero") */}
      <section className="flex flex-col gap-4 rounded-3xl bg-emerald-800 px-4 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
          {t("brand")}
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="text-emerald-100 sm:text-lg">{t("heroSubtitle")}</p>
        <HomeSearch locale={locale} cities={cities} />
      </section>

      <h2 className="text-2xl font-bold text-stone-900">{t("listTitle")}</h2>

      {error ? (
        <p className="text-red-700">{t("dbError")}</p>
      ) : properties.length === 0 ? (
        <p className="text-stone-600">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
