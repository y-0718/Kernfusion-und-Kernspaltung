"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setMessage("Login fehlgeschlagen. Prüfe E-Mail und Passwort.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <FieldWrapper label="E-Mail">
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
      </FieldWrapper>
      <FieldWrapper label="Passwort">
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />
      </FieldWrapper>
      {message ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p> : null}
      <Button type="submit" disabled={loading}>
        <LogIn size={18} />
        {loading ? "Anmeldung läuft ..." : "Einloggen"}
      </Button>
    </form>
  );
}
