"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Row = {
  id: string;
  title_fr: string;
  city: string;
  price: number;
  status: string;
};

// Danske navne på status
const statusText: Record<string, string> = {
  draft: "Kladde",
  published: "Udgivet",
  sold: "Solgt",
  rented: "Udlejet",
};

// Liste over alle boliger (/admin/properties). Kun for admin.
export default function AdminProperties() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      // Ikke logget ind? Tilbage til login.
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) return router.replace("/admin");

      const { data, error } = await supabase
        .from("properties")
        .select("id, title_fr, city, price, status")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      setRows(data ?? []);
    }
    load();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Boliger</h1>
        <button onClick={logout} className="rounded-lg border border-stone-300 px-3 py-2">
          Log ud
        </button>
      </div>

      <Link
        href="/admin/properties/new"
        className="mb-4 block rounded-lg bg-emerald-700 px-4 py-3 text-center font-semibold text-white"
      >
        + Ny bolig
      </Link>
      <Link
        href="/admin/leads"
        className="mb-4 block rounded-lg border border-emerald-700 px-4 py-3 text-center font-semibold text-emerald-700"
      >
        Se henvendelser
      </Link>

      {error && <p className="text-red-700">Fejl: {error}</p>}
      {!rows && <p>Henter …</p>}
      {rows?.length === 0 && !error && <p>Ingen boliger endnu.</p>}

      <ul className="flex flex-col gap-2">
        {rows?.map((row) => (
          <li key={row.id}>
            <Link
              href={`/admin/properties/${row.id}`}
              className="block rounded-lg border border-stone-200 bg-white p-3"
            >
              <p className="font-semibold">{row.title_fr}</p>
              <p className="text-sm text-stone-600">
                {row.city} · {row.price.toLocaleString("fr-FR")} MAD · {statusText[row.status]}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
