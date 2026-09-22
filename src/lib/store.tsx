import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Perfil = "1" | "2" | "3";

export type Item = {
  id: string;
  norma: string;
  cadastro: string;
  descricao: string;
  chave: string;
  face: string;
  diametro: string;
  fabricante: string;
  estoque: string;
  posicao: string;
  quantidade: number;
  observacoes: string;
};

export type Movimento = {
  id: string;
  itemId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  responsavel: string;
  descricao: string;
  norma: string;
  local: string;
};

export type Compra = {
  id: string;
  norma: string;
  descricao: string;
  fornecedor: string;
  quantidade: number;
  dataPedido: string;
  status: "pendente" | "recebido";
};

const uid = () => Math.random().toString(36).slice(2, 10);

const seedItens: Item[] = [
  ["PA0001", "10001", "DIN 7982 M3,5", "PHS", "RETO", "14", "YUTA", "N1", "62", 120],
  ["PA0001", "10002", "DIN 7982 M3,5", "PZD", "CÔCAVO", "14", "KS", "N1", "63", 42],
  ["PA0002", "10003", "DIN 7982 M4,2", "PHS", "RETO", "18", "FX", "M2", "110", 8],
  ["PA0114", "10004", "DIN 7982 M4,8", "TORX", "PINO", "4.9", "AJK", "M2", "112", 64],
  ["PA0114", "10005", "DIN 7982 M4,8", "HEX", "RETO", "18", "YUTA", "L3", "27", 3],
  ["PA0220", "10006", "DIN 965 M5", "COMB", "CÔCAVO", "22", "KS", "C4", "15", 210],
  ["PA0220", "10007", "DIN 965 M5", "RETA", "RETO", "22", "FX", "C4", "16", 0],
  ["PA0345", "10008", "DIN 7504 M6,3", "PZD", "PINO", "26", "AJK", "L3", "44", 35],
].map(
  ([norma, cadastro, descricao, chave, face, diametro, fabricante, estoque, posicao, quantidade]) => ({
    id: uid(),
    norma: norma as string,
    cadastro: cadastro as string,
    descricao: descricao as string,
    chave: chave as string,
    face: face as string,
    diametro: diametro as string,
    fabricante: fabricante as string,
    estoque: estoque as string,
    posicao: posicao as string,
    quantidade: quantidade as number,
    observacoes: "",
  }),
);

const seedCompras: Compra[] = [
  {
    id: uid(),
    norma: "PA0002",
    descricao: "DIN 7982 M4,2 - PHS 18 FX",
    fornecedor: "FX Ferramentas",
    quantidade: 200,
    dataPedido: "2026-09-10T13:00:00.000Z",
    status: "pendente",
  },
  {
    id: uid(),
    norma: "PA0220",
    descricao: "DIN 965 M5 - RETA 22 FX",
    fornecedor: "Distribuidora KS",
    quantidade: 500,
    dataPedido: "2026-09-15T16:30:00.000Z",
    status: "pendente",
  },
  {
    id: uid(),
    norma: "PA0114",
    descricao: "DIN 7982 M4,8 - HEX 18 YUTA",
    fornecedor: "Yuta Brasil",
    quantidade: 150,
    dataPedido: "2026-09-01T11:00:00.000Z",
    status: "recebido",
  },
];

type Ctx = {
  perfil: Perfil | null;
  responsavel: string;
  entrar: (perfil: Perfil, responsavel: string) => void;
  sair: () => void;
  itens: Item[];
  movimentos: Movimento[];
  compras: Compra[];
  addItem: (item: Omit<Item, "id">) => void;
  updateItem: (id: string, item: Omit<Item, "id">) => void;
  removeItem: (id: string) => void;
  registrarEntrada: (itemId: string, qtd: number) => void;
  registrarSaida: (itemId: string, qtd: number) => { ok: boolean; erro?: string };
  addCompra: (c: Omit<Compra, "id" | "status">) => void;
  receberCompra: (id: string) => void;
  removeCompra: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

const KEY = "nitek-estoque-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [responsavel, setResponsavel] = useState("");
  const [itens, setItens] = useState<Item[]>(seedItens);
  const [movimentos, setMovimentos] = useState<Movimento[]>([]);
  const [compras, setCompras] = useState<Compra[]>(seedCompras);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.itens) setItens(d.itens);
        if (d.movimentos) setMovimentos(d.movimentos);
        if (d.compras) setCompras(d.compras);
        if (d.perfil) setPerfil(d.perfil);
        if (d.responsavel) setResponsavel(d.responsavel);
      }
    } catch {
      /* ignora */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      KEY,
      JSON.stringify({ itens, movimentos, compras, perfil, responsavel }),
    );
  }, [hydrated, itens, movimentos, compras, perfil, responsavel]);

  const logMov = useCallback(
    (item: Item, tipo: "entrada" | "saida", quantidade: number, quem: string) => {
      setMovimentos((prev) =>
        [
          {
            id: uid(),
            itemId: item.id,
            tipo,
            quantidade,
            data: new Date().toISOString(),
            responsavel: quem || "Não informado",
            descricao: `${item.descricao} · ${item.chave} · Ø${item.diametro} · ${item.fabricante}`,
            norma: item.norma,
            local: `${item.estoque} / ${item.posicao}`,
          },
          ...prev,
        ].slice(0, 200),
      );
    },
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      perfil,
      responsavel,
      entrar: (p, quem) => {
        setPerfil(p);
        setResponsavel(quem);
      },
      sair: () => setPerfil(null),
      itens,
      movimentos,
      compras,
      addItem: (item) => setItens((prev) => [...prev, { ...item, id: uid() }]),
      updateItem: (id, item) =>
        setItens((prev) => prev.map((i) => (i.id === id ? { ...item, id } : i))),
      removeItem: (id) => setItens((prev) => prev.filter((i) => i.id !== id)),
      registrarEntrada: (itemId, qtd) => {
        const item = itens.find((i) => i.id === itemId);
        if (!item || qtd <= 0) return;
        setItens((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, quantidade: i.quantidade + qtd } : i)),
        );
        logMov(item, "entrada", qtd, responsavel);
      },
      registrarSaida: (itemId, qtd) => {
        const item = itens.find((i) => i.id === itemId);
        if (!item) return { ok: false, erro: "Item não encontrado." };
        if (qtd <= 0) return { ok: false, erro: "Informe uma quantidade válida." };
        if (qtd > item.quantidade)
          return {
            ok: false,
            erro: `Saldo insuficiente: disponível ${item.quantidade} peça(s).`,
          };
        setItens((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, quantidade: i.quantidade - qtd } : i)),
        );
        logMov(item, "saida", qtd, responsavel);
        return { ok: true };
      },
      addCompra: (c) => setCompras((prev) => [{ ...c, id: uid(), status: "pendente" }, ...prev]),
      receberCompra: (id) =>
        setCompras((prev) => prev.map((c) => (c.id === id ? { ...c, status: "recebido" } : c))),
      removeCompra: (id) => setCompras((prev) => prev.filter((c) => c.id !== id)),
    }),
    [perfil, responsavel, itens, movimentos, compras, logMov],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}

export const PERFIS: Record<Perfil, { nome: string; descricao: string; rotas: string[] }> = {
  "1": {
    nome: "Perfil 1 — Cadastro e Entrada",
    descricao: "Cadastro de itens, entrada de materiais e consulta/saída.",
    rotas: ["/cadastro", "/entrada", "/saida"],
  },
  "2": {
    nome: "Perfil 2 — Compras / Reposição",
    descricao: "Cadastro de itens e gestão de compras e pendências de chegada.",
    rotas: ["/cadastro", "/compras"],
  },
  "3": {
    nome: "Perfil 3 — Saída / Chão de Fábrica",
    descricao: "Consulta e baixa de estoque apenas.",
    rotas: ["/saida"],
  },
};

export function podeAcessar(perfil: Perfil | null, rota: string) {
  if (!perfil) return false;
  return PERFIS[perfil].rotas.includes(rota);
}

export const fmtData = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
