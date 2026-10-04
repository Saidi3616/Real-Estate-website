"use server";

import { supabase } from "@/lib/supabase";

export type LeadState = { status: "idle" | "sent" | "invalid" | "error" };

// Gemmer en henvendelse fra kontaktformularen. Kører på serveren.
export async function sendLead(
  propertyId: string,
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  // Honeypot: feltet "website" er skjult for mennesker. Er det udfyldt,
  // er det en robot. Vi lader som om alt gik godt, men gemmer intet.
  if (formData.get("website")) return { status: "sent" };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Samme grænser som i databasen (supabase/leads.sql).
  if (
    name.length < 1 ||
    name.length > 100 ||
    phone.replace(/\D/g, "").length < 6 ||
    phone.length > 30 ||
    message.length > 2000
  ) {
    return { status: "invalid" };
  }

  const { error } = await supabase
    .from("leads")
    .insert({ property_id: propertyId, name, phone, message: message || null });
  if (error) {
    console.error("Kunne ikke gemme henvendelse:", error.message);
    return { status: "error" };
  }
  return { status: "sent" };
}
