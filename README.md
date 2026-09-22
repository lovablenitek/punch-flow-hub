# PROJETO PUNÇÕES

Vamos construir um sistema web de controle de estoque industrial em React e Tailwind CSS. Siga estritamente as regras de negócio, os 3 perfis de acesso e as telas de cadastro, entrada (com filtros em cascata) e saída (iniciando pela norma) descritas no prompt a seguir.

Crie um sistema web completo e responsivo de controle de estoque de punções industriais ("Nitek - Produtos para Fixação"), desenvolvido com React, Tailwind CSS e componentes limpos e modernos. O sistema deve possuir controle de autenticação/acessos com 3 perfis distintos e seguir rigorosamente a lógica de três telas principais baseadas em planilhas operacionais:

### 1. Sistema de Permissões e Níveis de Acesso

Crie um seletor de perfil simples na aplicação (ou tela de login simulada) com 3 níveis de acesso restritos:

- Perfil 1 (Cadastro e Entrada): Acesso total à tela de Cadastro de Itens e à tela de Entrada de Materiais.

- Perfil 2 (Compras/Reposição): Acesso dedicado à gestão de compras e pendências de chegada (integrado na tela de entrada).

- Perfil 3 (Saída / Chão de Fábrica): Acesso exclusivo à tela de Consulta e Saída de Materiais (este perfil NÃO tem acesso ao cadastro nem à entrada, sendo restrito apenas à baixa de estoque).

---

### 2. Estrutura de Dados (Banco / Estado Global)

O sistema deve gerenciar uma tabela central de itens de punção contendo os seguintes campos obrigatórios para cada registro:

- Norma (ex: PA0001, PA0114)

- Código de Cadastro / ID

- Descrição / Código do Punção (ex: DIN 7982 M3,5, DIN 7982 M4,2)

- Tipo de Chave / Fenda (ex: PHS, PZD, RETA, TORX, HEX, COMB)

- Face (ex: RETO, CÔCAVO, PINO)

- Diâmetro (ex: 14, 18, 4.9, etc.)

- Fabricante (ex: YUTA, KS, FX, AJK, etc.)

- Estoque / Localização (ex: N1, M2, L3, C4, etc.)

- Posição numérica no estoque (ex: 62, 112)

- Quantidade atual em estoque

- Observações

---

### 3. Telas e Funcionalidades

#### A. Tela de Cadastro de Itens (Acessível pelos Perfis 1 e 2)

- Uma tabela/grid estilo planilha limpa mostrando todos os itens cadastrados.

- Formulário para cadastro manual item por item contendo todos os campos descritos na estrutura de dados (Norma, Cadastro, Descrição, Chave, Face, Diâmetro, Fabricante, Estoque, Posição e Quantidade Inicial).

- Capacidade de adicionar, editar e excluir itens do estoque base.

#### B. Tela de Entrada de Materiais (Acessível pelo Perfil 1)

- Inspirada na operação visual da primeira imagem fornecida.

- Filtros em cascata (Selects dinâmicos) para localizar o item com precisão:

  1. Código do Punção / Descrição

  2. Tipo de Chave

  3. Diâmetro

  4. Face

  5. Fabricante

- Ao selecionar os filtros, o sistema exibe automaticamente a localização exata do item (Estoque e Posição) e a quantidade atual.

- Campo de seleção "Quantidade de Entrada".

- Botão verde grande de destaque escrito "ENTRADA" que atualiza somando a quantidade ao estoque correspondente e registra o histórico (data/hora, responsável, quantidade).

- Seção lateral/inferior de "COMPRAS JÁ REALIZADAS E PENDENTES DE CHEGADA" para acompanhar pedidos de reposição.

#### C. Tela de Consulta e Saída de Materiais (Acessível pelos Perfis 1 e 3)

- Inspirada na operação visual da segunda imagem fornecida (foco em agilidade para o operador de chão de fábrica).

- A busca é iniciada **primeiro pela NORMA**, conforme solicitado:

  1. Seleção da Norma (ex: PA0114).

  2. Filtro automático e restrito de Diâmetro, Fabricante e Opções de Punções vinculadas àquela Norma específica.

- Exibição clara da localização exata do item no estoque (ex: Estoque M2, Posição 112) e do "Total Disponível".

- Painel superior de "Últimas Movimentações" registrando as saídas recentes.

- Seletor de "Quantidade Retirada".

- Botão vermelho grande de destaque escrito "SAÍDA" que efetua a baixa no estoque correspondente, impedindo que o estoque zere sem aviso e registrando a data/hora e o responsável pela retirada.

---

### 4. Requisitos de UX/UI

- Interface limpa, profissional, objetiva e intuitiva, com excelente contraste para uso industrial/fabril.

- Cores indicativas claras (Verde para botões de entrada/sucesso, Vermelho para botões de saída/ação crítica).

- Layout responsivo e rápido, focado em evitar cliques desnecessários e agilizar o controle para que nenhum item zere no estoque.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://punch-flow-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2209c956-0bb4-457b-800c-9c0a4bc717f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
