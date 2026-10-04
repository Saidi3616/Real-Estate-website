import { defineRouting } from "next-intl/routing";

// Sprogene på siden. Fransk er standard.
export const routing = defineRouting({
  locales: ["fr", "ar", "en"],
  defaultLocale: "fr",
});
