import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";

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
      "id, title_fr, title_ar, title_en, listing_type, price, rent_period, city, neighborhood, area_m2, bedrooms, images",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
          {t("brand")}
        </p>
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          {t("listTitle")}
        </h1>
      </div>

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
