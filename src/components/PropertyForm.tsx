"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Valgmuligheder med danske navne (værdierne er de samme som i databasen).
const listingTypes = { sale: "Salg", rent: "Leje" };
const propertyTypes = {
  apartment: "Lejlighed",
  villa: "Villa",
  riad: "Riad",
  house: "Hus",
  land: "Grund",
  commercial: "Erhverv",
};
const rentPeriods = { "": "—", month: "Pr. måned", day: "Pr. dag" };
const statuses = {
  draft: "Kladde (skjult)",
  published: "Udgivet",
  sold: "Solgt",
  rented: "Udlejet",
};
const features = {
  pool: "Pool",
  parking: "Parkering",
  elevator: "Elevator",
  terrace: "Terrasse",
  balcony: "Altan",
  garden: "Have",
  furnished: "Møbleret",
  sea_view: "Havudsigt",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Property = Record<string, any>;
type Agent = { id: string; name: string; company: string | null };

// Lav en pæn adresse ud fra en titel: "Villa à Anfa" → "villa-a-anfa"
function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // fjern accenter
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Tomt felt = ingen værdi (null), ellers et tal.
function numberOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text === "" ? null : Number(text);
}

const input = "w-full rounded-lg border border-stone-300 bg-white px-3 py-2";

// Formular til at oprette (uden "property") eller rette en bolig.
export default function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const p = property ?? {};

  // Kun for indloggede. Hent også mæglerne til listen.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/admin");
    });
    supabase
      .from("agents")
      .select("id, name, company")
      .order("name")
      .then(({ data }) => setAgents(data ?? []));
  }, [router]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();

    const row = {
      slug: slugify(text("slug") || text("title_fr")),
      title_fr: text("title_fr"),
      title_ar: text("title_ar"),
      title_en: text("title_en"),
      description_fr: text("description_fr") || null,
      description_ar: text("description_ar") || null,
      description_en: text("description_en") || null,
      listing_type: text("listing_type"),
      property_type: text("property_type"),
      price: numberOrNull(form.get("price")),
      rent_period: text("rent_period") || null,
      city: text("city"),
      neighborhood: text("neighborhood") || null,
      latitude: numberOrNull(form.get("latitude")),
      longitude: numberOrNull(form.get("longitude")),
      area_m2: numberOrNull(form.get("area_m2")),
      bedrooms: numberOrNull(form.get("bedrooms")),
      bathrooms: numberOrNull(form.get("bathrooms")),
      floor: numberOrNull(form.get("floor")),
      features: form.getAll("features").map(String),
      agent_id: text("agent_id") || null,
      status: text("status"),
      is_featured: form.get("is_featured") === "on",
      updated_at: new Date().toISOString(),
    };

    setBusy(true);
    setError("");
    const { error } = property
      ? await supabase.from("properties").update(row).eq("id", property.id)
      : await supabase.from("properties").insert(row);
    setBusy(false);

    if (!error) return router.push("/admin/properties");
    // 23505 = databasen siger, at værdien allerede findes
    setError(
      error.code === "23505"
        ? "Adressen (slug) bruges allerede af en anden bolig. Vælg en anden."
        : `Kunne ikke gemme: ${error.message}`,
    );
  }

  async function remove() {
    if (!confirm("Er du sikker på, at du vil slette boligen? Det kan ikke fortrydes.")) return;
    const { error } = await supabase.from("properties").delete().eq("id", property!.id);
    if (error) setError(`Kunne ikke slette: ${error.message}`);
    else router.push("/admin/properties");
  }

  // Små hjælpere til felterne, så formularen er let at læse.
  const field = (label: string, el: React.ReactNode) => (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      {el}
    </label>
  );
  const select = (name: string, options: Record<string, string>) => (
    <select name={name} defaultValue={p[name] ?? Object.keys(options)[0]} className={input}>
      {Object.entries(options).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
  const num = (name: string, step = "1") => (
    <input type="number" name={name} step={step} defaultValue={p[name] ?? ""} className={input} />
  );

  return (
    <form onSubmit={save} className="flex flex-col gap-4 pb-16">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-semibold">Titel og beskrivelse</legend>
        {field("Titel (fransk) *", <input name="title_fr" required defaultValue={p.title_fr} className={input} />)}
        {field("Titel (arabisk) *", <input name="title_ar" required dir="rtl" defaultValue={p.title_ar} className={input} />)}
        {field("Titel (engelsk) *", <input name="title_en" required defaultValue={p.title_en} className={input} />)}
        {field("Beskrivelse (fransk)", <textarea name="description_fr" rows={4} defaultValue={p.description_fr ?? ""} className={input} />)}
        {field("Beskrivelse (arabisk)", <textarea name="description_ar" rows={4} dir="rtl" defaultValue={p.description_ar ?? ""} className={input} />)}
        {field("Beskrivelse (engelsk)", <textarea name="description_en" rows={4} defaultValue={p.description_en ?? ""} className={input} />)}
        {field(
          "Adresse (slug)",
          <input name="slug" defaultValue={p.slug} placeholder="Laves automatisk ud fra den franske titel" className={input} />,
        )}
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="mb-2 font-semibold">Bolig</legend>
        {field("Salg / leje", select("listing_type", listingTypes))}
        {field("Boligtype", select("property_type", propertyTypes))}
        {field("Pris (MAD) *", <input type="number" name="price" required min="0" defaultValue={p.price ?? ""} className={input} />)}
        {field("Lejeperiode", select("rent_period", rentPeriods))}
        {field("Areal (m²)", num("area_m2"))}
        {field("Værelser", num("bedrooms"))}
        {field("Badeværelser", num("bathrooms"))}
        {field("Etage", num("floor"))}
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="mb-2 font-semibold">Placering</legend>
        {field("By *", <input name="city" required defaultValue={p.city} className={input} />)}
        {field("Kvarter", <input name="neighborhood" defaultValue={p.neighborhood ?? ""} className={input} />)}
        {field("Breddegrad", num("latitude", "any"))}
        {field("Længdegrad", num("longitude", "any"))}
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="mb-2 font-semibold">Faciliteter</legend>
        {Object.entries(features).map(([value, label]) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="features"
              value={value}
              defaultChecked={p.features?.includes(value)}
              className="h-5 w-5"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-semibold">Visning</legend>
        {field(
          "Mægler",
          <select name="agent_id" defaultValue={p.agent_id ?? ""} className={input} key={agents.length}>
            <option value="">Ingen</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
                {agent.company ? ` (${agent.company})` : ""}
              </option>
            ))}
          </select>,
        )}
        {field("Status", select("status", statuses))}
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" defaultChecked={p.is_featured} className="h-5 w-5" />
          Udvalgt på forsiden
        </label>
      </fieldset>

      {error && <p className="text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button
          disabled={busy}
          className="flex-1 rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Gemmer …" : "Gem"}
        </button>
        {property && (
          <button type="button" onClick={remove} className="rounded-lg border border-red-300 px-4 py-3 text-red-700">
            Slet
          </button>
        )}
      </div>
    </form>
  );
}
