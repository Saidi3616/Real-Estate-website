import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters, {
  propertyTypes,
  sortOptions,
  type Filters,
} from "@/components/SearchFilters";

// Læs én værdi fra adressen. Kun værdier fra listen "allowed" godtages.
function pick(value: string | string[] | undefined, allowed?: string[]) {
  const text = typeof value === "string" ? value : "";
  if (allowed && !allowed.includes(text)) return "";
  return text;
}

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Search");
  const tHome = await getTranslations("Home");

  // Filtrene fra adressen, fx /fr/search?city=Marrakech&type=villa
  const query = await searchParams;
  const filters: Filters = {
    listing: pick(query.listing, ["sale", "rent"]),
    city: pick(query.city),
    type: pick(query.type, propertyTypes),
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
      "id, slug, title_fr, title_ar, title_en, listing_type, price, rent_period, city, neighborhood, area_m2, bedrooms, images",
    )
    .eq("status", "published");
  if (filters.listing) search = search.eq("listing_type", filters.listing);
  if (filters.city) search = search.eq("city", filters.city);
  if (filters.type) search = search.eq("property_type", filters.type);
  search =
    filters.sort === "newest"
      ? search.order("created_at", { ascending: false })
      : search.order("price", { ascending: filters.sort === "price_asc" });

  const { data: properties, error } = await search;

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
