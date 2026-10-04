import { getTranslations } from "next-intl/server";
import { propertyTypes } from "@/components/SearchFilters";

// Den store søgebar på forsiden: by, salg/leje og boligtype.
// "Søg" sender til søgesiden med de samme valg i adressen,
// fx /fr/search?city=Rabat&listing=rent&type=apartment
export default async function HomeSearch({
  locale,
  cities,
}: {
  locale: string;
  cities: string[];
}) {
  const t = await getTranslations("Search");
  const fieldClass =
    "w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-3 text-stone-900";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-stone-700";

  return (
    <form
      method="get"
      action={`/${locale}/search`}
      className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-lg sm:grid-cols-4 sm:items-end"
    >
      <label className={labelClass}>
        {t("city")}
        <select name="city" defaultValue="" className={fieldClass}>
          <option value="">{t("allCities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        {t("listing")}
        <select name="listing" defaultValue="" className={fieldClass}>
          <option value="">{t("all")}</option>
          <option value="sale">{t("sale")}</option>
          <option value="rent">{t("rent")}</option>
        </select>
      </label>

      <label className={labelClass}>
        {t("type")}
        <select name="type" defaultValue="" className={fieldClass}>
          <option value="">{t("all")}</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {t(`types.${type}`)}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
      >
        {t("submit")}
      </button>
    </form>
  );
}
