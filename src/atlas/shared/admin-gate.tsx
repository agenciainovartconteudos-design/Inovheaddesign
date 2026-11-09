import { useEffect, useState, type ReactNode } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  LogOut,
} from "lucide-react";
import type { TemplateConfig } from "../types";
import { supabase } from "../../integrations/supabase/client";
import { Brand, Button, Photo, useToast } from "./ui";

type SessionUser = { id: string; email: string; name: string };

export function AdminGate({
  config,
  imageSrc,
  children,
}: {
  config: TemplateConfig;
  imageSrc?: string;
  children: (ctx: { user: SessionUser; signOut: () => void }) => ReactNode;
}) {
  const [status, setStatus] = useState<
    "loading" | "signed-out" | "forbidden" | "signed-in"
  >("loading");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStatus("signed-out");
  };

  if (status === "loading") {
    return (
      <main id="main" className="admin-gate-loading">
        <Loader2 className="spin" size={28} />
        <p>Verificando sua sessão…</p>
      </main>
    );
  }

  if (status === "signed-in" && user) {
    return <>{children({ user, signOut })}</>;
  }

  if (status === "forbidden") {
    return (
      <main id="main" className="auth-layout">
        <section className="auth-form-side" style={{ margin: "auto" }}>
          <div className="auth-box">
            <div className="auth-icon">
              <ShieldAlert size={24} />
            </div>
            <span className="eyebrow">ACESSO RESTRITO</span>
            <h2>Esta conta não tem permissão de administrador</h2>
            <p>
              Entre em contato com quem administra o workspace para solicitar
              acesso, ou volte com outra conta.
            </p>
            <Button onClick={signOut}>
              <LogOut size={17} />
              Sair e tentar outra conta
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main" className="auth-layout">
      <section className="auth-visual">
        <Photo
          name={imageSrc || config.content.heroImage}
          alt={config.content.heroAlt || `Imagem de ${config.branding.name}`}
          loading="eager"
        />
        <div className="auth-visual-top">
          <Brand config={config} />
          <span>{config.branding.tagline}</span>
        </div>
        <div className="auth-visual-copy">
          <span className="auth-pill">
            <ShieldCheck size={14} />
            {config.content.visualBadge}
          </span>
          <h1>{config.content.headline}</h1>
          <p>{config.content.visualDescription || config.content.description}</p>
          <div className="auth-visual-bottom">
            <span>{config.content.visualFooter}</span>
          </div>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-mobile-brand">
          <Brand config={config} />
        </div>
        <div className="auth-box">
          <div className="auth-icon">
            <LockKeyhole size={24} />
          </div>
          <span className="eyebrow">{config.content.eyebrow}</span>
          <h2>{config.content.loginTitle || "Acesse o painel"}</h2>
          <p>{config.content.description}</p>
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
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
              toast("Login realizado.");
              await checkRole(data.user.id, data.user.email || "", name);
            }}
          >
            <label className="field">
              <span>Seu e-mail</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="voce@suaempresa.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Senha</span>
              <div className="password-wrap">
                <input
                  type={show ? "text" : "password"}
                  aria-label="Senha"
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && (
              <p className="field-hint" role="alert" style={{ color: "#a8493d" }}>
                {error}
              </p>
            )}
            <Button type="submit" className="full" disabled={submitting}>
              {submitting ? "Entrando…" : "Entrar no painel"}
            </Button>
          </form>
          <div className="auth-demo">
            <ShieldCheck size={17} />
            <p>
              Acesso restrito à equipe administrativa. Sua permissão é validada
              no servidor a cada acesso.
            </p>
          </div>
        </div>
        <div className="auth-bottom">
          <span>© {config.branding.name}</span>
          <span>{config.branding.tagline}</span>
        </div>
      </section>
    </main>
  );
}
