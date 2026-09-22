import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PERFIS, useStore, type Perfil } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nitek · Controle de Estoque de Punções" },
      {
        name: "description",
        content:
          "Sistema Nitek para controle de estoque de punções industriais: cadastro, entrada, compras e saída de materiais.",
      },
      { property: "og:title", content: "Nitek · Controle de Estoque de Punções" },
      {
        property: "og:description",
        content:
          "Acesso por perfil para cadastro de itens, entrada de materiais, reposição e baixa de estoque no chão de fábrica.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const { entrar } = useStore();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  const acessar = (perfil: Perfil) => {
    if (!nome.trim()) {
      setErro("Informe o nome do responsável antes de entrar.");
      return;
    }
    entrar(perfil, nome.trim());
    navigate({ to: PERFIS[perfil].rotas[0] as "/saida" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <p className="text-3xl font-black tracking-tight text-foreground">NITEK</p>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Produtos para Fixação
          </p>
          <h1 className="mt-6 text-xl font-bold text-foreground">
            Controle de Estoque de Punções
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Identifique-se e escolha o seu nível de acesso.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Responsável
            </span>
            <input
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErro("");
              }}
              placeholder="Ex: João da Silva"
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-base font-semibold text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </label>
          {erro && <p className="mt-2 text-sm font-semibold text-destructive">{erro}</p>}

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(Object.keys(PERFIS) as Perfil[]).map((p) => (
              <button
                key={p}
                onClick={() => acessar(p)}
                className="flex h-full flex-col rounded-lg border-2 border-border bg-background p-4 text-left transition-colors hover:border-ring hover:bg-accent"
              >
                <span className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Perfil {p}
                </span>
                <span className="mt-1 text-sm font-bold text-foreground">
                  {PERFIS[p].nome.split("— ")[1]}
                </span>
                <span className="mt-2 text-xs text-muted-foreground">{PERFIS[p].descricao}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
