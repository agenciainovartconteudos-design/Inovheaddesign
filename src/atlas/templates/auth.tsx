import { ShieldAlert, LogOut } from "lucide-react";
import type { TemplateProps } from "../types";
import { useAdminAuth } from "../shared/admin-auth";
import { AdminLoginForm } from "../shared/admin-login-form";
import { Button } from "../shared/ui";
import adminConfigData from "../configs/admin.json";
import type { TemplateConfig } from "../types";
import Admin from "./admin";
import adminHero from "../../assets/admin-login-hero.webp";

const adminConfig = adminConfigData as unknown as TemplateConfig;

/**
 * Página de acesso do admin (/auth). Valida e-mail e senha reais no Supabase
 * e só avança quando a conta tiver o papel 'admin' em user_roles (verificado
 * no servidor via RLS, nunca no localStorage). Em caso de sucesso, redireciona
 * para o painel administrativo real.
 */
export default function Auth({ config, imageSrc }: TemplateProps & { imageSrc?: string }) {
  const { status, user, error, submitting, signIn, signOut } = useAdminAuth();

  if (status === "loading") {
    return (
      <main id="main" className="admin-gate-loading">
        <p>Verificando sua sessão…</p>
      </main>
    );
  }

  if (status === "signed-in" && user) {
    // Redirecionamento para o painel administrativo após autenticação válida.
    return <Admin config={adminConfig} />;
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
              Esse e-mail e senha são válidos, mas essa conta ainda não tem o
              papel de administrador liberado neste workspace.
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
      imageSrc={imageSrc || adminHero}
      error={error}
      submitting={submitting}
      onSubmit={signIn}
    />
  );
}
