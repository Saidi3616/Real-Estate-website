import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Links og adresser, der kender til sprogene (fx /ar/...)
export const { Link, usePathname } = createNavigation(routing);
