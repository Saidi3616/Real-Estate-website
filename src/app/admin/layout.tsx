import type { Metadata } from "next";
import "../globals.css";

// Admin-sidernes ramme. Kun på dansk, fordi kun admin bruger dem.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false }, // Google skal ikke vise admin-siderne
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="da">
      <body className="min-h-full font-sans antialiased">
        <main className="mx-auto max-w-3xl p-4">{children}</main>
      </body>
    </html>
  );
}
