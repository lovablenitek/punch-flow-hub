import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Campo, inputCls } from "@/components/AppShell";
import { useStore, type Item } from "@/lib/store";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro de Itens · Nitek Estoque" },
      {
        name: "description",
        content:
          "Cadastre, edite e exclua punções com norma, código, chave, face, diâmetro, fabricante, localização e quantidade.",
      },
      { property: "og:title", content: "Cadastro de Itens · Nitek Estoque" },
      {
        property: "og:description",
        content: "Tabela de itens de punção e formulário completo de cadastro base do estoque.",
      },
    ],
  }),
  component: () => (
    <AppShell rota="/cadastro">
      <Cadastro />
    </AppShell>
  ),
});

const vazio: Omit<Item, "id"> = {
  norma: "",
  cadastro: "",
  descricao: "",
  chave: "PHS",
  face: "RETO",
  diametro: "",
  fabricante: "",
  estoque: "",
  posicao: "",
  quantidade: 0,
  observacoes: "",
};

const CHAVES = ["PHS", "PZD", "RETA", "TORX", "HEX", "COMB"];
const FACES = ["RETO", "CÔCAVO", "PINO"];

function Cadastro() {
  const { itens, addItem, updateItem, removeItem } = useStore();
  const [form, setForm] = useState<Omit<Item, "id">>(vazio);
  const [editId, setEditId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  const set = (k: keyof Omit<Item, "id">, v: string) =>
    setForm((f) => ({ ...f, [k]: k === "quantidade" ? Number(v) || 0 : v }));

  const salvar = () => {
    if (!form.norma.trim() || !form.descricao.trim() || !form.cadastro.trim()) {
      setErro("Norma, código de cadastro e descrição são obrigatórios.");
      return;
    }
    setErro("");
    if (editId) updateItem(editId, form);
    else addItem(form);
    setForm(vazio);
    setEditId(null);
  };

  const editar = (item: Item) => {
    const { id, ...rest } = item;
    setEditId(id);
    setForm(rest);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtrados = itens.filter((i) =>
    `${i.norma} ${i.cadastro} ${i.descricao} ${i.chave} ${i.face} ${i.diametro} ${i.fabricante} ${i.estoque}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Cadastro de Itens</h1>
        <p className="text-sm text-muted-foreground">
          Base de punções do estoque — {itens.length} item(ns) cadastrado(s).
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
          {editId ? "Editar item" : "Novo item"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Campo label="Norma">
            <input className={inputCls} value={form.norma} onChange={(e) => set("norma", e.target.value)} placeholder="PA0114" />
          </Campo>
          <Campo label="Código de cadastro">
            <input className={inputCls} value={form.cadastro} onChange={(e) => set("cadastro", e.target.value)} placeholder="10004" />
          </Campo>
          <Campo label="Descrição / código do punção">
            <input className={inputCls} value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="DIN 7982 M4,8" />
          </Campo>
          <Campo label="Tipo de chave / fenda">
            <select className={inputCls} value={form.chave} onChange={(e) => set("chave", e.target.value)}>
              {CHAVES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Face">
            <select className={inputCls} value={form.face} onChange={(e) => set("face", e.target.value)}>
              {FACES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Diâmetro">
            <input className={inputCls} value={form.diametro} onChange={(e) => set("diametro", e.target.value)} placeholder="18" />
          </Campo>
          <Campo label="Fabricante">
            <input className={inputCls} value={form.fabricante} onChange={(e) => set("fabricante", e.target.value)} placeholder="YUTA" />
          </Campo>
          <Campo label="Estoque / localização">
            <input className={inputCls} value={form.estoque} onChange={(e) => set("estoque", e.target.value)} placeholder="M2" />
          </Campo>
          <Campo label="Posição">
            <input className={inputCls} value={form.posicao} onChange={(e) => set("posicao", e.target.value)} placeholder="112" />
          </Campo>
          <Campo label="Quantidade inicial">
            <input type="number" min={0} className={inputCls} value={form.quantidade} onChange={(e) => set("quantidade", e.target.value)} />
          </Campo>
          <div className="sm:col-span-2">
            <Campo label="Observações">
              <input className={inputCls} value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
            </Campo>
          </div>
        </div>
        {erro && <p className="mt-3 text-sm font-semibold text-destructive">{erro}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={salvar}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase text-primary-foreground transition-opacity hover:opacity-90"
          >
            {editId ? "Salvar alterações" : "Cadastrar item"}
          </button>
          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setForm(vazio);
              }}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-bold uppercase text-foreground hover:bg-accent"
            >
              Cancelar
            </button>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <h2 className="mr-auto text-sm font-black uppercase tracking-wide text-foreground">
            Itens cadastrados
          </h2>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por norma, descrição, fabricante..."
            className={`${inputCls} max-w-xs`}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-surface text-xs font-black uppercase text-muted-foreground">
              <tr>
                {["Norma", "Cadastro", "Descrição", "Chave", "Face", "Ø", "Fabricante", "Estoque", "Pos.", "Qtd", "Obs.", ""].map(
                  (h) => (
                    <th key={h} className="px-3 py-2 text-left">{h}</th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-3 py-2 font-bold text-foreground">{i.norma}</td>
                  <td className="px-3 py-2 text-muted-foreground">{i.cadastro}</td>
                  <td className="px-3 py-2 font-semibold text-foreground">{i.descricao}</td>
                  <td className="px-3 py-2">{i.chave}</td>
                  <td className="px-3 py-2">{i.face}</td>
                  <td className="px-3 py-2">{i.diametro}</td>
                  <td className="px-3 py-2">{i.fabricante}</td>
                  <td className="px-3 py-2 font-bold">{i.estoque}</td>
                  <td className="px-3 py-2">{i.posicao}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-black ${
                        i.quantidade === 0
                          ? "bg-destructive text-destructive-foreground"
                          : i.quantidade <= 10
                            ? "bg-warning text-warning-foreground"
                            : "bg-success text-success-foreground"
                      }`}
                    >
                      {i.quantidade}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{i.observacoes}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => editar(i)} className="text-xs font-bold uppercase text-foreground underline">
                        Editar
                      </button>
                      <button onClick={() => removeItem(i.id)} className="text-xs font-bold uppercase text-destructive underline">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-3 py-8 text-center text-muted-foreground">
                    Nenhum item encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
