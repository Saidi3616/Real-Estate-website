import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// "Dørmanden": sender fx / videre til /fr
export default createMiddleware(routing);

export const config = {
  // Kør på alle sider, men ikke på admin, filer (billeder, CSS osv.) og interne Next-stier
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
