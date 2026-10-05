import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { Link } from "@/i18n/navigation";
import { alternates } from "@/lib/site";
import PropertyCard from "@/components/PropertyCard";

// Alle udgivne boliger i byen, nyeste først. Adressen bruger små bogstaver
// (fx /fr/city/casablanca), så byen findes uden at skelne mellem store og små.
// "cache" gør, at titlen og selve siden deler én hentning fra databasen.
const getCityProperties = cache(async (city: string) => {
  // Hent ved hvert besøg, så nye boliger vises med det samme.
  await connection();
  // Tegnene % _ \ har en særlig betydning i søgningen, så de "neutraliseres".
  const name = decodeURIComponent(city).replace(/[%_\\]/g, "\\$&");
  const { data } = await supabase
    .from("properties")
    .select(
      "id, slug, title_fr, title_ar, title_en, listing_type, price, rent_period, city, neighborhood, area_m2, bedrooms, images",
    )
    .eq("status", "published")
    .ilike("city", name)
    .order("created_at", { ascending: false });
  return data ?? [];
});

// Titel og beskrivelse til Google, fx "Immobilier à Casablanca".
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/city/[city]">): Promise<Metadata> {
  const { locale, city } = await params;
  const properties = await getCityProperties(city);
  if (properties.length === 0) return {};

  const t = await getTranslations({ locale, namespace: "City" });
  const name = properties[0].city;
  return {
    title: t("title", { city: name }),
    description: t("description", { city: name, count: properties.length }),
    alternates: alternates(locale, `/city/${city}`),
  };
}

export default async function CityPage({
  params,
}: PageProps<"/[locale]/city/[city]">) {
  const { locale, city } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("City");

  const properties = await getCityProperties(city);
  // Ingen boliger i byen: vis "siden findes ikke".
  if (properties.length === 0) notFound();
  // Byens navn, som det står i databasen (fx "Casablanca").
  const name = properties[0].city;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          {t("title", { city: name })}
        </h1>
        <p className="text-stone-600">
          {t("description", { city: name, count: properties.length })}
        </p>
      </div>

      <Link
        href={{ pathname: "/search", query: { city: name } }}
        className="self-start rounded-lg border border-emerald-700 px-5 py-3 font-semibold text-emerald-800 hover:bg-emerald-50"
      >
        {t("searchLink")}
      </Link>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} locale={locale} />
        ))}
      </div>
    </main>
  );
}
