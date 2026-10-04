"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PropertyForm from "@/components/PropertyForm";

// Ret eller slet en bolig (/admin/properties/[id]).
export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  // undefined = henter stadig, null = ikke fundet
  const [property, setProperty] = useState<Record<string, unknown> | null>();

  useEffect(() => {
    supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => setProperty(data));
  }, [id]);

  return (
    <>
      <Link href="/admin/properties" className="text-sm font-medium text-emerald-700">
        ← Tilbage til listen
      </Link>
      <h1 className="my-4 text-2xl font-bold">Ret bolig</h1>
      {property === undefined && <p>Henter …</p>}
      {property === null && <p>Boligen findes ikke.</p>}
      {property && <PropertyForm property={property} />}
    </>
  );
}
