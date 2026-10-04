import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { alternates } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { priceFormat } from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import ContactForm from "@/components/ContactForm";

// Faciliteter, vi har tekster til. Ukendte faciliteter springes over.
const knownFeatures = [
  "pool",
  "parking",
  "elevator",
  "terrace",
  "balcony",
  "garden",
  "furnished",
  "sea_view",
];

// Find den udgivne bolig med denne slug, og mægleren bag den.
// "cache" gør, at titlen og selve siden deler én hentning fra databasen.
const getProperty = cache(async (slug: string) => {
  // Hent boligen ved hvert besøg, så ændringer vises med det samme.
  await connection();
  const { data } = await supabase
    .from("properties")
    .select("*, agent:agents(name, company, phone, whatsapp)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
});

// Titel, beskrivelse og billede, som Google og WhatsApp/Facebook viser.
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/property/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const property = await getProperty(slug);
  if (!property) return {};

  const lang = locale === "ar" || locale === "en" ? locale : "fr";
  const title: string = property[`title_${lang}`];
  const place = property.neighborhood
    ? `${property.neighborhood}, ${property.city}`
    : property.city;
  // Pris og sted først, derefter starten af beskrivelsen. Google viser ca. 160 tegn.
  let description = `${priceFormat.format(property.price)} MAD · ${place}. ${
    property[`description_${lang}`] ?? ""
  }`.trim();
  if (description.length > 160) description = description.slice(0, 157) + "…";
  const image: string | undefined = property.images[0];

  return {
    title,
    description,
    alternates: alternates(locale, `/property/${slug}`),
    openGraph: { title, description, images: image ? [image] : [] },
  };
}

export default async function PropertyPage({
  params,
}: PageProps<"/[locale]/property/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Property");
  const tCard = await getTranslations("PropertyCard");
  const tContact = await getTranslations("Contact");

  const property = await getProperty(slug);

  // Ingen bolig med den adresse: vis "siden findes ikke".
  if (!property) notFound();

  // Vælg tekst på det sprog, brugeren har valgt.
  const lang = locale === "ar" || locale === "en" ? locale : "fr";
  const title: string = property[`title_${lang}`];
  const description: string | null = property[`description_${lang}`];
  const images: string[] = property.images;
  const features = (property.features as string[]).filter((f) =>
    knownFeatures.includes(f),
  );

  // Fakta-boksene. Felter uden værdi vises ikke.
  const facts = [
    { label: t("area"), value: property.area_m2 && `${property.area_m2} m²` },
    { label: t("bedrooms"), value: property.bedrooms },
    { label: t("bathrooms"), value: property.bathrooms },
    { label: t("floor"), value: property.floor },
  ].filter((fact) => fact.value != null);

  // Kontaktknapper. WhatsApp-beskeden er udfyldt på forhånd med boligens navn og link.
  const host = (await headers()).get("host");
  const pageUrl = `https://${host}/${locale}/property/${slug}`;
  const whatsapp = property.agent?.whatsapp?.replace(/\D/g, "");
  const whatsappUrl =
    whatsapp &&
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      t("whatsappMessage", { title, url: pageUrl }),
    )}`;
  const phone = property.agent?.phone?.replace(/\s/g, "");

  // Kun omtrentlig placering: koordinaterne rundes af (ca. 1 km), før de sendes til browseren.
  const hasLocation = property.latitude != null && property.longitude != null;
  const round = (n: number) => Math.round(n * 100) / 100;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 pt-6">
      <Link href="/" className="text-sm font-medium text-emerald-700">
        {t("back")}
      </Link>

      <div className="relative">
        {images.length > 0 ? (
          <PropertyGallery
            images={images}
            title={title}
            label={t("photos", { count: images.length })}
          />
        ) : (
          <div className="aspect-[4/3] rounded-2xl bg-stone-100 sm:aspect-[16/9]" />
        )}
        <span className="absolute start-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
          {property.listing_type === "sale" ? tCard("sale") : tCard("rent")}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-3xl font-bold text-stone-900">
          <bdi>{priceFormat.format(property.price)} MAD</bdi>
          {property.rent_period && (
            <span className="text-base font-normal text-stone-500">
              {" "}
              {property.rent_period === "month"
                ? tCard("perMonth")
                : tCard("perDay")}
            </span>
          )}
        </p>
        <h1 className="text-2xl font-semibold text-stone-800">{title}</h1>
        <p className="text-stone-500">
          {property.neighborhood
            ? `${property.neighborhood}, ${property.city}`
            : property.city}
        </p>
      </div>

      {facts.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl bg-stone-100 p-3">
              <dt className="text-xs text-stone-500">{fact.label}</dt>
              <dd className="text-lg font-semibold text-stone-900">
                <bdi>{fact.value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {description && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900">
            {t("description")}
          </h2>
          <p className="leading-relaxed text-stone-700">{description}</p>
        </section>
      )}

      {features.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900">
            {t("features")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800"
              >
                {t(`feature.${feature}`)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasLocation && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900">
            {t("location")}
          </h2>
          <PropertyMap
            latitude={round(property.latitude)}
            longitude={round(property.longitude)}
          />
          <p className="text-sm text-stone-500">{t("locationNote")}</p>
        </section>
      )}

      {property.agent && (
        <section className="flex flex-col gap-1 rounded-2xl border border-stone-200 p-4">
          <h2 className="text-sm text-stone-500">{t("agent")}</h2>
          <p className="font-semibold text-stone-900">{property.agent.name}</p>
          {property.agent.company && (
            <p className="text-stone-600">{property.agent.company}</p>
          )}
        </section>
      )}

      {/* Kontaktformularen. "Formular"-knappen nederst hopper hertil. */}
      <section id="contact" className="flex scroll-mt-4 flex-col gap-3">
        <h2 className="text-lg font-semibold text-stone-900">
          {tContact("title")}
        </h2>
        <ContactForm propertyId={property.id} />
      </section>

      {/* Knapperne bliver hængende nederst på skærmen, mens man scroller. */}
      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-[#25D366] py-3 text-center font-semibold text-white"
          >
            {t("whatsapp")}
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 rounded-xl border border-emerald-700 py-3 text-center font-semibold text-emerald-700"
          >
            {t("call")}
          </a>
        )}
        <a
          href="#contact"
          className="flex-1 rounded-xl border border-emerald-700 py-3 text-center font-semibold text-emerald-700"
        >
          {tContact("form")}
        </a>
      </div>
    </main>
  );
}
