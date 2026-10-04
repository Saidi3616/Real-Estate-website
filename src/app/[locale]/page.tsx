import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Home");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
        {t("brand")}
      </p>
      <h1 className="text-4xl font-bold text-stone-900 sm:text-6xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-lg text-stone-600">{t("subtitle")}</p>
    </main>
  );
}
