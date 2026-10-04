import Image from "next/image";
import { getTranslations } from "next-intl/server";

// De felter fra databasen, som boligkortet bruger.
export type PropertyCardData = {
  id: string;
  title_fr: string;
  title_ar: string;
  title_en: string;
  listing_type: "sale" | "rent";
  price: number;
  rent_period: "month" | "day" | null;
  city: string;
  neighborhood: string | null;
  area_m2: number | null;
  bedrooms: number | null;
  images: string[];
};

// Pris som "1 250 000 MAD" (mellemrum mellem tusinder, som i Marokko).
const priceFormat = new Intl.NumberFormat("fr-FR");

export default async function PropertyCard({
  property,
  locale,
}: {
  property: PropertyCardData;
  locale: string;
}) {
  const t = await getTranslations("PropertyCard");

  // Vælg titlen på det sprog, brugeren har valgt.
  const title =
    locale === "ar"
      ? property.title_ar
      : locale === "en"
        ? property.title_en
        : property.title_fr;
  const image = property.images[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-stone-100">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        )}
        <span className="absolute start-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
          {property.listing_type === "sale" ? t("sale") : t("rent")}
        </span>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <p className="text-xl font-bold text-stone-900">
          <bdi>{priceFormat.format(property.price)} MAD</bdi>
          {property.rent_period && (
            <span className="text-sm font-normal text-stone-500">
              {" "}
              {property.rent_period === "month" ? t("perMonth") : t("perDay")}
            </span>
          )}
        </p>
        <h2 className="font-semibold text-stone-800">{title}</h2>
        <p className="text-sm text-stone-500">
          {property.neighborhood
            ? `${property.neighborhood}, ${property.city}`
            : property.city}
        </p>
        <p className="mt-2 flex gap-4 text-sm text-stone-600">
          {property.bedrooms != null && (
            <span>{t("bedrooms", { count: property.bedrooms })}</span>
          )}
          {property.area_m2 != null && (
            <span>
              <bdi>{property.area_m2} m²</bdi>
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
