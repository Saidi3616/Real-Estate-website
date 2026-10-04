import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";
import HomeSearch from "@/components/HomeSearch";
import { Link } from "@/i18n/navigation";
import { alternates } from "@/lib/site";

// Forsidens sprogversioner til Google.
export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  return { alternates: alternates(locale) };
}

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
      "id, slug, title_fr, title_ar, title_en, listing_type, price, rent_period, city, neighborhood, area_m2, bedrooms, images, is_featured",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Alle byer med udgivne boliger, til "By"-listen i søgebaren (hver by kun én gang).
  const cities = [...new Set((properties ?? []).map((row) => row.city))].sort();

  // Udvalgte boliger (is_featured). Er der ingen, vises de 6 nyeste i stedet.
  const featured = (properties ?? []).filter((row) => row.is_featured);
  const shown = featured.length > 0 ? featured : (properties ?? []).slice(0, 6);

  // Populære byer: antal boliger pr. by, flest først.
  // ponytail: tæller i koden ud fra alle boliger; flyt til databasen, hvis der kommer tusindvis.
  const cityCounts = new Map<string, number>();
  for (const row of properties ?? []) {
    cityCounts.set(row.city, (cityCounts.get(row.city) ?? 0) + 1);
  }
  const popularCities = [...cityCounts].sort((a, b) => b[1] - a[1]).slice(0, 6);

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

      {error ? (
        <p className="text-red-700">{t("dbError")}</p>
      ) : shown.length === 0 ? (
        <p className="text-stone-600">{t("empty")}</p>
      ) : (
        <>
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-stone-900">{t("featuredTitle")}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((property) => (
                <PropertyCard key={property.id} property={property} locale={locale} />
              ))}
            </div>
            <Link
              href="/search"
              className="self-center rounded-lg border border-emerald-700 px-5 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              {t("seeAll")}
            </Link>
          </section>

          {/* Populære byer: hvert felt åbner søgesiden for den by */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-stone-900">{t("citiesTitle")}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {popularCities.map(([city, count]) => (
                <Link
                  key={city}
                  href={{ pathname: "/search", query: { city } }}
                  className="flex flex-col gap-1 rounded-2xl bg-emerald-50 p-4 hover:bg-emerald-100"
                >
                  <span className="text-lg font-bold text-emerald-900">{city}</span>
                  <span className="text-sm text-emerald-800">
                    {t("cityCount", { count })}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
