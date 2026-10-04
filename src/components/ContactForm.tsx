"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  sendLead,
  type LeadState,
} from "@/app/[locale]/property/[slug]/actions";

const initialState: LeadState = { status: "idle" };

// Kontaktformularen på boligsiden: navn, telefon og besked.
export default function ContactForm({ propertyId }: { propertyId: string }) {
  const t = useTranslations("Contact");
  const [state, formAction, pending] = useActionState(
    sendLead.bind(null, propertyId),
    initialState,
  );

  if (state.status === "sent") {
    return (
      <p
        role="status"
        className="rounded-xl bg-emerald-50 p-4 text-emerald-800"
      >
        {t("sent")}
      </p>
    );
  }

  const input =
    "w-full rounded-xl border border-stone-300 px-3 py-3 text-base text-stone-900";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-stone-600">
        {t("name")}
        <input name="name" required maxLength={100} autoComplete="name" className={input} />
      </label>
      <label className="flex flex-col gap-1 text-sm text-stone-600">
        {t("phone")}
        <input
          name="phone"
          type="tel"
          required
          maxLength={30}
          autoComplete="tel"
          placeholder="+212 6 12 34 56 78"
          dir="ltr"
          className={`${input} rtl:text-end`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-stone-600">
        {t("message")}
        <textarea
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={t("defaultMessage")}
          className={input}
        />
      </label>

      {/* Honeypot: skjult for mennesker, robotter udfylder det. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {state.status !== "idle" && (
        <p role="alert" className="text-sm text-red-700">
          {state.status === "invalid" ? t("invalid") : t("error")}
        </p>
      )}

      <button
        disabled={pending}
        className="rounded-xl bg-emerald-700 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? t("sending") : t("send")}
      </button>
    </form>
  );
}
