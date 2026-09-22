import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ComprasPanel } from "@/components/ComprasPanel";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/compras")({
  head: () => ({
    meta: [
      { title: "Compras e Reposição · Nitek Estoque" },
      {
        name: "description",
        content:
          "Gestão de compras de punções: pedidos pendentes de chegada, recebimentos e itens com estoque crítico.",
      },
      { property: "og:title", content: "Compras e Reposição · Nitek Estoque" },
      {
        property: "og:description",
        content: "Acompanhe pedidos de reposição e priorize punções com saldo baixo ou zerado.",
      },
    ],
  }),
  component: () => (
    <AppShell rota="/compras">
      <Compras />
    </AppShell>
  ),
});

function Compras() {
  const { itens } = useStore();
  const criticos = [...itens].filter((i) => i.quantidade <= 10).sort((a, b) => a.quantidade - b.quantidade);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Compras / Reposição</h1>
        <p className="text-sm text-muted-foreground">
          Priorize a reposição para que nenhum item zere no estoque.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-surface px-4 py-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
            Estoque crítico ({criticos.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-xs font-black uppercase text-muted-foreground">
              <tr>
                {["Norma", "Descrição", "Chave", "Ø", "Fabricante", "Local", "Qtd"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criticos.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-3 py-2 font-bold">{i.norma}</td>
                  <td className="px-3 py-2 font-semibold">{i.descricao}</td>
                  <td className="px-3 py-2">{i.chave}</td>
                  <td className="px-3 py-2">{i.diametro}</td>
                  <td className="px-3 py-2">{i.fabricante}</td>
                  <td className="px-3 py-2">
                    {i.estoque} / {i.posicao}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-black ${
                        i.quantidade === 0
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-warning text-warning-foreground"
                      }`}
                    >
                      {i.quantidade}
                    </span>
                  </td>
                </tr>
              ))}
              {criticos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    Nenhum item em nível crítico.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ComprasPanel />
    </div>
  );
}
