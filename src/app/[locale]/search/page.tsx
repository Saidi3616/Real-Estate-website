import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { alternates } from "@/lib/site";
import PropertyCard, { priceFormat } from "@/components/PropertyCard";
import SearchMap, { type MapPoint } from "@/components/SearchMap";
import SearchFilters, {
  bedroomOptions,
  propertyTypes,
  sortOptions,
  type Filters,
} from "@/components/SearchFilters";

// Læs én værdi fra adressen. Kun værdier fra listen "allowed" godtages.
function pick(value: string | string[] | undefined, allowed?: string[]) {
  const text = typeof value === "string" ? value.trim() : "";
  if (allowed && !allowed.includes(text)) return "";
  return text;
}

// Læs et tal fra adressen. Kun hele tal på 0 eller mere godtages.
function pickNumber(value: string | string[] | undefined) {
  const text = pick(value);
  return /^\d+$/.test(text) ? text : "";
}

// Søgesidens titel. Filtrene tæller ikke med, så Google ser kun én søgeside pr. sprog.
export async function generateMetadata({ params }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Search" });
  return { title: t("title"), alternates: alternates(locale, "/search") };
}

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Search");
  const tHome = await getTranslations("Home");
  const tCard = await getTranslations("PropertyCard");

  // Filtrene fra adressen, fx /fr/search?city=Marrakech&minPrice=500000
  const query = await searchParams;
  const filters: Filters = {
    listing: pick(query.listing, ["sale", "rent"]),
    city: pick(query.city),
    neighborhood: pick(query.neighborhood).slice(0, 50),
    type: pick(query.type, propertyTypes),
    minPrice: pickNumber(query.minPrice),
    maxPrice: pickNumber(query.maxPrice),
    bedrooms: pick(query.bedrooms, bedroomOptions),
    minArea: pickNumber(query.minArea),
    maxArea: pickNumber(query.maxArea),
    sort: pick(query.sort, sortOptions) || "newest",
  };

  // Hent boligerne ved hvert besøg, så nye boliger vises med det samme.
  await connection();

  // Alle byer med udgivne boliger, til "By"-listen (hver by kun én gang).
  const { data: cityRows } = await supabase
    .from("properties")
    .select("city")
    .eq("status", "published");
  const cities = [...new Set((cityRows ?? []).map((row) => row.city))].sort();

  // Byg søgningen: kun udgivne boliger, plus de filtre der er valgt.
  let search = supabase
    .from("properties")
    .select(
      "id, slug, title_fr, title_ar, title_en, listing_type, price, rent_period, city, neighborhood, area_m2, bedrooms, images, latitude, longitude",
    )
    .eq("status", "published");
  if (filters.listing) search = search.eq("listing_type", filters.listing);
  if (filters.city) search = search.eq("city", filters.city);
  if (filters.neighborhood) {
    // Kvarteret skal indeholde teksten (store/små bogstaver er ligegyldige).
    // Tegnene % _ \ har en særlig betydning i søgningen, så de "neutraliseres".
    const text = filters.neighborhood.replace(/[%_\\]/g, "\\$&");
    search = search.ilike("neighborhood", `%${text}%`);
  }
  if (filters.type) search = search.eq("property_type", filters.type);
  if (filters.minPrice) search = search.gte("price", Number(filters.minPrice));
  if (filters.maxPrice) search = search.lte("price", Number(filters.maxPrice));
  if (filters.bedrooms) search = search.gte("bedrooms", Number(filters.bedrooms));
  if (filters.minArea) search = search.gte("area_m2", Number(filters.minArea));
  if (filters.maxArea) search = search.lte("area_m2", Number(filters.maxArea));
  search =
    filters.sort === "newest"
      ? search.order("created_at", { ascending: false })
      : search.order("price", { ascending: filters.sort === "price_asc" });

  const { data: properties, error } = await search;

  // Prikker til kortet: kun boliger med placering, rundet af til ca. 1 km (privatliv).
  const lang = locale === "ar" || locale === "en" ? locale : "fr";
  const round = (n: number) => Math.round(n * 100) / 100;
  const points: MapPoint[] = (properties ?? [])
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({
      href: `/${locale}/property/${p.slug}`,
      latitude: round(p.latitude),
      longitude: round(p.longitude),
      title: p[`title_${lang}`],
      price:
        `${priceFormat.format(p.price)} MAD` +
        (p.rent_period === "month"
          ? ` ${tCard("perMonth")}`
          : p.rent_period === "day"
            ? ` ${tCard("perDay")}`
            : ""),
    }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
        {t("title")}
      </h1>

      <SearchFilters filters={filters} cities={cities} />

      {error ? (
        <p className="text-red-700">{tHome("dbError")}</p>
      ) : properties.length === 0 ? (
        <p className="text-stone-600">{t("noResults")}</p>
      ) : (
        <>
          <p className="font-semibold text-stone-700">
            {t("count", { count: properties.length })}
          </p>
          {points.length > 0 && <SearchMap points={points} label={t("map")} />}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} locale={locale} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
