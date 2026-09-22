import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { autenticar, PERFIS, useStore } from "@/lib/store";

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
          "Acesso com usuário e senha para cadastro de itens, entrada de materiais, reposição e baixa de estoque no chão de fábrica.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const { entrar } = useStore();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !senha) {
      setErro("Preencha o usuário e a senha para entrar.");
      return;
    }
    const conta = autenticar(usuario, senha);
    if (!conta) {
      setErro("Usuário ou senha incorretos. Verifique e tente novamente.");
      return;
    }
    entrar(conta.perfil, conta.usuario);
    navigate({ to: PERFIS[conta.perfil].rotas[0] as "/saida" });
  };

  const inputCls =
    "w-full rounded-md border border-input bg-background px-3 py-3 text-base font-semibold text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-3xl font-black tracking-tight text-foreground">NITEK</p>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Produtos para Fixação
          </p>
          <h1 className="mt-6 text-xl font-bold text-foreground">
            Controle de Estoque de Punções
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre com seu usuário e senha para acessar.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 rounded-xl border border-border bg-card p-6">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Usuário
            </span>
            <input
              value={usuario}
              autoComplete="username"
              onChange={(e) => {
                setUsuario(e.target.value);
                setErro("");
              }}
              placeholder="Ex: Leonardo"
              className={inputCls}
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Senha
            </span>
            <input
              type="password"
              value={senha}
              autoComplete="current-password"
              onChange={(e) => {
                setSenha(e.target.value);
                setErro("");
              }}
              placeholder="••••"
              className={inputCls}
            />
          </label>

          {erro && (
            <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-primary px-4 py-3 text-base font-black uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Entrar
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Seu nível de acesso é definido automaticamente pelo seu usuário.
          </p>
        </form>
      </div>
    </div>
  );
}
