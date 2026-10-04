import { createClient } from "@supabase/supabase-js";

// Forbindelsen til databasen. Nøglerne kommer fra Vercel (miljøvariabler),
// aldrig fra koden. Anon-nøglen må gerne være offentlig: sikkerhedsreglerne
// i databasen (RLS) bestemmer, hvad den må.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
