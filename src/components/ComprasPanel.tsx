import { useState } from "react";
import { Campo, inputCls } from "@/components/AppShell";
import { fmtData, useStore } from "@/lib/store";

export function ComprasPanel({ permitirNovo = true }: { permitirNovo?: boolean }) {
  const { compras, addCompra, receberCompra, removeCompra } = useStore();
  const [f, setF] = useState({ norma: "", descricao: "", fornecedor: "", quantidade: 0 });
  const [erro, setErro] = useState("");

  const pendentes = compras.filter((c) => c.status === "pendente");
  const recebidas = compras.filter((c) => c.status === "recebido");

  const salvar = () => {
    if (!f.norma.trim() || !f.descricao.trim() || f.quantidade <= 0) {
      setErro("Preencha norma, descrição e quantidade.");
      return;
    }
    setErro("");
    addCompra({ ...f, dataPedido: new Date().toISOString() });
    setF({ norma: "", descricao: "", fornecedor: "", quantidade: 0 });
  };

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-surface px-4 py-3">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
          Compras já realizadas e pendentes de chegada
        </h2>
        <p className="text-xs text-muted-foreground">
          {pendentes.length} pedido(s) aguardando recebimento
        </p>
      </div>

      <ul className="divide-y divide-border">
        {pendentes.map((c) => (
          <li key={c.id} className="p-4">
            <div className="flex flex-wrap items-start gap-3">
              <div className="mr-auto">
                <p className="text-sm font-bold text-foreground">
                  {c.norma} · {c.descricao}
                </p>
                <p className="text-xs text-muted-foreground">
                  {c.fornecedor || "Fornecedor não informado"} · pedido em {fmtData(c.dataPedido)}
                </p>
              </div>
              <span className="rounded bg-warning px-2 py-1 text-xs font-black text-warning-foreground">
                {c.quantidade} pç
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => receberCompra(c.id)}
                  className="rounded-md bg-success px-3 py-1.5 text-xs font-bold uppercase text-success-foreground"
                >
                  Marcar recebido
                </button>
                <button
                  onClick={() => removeCompra(c.id)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-bold uppercase text-muted-foreground hover:bg-accent"
                >
                  Remover
                </button>
              </div>
            </div>
          </li>
        ))}
        {pendentes.length === 0 && (
          <li className="p-6 text-center text-sm text-muted-foreground">
            Nenhuma compra pendente de chegada.
          </li>
        )}
      </ul>

      {permitirNovo && (
        <div className="border-t border-border p-4">
          <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
            Registrar novo pedido
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Campo label="Norma">
              <input className={inputCls} value={f.norma} onChange={(e) => setF({ ...f, norma: e.target.value })} />
            </Campo>
            <Campo label="Descrição">
              <input className={inputCls} value={f.descricao} onChange={(e) => setF({ ...f, descricao: e.target.value })} />
            </Campo>
            <Campo label="Fornecedor">
              <input className={inputCls} value={f.fornecedor} onChange={(e) => setF({ ...f, fornecedor: e.target.value })} />
            </Campo>
            <Campo label="Quantidade">
              <input
                type="number"
                min={1}
                className={inputCls}
                value={f.quantidade}
                onChange={(e) => setF({ ...f, quantidade: Number(e.target.value) || 0 })}
              />
            </Campo>
          </div>
          {erro && <p className="mt-2 text-sm font-semibold text-destructive">{erro}</p>}
          <button
            onClick={salvar}
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground"
          >
            Adicionar pedido
          </button>
        </div>
      )}

      {recebidas.length > 0 && (
        <div className="border-t border-border p-4">
          <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
            Recebidas recentemente
          </p>
          <ul className="mt-2 space-y-1">
            {recebidas.slice(0, 5).map((c) => (
              <li key={c.id} className="text-xs text-muted-foreground">
                {c.norma} · {c.descricao} · {c.quantidade} pç · {fmtData(c.dataPedido)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
