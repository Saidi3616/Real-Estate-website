import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// De boligtyper, man kan vælge (de samme som i databasen).
export const propertyTypes = [
  "apartment",
  "villa",
  "riad",
  "house",
  "land",
  "commercial",
];

// Sorteringsmuligheder. "newest" er standard.
export const sortOptions = ["newest", "price_asc", "price_desc"];

// Valg for "mindst X værelser".
export const bedroomOptions = ["1", "2", "3", "4"];

// De filtre, brugeren har valgt lige nu (tom tekst = ikke valgt).
export type Filters = {
  listing: string;
  city: string;
  neighborhood: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  minArea: string;
  maxArea: string;
  sort: string;
};

export default async function SearchFilters({
  filters,
  cities,
}: {
  filters: Filters;
  cities: string[];
}) {
  const t = await getTranslations("Search");
  const fieldClass =
    "w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-stone-700";

  return (
    // En almindelig formular: "Søg" lægger valgene i adressen (?city=...).
    // key gør, at felterne nulstilles, når filtrene ændres.
    <form
      key={JSON.stringify(filters)}
      method="get"
      className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <label className={labelClass}>
        {t("listing")}
        <select name="listing" defaultValue={filters.listing} className={fieldClass}>
          <option value="">{t("all")}</option>
          <option value="sale">{t("sale")}</option>
          <option value="rent">{t("rent")}</option>
        </select>
      </label>

      <label className={labelClass}>
        {t("city")}
        <select name="city" defaultValue={filters.city} className={fieldClass}>
          <option value="">{t("allCities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        {t("neighborhood")}
        <input
          type="text"
          name="neighborhood"
          defaultValue={filters.neighborhood}
          placeholder={t("neighborhoodPlaceholder")}
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        {t("type")}
        <select name="type" defaultValue={filters.type} className={fieldClass}>
          <option value="">{t("all")}</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {t(`types.${type}`)}
            </option>
          ))}
        </select>
      </label>

      {/* Pris min–maks i MAD. inputMode giver taltastatur på mobil. */}
      <fieldset className={labelClass}>
        <legend className="mb-1">{t("price")}</legend>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            min="0"
            inputMode="numeric"
            defaultValue={filters.minPrice}
            placeholder={t("min")}
            aria-label={`${t("price")} ${t("min")}`}
            className={fieldClass}
          />
          <input
            type="number"
            name="maxPrice"
            min="0"
            inputMode="numeric"
            defaultValue={filters.maxPrice}
            placeholder={t("max")}
            aria-label={`${t("price")} ${t("max")}`}
            className={fieldClass}
          />
        </div>
      </fieldset>

      <label className={labelClass}>
        {t("bedrooms")}
        <select name="bedrooms" defaultValue={filters.bedrooms} className={fieldClass}>
          <option value="">{t("all")}</option>
          {bedroomOptions.map((count) => (
            <option key={count} value={count}>
              {count}+
            </option>
          ))}
        </select>
      </label>

      {/* Areal min–maks i m². */}
      <fieldset className={labelClass}>
        <legend className="mb-1">{t("area")}</legend>
        <div className="flex gap-2">
          <input
            type="number"
            name="minArea"
            min="0"
            inputMode="numeric"
            defaultValue={filters.minArea}
            placeholder={t("min")}
            aria-label={`${t("area")} ${t("min")}`}
            className={fieldClass}
          />
          <input
            type="number"
            name="maxArea"
            min="0"
            inputMode="numeric"
            defaultValue={filters.maxArea}
            placeholder={t("max")}
            aria-label={`${t("area")} ${t("max")}`}
            className={fieldClass}
          />
        </div>
      </fieldset>

      <label className={labelClass}>
        {t("sort")}
        <select name="sort" defaultValue={filters.sort} className={fieldClass}>
          {sortOptions.map((sort) => (
            <option key={sort} value={sort}>
              {t(`sorts.${sort}`)}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
        >
          {t("submit")}
        </button>
        <Link
          href="/search"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-semibold text-stone-700 hover:bg-stone-100"
        >
          {t("reset")}
        </Link>
      </div>
    </form>
  );
}
