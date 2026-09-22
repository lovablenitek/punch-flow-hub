import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Campo, inputCls } from "@/components/AppShell";
import { ComprasPanel } from "@/components/ComprasPanel";
import { fmtData, useStore, type Item } from "@/lib/store";

export const Route = createFileRoute("/entrada")({
  head: () => ({
    meta: [
      { title: "Entrada de Materiais · Nitek Estoque" },
      {
        name: "description",
        content:
          "Entrada de punções com filtros em cascata por código, chave, diâmetro, face e fabricante, com localização automática.",
      },
      { property: "og:title", content: "Entrada de Materiais · Nitek Estoque" },
      {
        property: "og:description",
        content: "Some quantidades ao estoque e acompanhe compras pendentes de chegada.",
      },
    ],
  }),
  component: () => (
    <AppShell rota="/entrada">
      <Entrada />
    </AppShell>
  ),
});

const unicos = (arr: string[]) => [...new Set(arr.filter(Boolean))].sort();

function Entrada() {
  const { itens, registrarEntrada, movimentos } = useStore();
  const [descricao, setDescricao] = useState("");
  const [chave, setChave] = useState("");
  const [diametro, setDiametro] = useState("");
  const [face, setFace] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [qtd, setQtd] = useState(1);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const n1 = useMemo(() => itens.filter((i) => !descricao || i.descricao === descricao), [itens, descricao]);
  const n2 = useMemo(() => n1.filter((i) => !chave || i.chave === chave), [n1, chave]);
  const n3 = useMemo(() => n2.filter((i) => !diametro || i.diametro === diametro), [n2, diametro]);
  const n4 = useMemo(() => n3.filter((i) => !face || i.face === face), [n3, face]);
  const n5 = useMemo(() => n4.filter((i) => !fabricante || i.fabricante === fabricante), [n4, fabricante]);

  const selecionado: Item | null = n5.length === 1 ? (n5[0] ?? null) : null;

  const limpar = () => {
    setDescricao("");
    setChave("");
    setDiametro("");
    setFace("");
    setFabricante("");
    setQtd(1);
  };

  const entrar = () => {
    if (!selecionado) {
      setMsg({ tipo: "erro", texto: "Refine os filtros até restar um único punção." });
      return;
    }
    if (qtd <= 0) {
      setMsg({ tipo: "erro", texto: "Informe uma quantidade maior que zero." });
      return;
    }
    registrarEntrada(selecionado.id, qtd);
    setMsg({
      tipo: "ok",
      texto: `Entrada de ${qtd} pç registrada em ${selecionado.estoque} / ${selecionado.posicao}.`,
    });
    setQtd(1);
  };

  const ultimasEntradas = movimentos.filter((m) => m.tipo === "entrada").slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Entrada de Materiais</h1>
        <p className="text-sm text-muted-foreground">
          Localize o punção pelos filtros em cascata e lance a entrada no estoque.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="1. Código do punção / descrição">
              <select
                className={inputCls}
                value={descricao}
                onChange={(e) => {
                  setDescricao(e.target.value);
                  setChave("");
                  setDiametro("");
                  setFace("");
                  setFabricante("");
                }}
              >
                <option value="">Selecione...</option>
                {unicos(itens.map((i) => i.descricao)).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Campo>
            <Campo label="2. Tipo de chave">
              <select
                className={inputCls}
                value={chave}
                onChange={(e) => {
                  setChave(e.target.value);
                  setDiametro("");
                  setFace("");
                  setFabricante("");
                }}
              >
                <option value="">Todos</option>
                {unicos(n1.map((i) => i.chave)).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Campo>
            <Campo label="3. Diâmetro">
              <select
                className={inputCls}
                value={diametro}
                onChange={(e) => {
                  setDiametro(e.target.value);
                  setFace("");
                  setFabricante("");
                }}
              >
                <option value="">Todos</option>
                {unicos(n2.map((i) => i.diametro)).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Campo>
            <Campo label="4. Face">
              <select
                className={inputCls}
                value={face}
                onChange={(e) => {
                  setFace(e.target.value);
                  setFabricante("");
                }}
              >
                <option value="">Todas</option>
                {unicos(n3.map((i) => i.face)).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Campo>
            <Campo label="5. Fabricante">
              <select className={inputCls} value={fabricante} onChange={(e) => setFabricante(e.target.value)}>
                <option value="">Todos</option>
                {unicos(n4.map((i) => i.fabricante)).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </Campo>
            <div className="flex items-end">
              <button
                onClick={limpar}
                className="w-full rounded-md border border-border px-4 py-2 text-sm font-bold uppercase text-foreground hover:bg-accent"
              >
                Limpar filtros
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-lg border-2 border-border bg-surface p-4">
            {selecionado ? (
              <div className="grid gap-4 sm:grid-cols-4">
                <Info titulo="Norma" valor={selecionado.norma} />
                <Info titulo="Estoque" valor={selecionado.estoque} destaque />
                <Info titulo="Posição" valor={selecionado.posicao} destaque />
                <Info titulo="Qtd atual" valor={String(selecionado.quantidade)} />
                <div className="sm:col-span-4 text-sm font-semibold text-foreground">
                  {selecionado.descricao} · {selecionado.chave} · {selecionado.face} · Ø
                  {selecionado.diametro} · {selecionado.fabricante} · cad. {selecionado.cadastro}
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-muted-foreground">
                {n5.length === 0
                  ? "Nenhum punção corresponde aos filtros."
                  : `${n5.length} punções correspondem — continue filtrando para ver a localização exata.`}
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[200px_1fr] sm:items-end">
            <Campo label="Quantidade de entrada">
              <input
                type="number"
                min={1}
                className={`${inputCls} py-3 text-lg font-bold`}
                value={qtd}
                onChange={(e) => setQtd(Number(e.target.value) || 0)}
              />
            </Campo>
            <button
              onClick={entrar}
              disabled={!selecionado}
              className="rounded-lg bg-success px-6 py-4 text-xl font-black uppercase tracking-wide text-success-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Entrada
            </button>
          </div>
          {msg && (
            <p
              className={`mt-3 text-sm font-bold ${msg.tipo === "ok" ? "text-success" : "text-destructive"}`}
            >
              {msg.texto}
            </p>
          )}

          {ultimasEntradas.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                Últimas entradas
              </p>
              <ul className="mt-2 space-y-1">
                {ultimasEntradas.map((m) => (
                  <li key={m.id} className="text-xs text-muted-foreground">
                    <span className="font-bold text-success">+{m.quantidade}</span> {m.norma} ·{" "}
                    {m.descricao} · {m.local} · {m.responsavel} · {fmtData(m.data)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <ComprasPanel />
      </div>
    </div>
  );
}

function Info({ titulo, valor, destaque }: { titulo: string; valor: string; destaque?: boolean }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{titulo}</p>
      <p className={`font-black ${destaque ? "text-2xl text-primary" : "text-lg text-foreground"}`}>
        {valor}
      </p>
    </div>
  );
}
