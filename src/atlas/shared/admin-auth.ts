import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";

export type AdminSessionUser = { id: string; email: string; name: string };
export type AdminAuthStatus = "loading" | "signed-out" | "forbidden" | "signed-in";

export function useAdminAuth() {
  const [status, setStatus] = useState<AdminAuthStatus>("loading");
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checkRole = async (id: string, mail: string, name: string) => {
    const { data, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", id)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError) {
      setError("Não foi possível validar sua permissão agora. Tente novamente.");
      setStatus("signed-out");
      return;
    }
    if (data) {
      setUser({ id, email: mail, name });
      setStatus("signed-in");
    } else {
      setStatus("forbidden");
    }
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const session = data.session;
      if (!session) {
        setStatus("signed-out");
        return;
      }
      const name =
        (session.user.user_metadata?.name as string) ||
        session.user.email?.split("@")[0] ||
        "Administrador";
      await checkRole(session.user.id, session.user.email || "", name);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setStatus("signed-out");
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setError("");
    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);
    if (signInError || !data.session || !data.user) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    const name =
      (data.user.user_metadata?.name as string) ||
      data.user.email?.split("@")[0] ||
      "Administrador";
    await checkRole(data.user.id, data.user.email || "", name);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStatus("signed-out");
  };

  return { status, user, error, submitting, signIn, signOut };
}
