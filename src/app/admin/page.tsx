"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Login-side for admin (/admin).
export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Er du allerede logget ind, så gå direkte til listen.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin/properties");
    });
  }, [router]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError("Forkert e-mail eller password.");
    else router.replace("/admin/properties");
  }

  return (
    <form onSubmit={login} className="mx-auto mt-16 flex max-w-sm flex-col gap-3">
      <h1 className="text-2xl font-bold">Admin-login</h1>
      <input
        type="email"
        required
        placeholder="E-mail"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-3 py-3"
      />
      <input
        type="password"
        required
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-3 py-3"
      />
      {error && <p className="text-red-700">{error}</p>}
      <button
        disabled={busy}
        className="rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Logger ind …" : "Log ind"}
      </button>
    </form>
  );
}
