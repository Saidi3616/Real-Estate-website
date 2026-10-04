import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Billedværter, Next.js må hente og komprimere billeder fra.
    // Testboligerne bruger Unsplash. Uploadede billeder ligger i Supabase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

// Kobler next-intl på, så den finder src/i18n/request.ts
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
