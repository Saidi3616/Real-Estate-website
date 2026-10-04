"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  created_at: string;
  property: { id: string; title_fr: string } | null;
};

// Henvendelser fra kontaktformularen (/admin/leads). Kun for admin.
export default function AdminLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      // Ikke logget ind? Tilbage til login.
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) return router.replace("/admin");

      // Nyeste først, med navnet på boligen henvendelsen gælder.
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, phone, message, created_at, property:properties(id, title_fr)")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      setLeads((data as unknown as Lead[]) ?? []);
    }
    load();
  }, [router]);

  return (
    <>
      <Link href="/admin/properties" className="text-sm font-medium text-emerald-700">
        ← Tilbage til boliger
      </Link>
      <h1 className="my-4 text-2xl font-bold">Henvendelser</h1>

      {error && <p className="text-red-700">Fejl: {error}</p>}
      {!leads && <p>Henter …</p>}
      {leads?.length === 0 && !error && <p>Ingen henvendelser endnu.</p>}

      <ul className="flex flex-col gap-2">
        {leads?.map((lead) => (
          <li key={lead.id} className="rounded-lg border border-stone-200 bg-white p-3">
            <div className="flex items-baseline justify-between gap-2">
              <p dir="auto" className="font-semibold">{lead.name}</p>
              <p className="text-sm text-stone-500">
                {new Date(lead.created_at).toLocaleString("da-DK", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="font-medium text-emerald-700">
              {lead.phone}
            </a>
            {lead.message && (
              <p dir="auto" className="mt-1 whitespace-pre-line text-stone-700">{lead.message}</p>
            )}
            <p className="mt-2 text-sm text-stone-600">
              Bolig:{" "}
              {lead.property ? (
                <Link href={`/admin/properties/${lead.property.id}`} className="text-emerald-700 underline">
                  {lead.property.title_fr}
                </Link>
              ) : (
                "(slettet)"
              )}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
