import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import type { TemplateConfig } from "../types";
import { Brand, Button, Photo } from "./ui";

export function AdminLoginForm({
  config,
  imageSrc,
  error,
  submitting,
  onSubmit,
}: {
  config: TemplateConfig;
  imageSrc?: string;
  error?: string;
  submitting?: boolean;
  onSubmit: (email: string, password: string) => void | Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

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
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(email, password);
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
