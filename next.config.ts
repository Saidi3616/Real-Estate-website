import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Billedværter, Next.js må hente og komprimere billeder fra.
    // Testboligerne bruger Unsplash. Supabase-billeder tilføjes i trin 9.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

// Kobler next-intl på, så den finder src/i18n/request.ts
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
