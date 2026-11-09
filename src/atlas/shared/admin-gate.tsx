import { type ReactNode } from "react";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";
import type { TemplateConfig } from "../types";
import { useAdminAuth, type AdminSessionUser } from "./admin-auth";
import { AdminLoginForm } from "./admin-login-form";
import { Button } from "./ui";

export function AdminGate({
  config,
  imageSrc,
  children,
}: {
  config: TemplateConfig;
  imageSrc?: string;
  children: (ctx: { user: AdminSessionUser; signOut: () => void }) => ReactNode;
}) {
  const { status, user, error, submitting, signIn, signOut } = useAdminAuth();

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
    <AdminLoginForm
      config={config}
      imageSrc={imageSrc}
      error={error}
      submitting={submitting}
      onSubmit={signIn}
    />
  );
}
