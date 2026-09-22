import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Campo, inputCls } from "@/components/AppShell";
import { fmtData, useStore, type Item } from "@/lib/store";

export const Route = createFileRoute("/saida")({
  head: () => ({
    meta: [
      { title: "Consulta e Saída · Nitek Estoque" },
      {
        name: "description",
        content:
          "Consulta por norma com filtros de diâmetro e fabricante, localização exata do punção e baixa de estoque.",
      },
      { property: "og:title", content: "Consulta e Saída · Nitek Estoque" },
      {
        property: "og:description",
        content: "Tela de chão de fábrica para retirada de punções com registro de responsável e horário.",
      },
    ],
  }),
  component: () => (
    <AppShell rota="/saida">
      <Saida />
    </AppShell>
  ),
});

const unicos = (arr: string[]) => [...new Set(arr.filter(Boolean))].sort();

function Saida() {
  const { itens, movimentos, registrarSaida } = useStore();
  const [norma, setNorma] = useState("");
  const [diametro, setDiametro] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [itemId, setItemId] = useState("");
  const [qtd, setQtd] = useState(1);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const porNorma = useMemo(() => itens.filter((i) => i.norma === norma), [itens, norma]);
  const porDiametro = useMemo(
    () => porNorma.filter((i) => !diametro || i.diametro === diametro),
    [porNorma, diametro],
  );
  const opcoes = useMemo(
    () => porDiametro.filter((i) => !fabricante || i.fabricante === fabricante),
    [porDiametro, fabricante],
  );

  const selecionado: Item | null =
    opcoes.find((i) => i.id === itemId) ?? (opcoes.length === 1 ? opcoes[0] : null);

  const ultimasSaidas = movimentos.filter((m) => m.tipo === "saida").slice(0, 6);

  const dar = () => {
    if (!selecionado) {
      setMsg({ tipo: "erro", texto: "Selecione a norma e o punção antes da baixa." });
      return;
    }
    const r = registrarSaida(selecionado.id, qtd);
    if (!r.ok) {
      setMsg({ tipo: "erro", texto: r.erro ?? "Não foi possível registrar a saída." });
      return;
    }
    const restante = selecionado.quantidade - qtd;
    setMsg({
      tipo: "ok",
      texto:
        restante === 0
          ? `Saída de ${qtd} pç registrada. ATENÇÃO: estoque zerado — avise o setor de compras.`
          : restante <= 10
            ? `Saída de ${qtd} pç registrada. Saldo baixo: ${restante} pç restantes.`
            : `Saída de ${qtd} pç registrada. Saldo: ${restante} pç.`,
    });
    setQtd(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Consulta e Saída de Materiais
        </h1>
        <p className="text-sm text-muted-foreground">Comece pela norma do punção.</p>
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-surface px-4 py-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
            Últimas movimentações
          </h2>
        </div>
        <ul className="divide-y divide-border">
          {ultimasSaidas.map((m) => (
            <li key={m.id} className="flex flex-wrap gap-2 px-4 py-2 text-sm">
              <span className="font-black text-destructive">-{m.quantidade}</span>
              <span className="font-bold text-foreground">{m.norma}</span>
              <span className="text-muted-foreground">{m.descricao}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {m.local} · {m.responsavel} · {fmtData(m.data)}
              </span>
            </li>
          ))}
          {ultimasSaidas.length === 0 && (
            <li className="px-4 py-4 text-sm text-muted-foreground">Nenhuma saída registrada ainda.</li>
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Campo label="1. Norma">
            <select
              className={`${inputCls} py-3 text-base font-bold`}
              value={norma}
              onChange={(e) => {
                setNorma(e.target.value);
                setDiametro("");
                setFabricante("");
                setItemId("");
                setMsg(null);
              }}
            >
              <option value="">Selecione a norma...</option>
              {unicos(itens.map((i) => i.norma)).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </Campo>
          <Campo label="2. Diâmetro">
            <select
              className={inputCls}
              value={diametro}
              disabled={!norma}
              onChange={(e) => {
                setDiametro(e.target.value);
                setFabricante("");
                setItemId("");
              }}
            >
              <option value="">Todos</option>
              {unicos(porNorma.map((i) => i.diametro)).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </Campo>
          <Campo label="3. Fabricante">
            <select
              className={inputCls}
              value={fabricante}
              disabled={!norma}
              onChange={(e) => {
                setFabricante(e.target.value);
                setItemId("");
              }}
            >
              <option value="">Todos</option>
              {unicos(porDiametro.map((i) => i.fabricante)).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </Campo>
          <Campo label="4. Opções de punções">
            <select
              className={inputCls}
              value={selecionado?.id ?? ""}
              disabled={!norma}
              onChange={(e) => setItemId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {opcoes.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.descricao} · {i.chave} · {i.face} · Ø{i.diametro} · {i.fabricante}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <div className="mt-5 grid gap-4 rounded-lg border-2 border-border bg-surface p-4 sm:grid-cols-3">
          {selecionado ? (
            <>
              <Bloco titulo="Estoque" valor={selecionado.estoque} />
              <Bloco titulo="Posição" valor={selecionado.posicao} />
              <Bloco
                titulo="Total disponível"
                valor={`${selecionado.quantidade} pç`}
                alerta={selecionado.quantidade === 0 ? "critico" : selecionado.quantidade <= 10 ? "baixo" : undefined}
              />
              <p className="sm:col-span-3 text-sm font-semibold text-foreground">
                {selecionado.norma} · {selecionado.descricao} · {selecionado.chave} ·{" "}
                {selecionado.face} · Ø{selecionado.diametro} · {selecionado.fabricante}
                {selecionado.observacoes ? ` · ${selecionado.observacoes}` : ""}
              </p>
            </>
          ) : (
            <p className="sm:col-span-3 text-sm font-semibold text-muted-foreground">
              {norma
                ? `${opcoes.length} punção(ões) nesta norma — selecione a opção para ver a localização.`
                : "Selecione a norma para iniciar a consulta."}
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[200px_1fr] sm:items-end">
          <Campo label="Quantidade retirada">
            <input
              type="number"
              min={1}
              className={`${inputCls} py-3 text-lg font-bold`}
              value={qtd}
              onChange={(e) => setQtd(Number(e.target.value) || 0)}
            />
          </Campo>
          <button
            onClick={dar}
            disabled={!selecionado}
            className="rounded-lg bg-destructive px-6 py-4 text-xl font-black uppercase tracking-wide text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Saída
          </button>
        </div>
        {msg && (
          <p className={`mt-3 text-sm font-bold ${msg.tipo === "ok" ? "text-success" : "text-destructive"}`}>
            {msg.texto}
          </p>
        )}
      </section>
    </div>
  );
}

function Bloco({
  titulo,
  valor,
  alerta,
}: {
  titulo: string;
  valor: string;
  alerta?: "baixo" | "critico";
}) {
  return (
    <div className="rounded-md bg-card p-3">
      <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{titulo}</p>
      <p className="text-3xl font-black text-foreground">{valor}</p>
      {alerta && (
        <p
          className={`mt-1 text-xs font-bold uppercase ${
            alerta === "critico" ? "text-destructive" : "text-warning"
          }`}
        >
          {alerta === "critico" ? "Estoque zerado" : "Saldo baixo — repor"}
        </p>
      )}
    </div>
  );
}
