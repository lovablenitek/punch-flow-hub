import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PERFIS, podeAcessar, useStore } from "@/lib/store";

const NAV = [
  { to: "/cadastro", label: "Cadastro de Itens" },
  { to: "/entrada", label: "Entrada de Materiais" },
  { to: "/compras", label: "Compras / Reposição" },
  { to: "/saida", label: "Consulta e Saída" },
] as const;

export function AppShell({ rota, children }: { rota: string; children: ReactNode }) {
  const { perfil, responsavel, sair } = useStore();
  const navigate = useNavigate();

  if (!perfil) {
    return (
      <Bloqueio
        titulo="Selecione um perfil de acesso"
        texto="Entre com um dos três perfis para usar o sistema."
        acao={() => navigate({ to: "/" })}
      />
    );
  }

  if (!podeAcessar(perfil, rota)) {
    return (
      <Bloqueio
        titulo="Acesso restrito"
        texto={`O ${PERFIS[perfil].nome} não tem permissão para esta tela.`}
        acao={() => navigate({ to: PERFIS[perfil].rotas[0] as "/saida" })}
      />
    );
  }

  const links = NAV.filter((n) => podeAcessar(perfil, n.to));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-4 py-3">
          <div className="mr-auto">
            <p className="text-lg font-black tracking-tight text-foreground">NITEK</p>
            <p className="text-xs font-medium text-muted-foreground">
              Produtos para Fixação · Controle de Punções
            </p>
          </div>
          <nav className="flex flex-wrap gap-1">
            {links.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 border-l border-border pl-3">
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{responsavel || "Operador"}</p>
              <p className="text-xs text-muted-foreground">Perfil {perfil}</p>
            </div>
            <button
              onClick={() => {
                sair();
                navigate({ to: "/" });
              }}
              className="rounded-md border border-border px-3 py-2 text-xs font-bold uppercase text-foreground transition-colors hover:bg-accent"
            >
              Trocar
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6">{children}</main>
    </div>
  );
}

function Bloqueio({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-bold text-foreground">{titulo}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{texto}</p>
        <button
          onClick={acao}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";
