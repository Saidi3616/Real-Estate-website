"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

// Navnet på hvert sprog, skrevet på sproget selv
const languages = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "EN" },
] as const;

export default function LanguageSwitcher() {
  const current = useLocale();
  // Siden man står på nu, uden sprog-delen. Så bliver man på samme side.
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {languages.map(({ code, label }) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          aria-current={code === current ? "true" : undefined}
          className={`rounded-full px-3 py-2 text-sm font-medium ${
            code === current
              ? "bg-emerald-700 text-white"
              : "text-stone-700 hover:bg-stone-200"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
