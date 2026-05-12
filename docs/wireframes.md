# Wireframes — pgm-acervo

Stack de referência: Next.js · shadcn/ui · Tailwind CSS

---

## Mapa de Telas

```
/login
/cadastro
/dashboard
/itens
/itens/novo
/itens/[id]
/itens/[id]/editar
/estrutura
/estrutura/[localId]
/estrutura/[localId]/[agrupadorId]
/configuracoes
```

---

## Layout Base (telas autenticadas)

Todas as telas autenticadas compartilham este shell:

```
┌──────────────────────────────────────────────────────────────────┐
│  pgm-acervo                                    [Marco ▾]  [🔔]   │  ← Header
├─────────────┬────────────────────────────────────────────────────┤
│             │                                                    │
│  Dashboard  │                                                    │
│  Itens      │            ÁREA DE CONTEÚDO                       │
│  Estrutura  │                                                    │
│  ────────── │                                                    │
│  Configurações                                                   │
│             │                                                    │
│             │                                                    │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
     Sidebar                    Main
   (colapsável)
```

- **Sidebar:** nav links com ícone + label; item ativo destacado; colapsável em mobile (drawer)
- **Header:** logo à esquerda, avatar + nome do usuário à direita com dropdown (Perfil, Sair)
- **Main:** padding interno, largura máxima com scroll vertical

---

## 1. Login — `/login`

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                   pgm-acervo                         │
│            Gestão de Acervo Profissional             │
│                                                      │
│         ┌────────────────────────────────┐           │
│         │  E-mail                        │           │
│         │  [______________________________]          │
│         │                                │           │
│         │  Senha                         │           │
│         │  [______________________________]          │
│         │                                │           │
│         │  [       Entrar com e-mail    ] │           │
│         │                                │           │
│         │  ─────────────  ou  ─────────  │           │
│         │                                │           │
│         │  [ G  Entrar com Google       ] │           │
│         │                                │           │
│         │  Não tem conta? Cadastre-se    │           │
│         └────────────────────────────────┘           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Componentes shadcn/ui:** `Card`, `Input`, `Button` (variant default + outline), `Separator`
**Ações:**
- "Entrar com e-mail" → valida campos → redireciona para `/dashboard`
- "Entrar com Google" → OAuth flow → `/dashboard`
- "Cadastre-se" → navega para `/cadastro`

---

## 2. Cadastro — `/cadastro`

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                   pgm-acervo                         │
│                Crie sua conta                        │
│                                                      │
│         ┌────────────────────────────────┐           │
│         │  Nome completo                 │           │
│         │  [______________________________]          │
│         │                                │           │
│         │  E-mail                        │           │
│         │  [______________________________]          │
│         │                                │           │
│         │  Senha                         │           │
│         │  [______________________________]          │
│         │                                │           │
│         │  [       Criar conta          ] │           │
│         │                                │           │
│         │  ─────────────  ou  ─────────  │           │
│         │                                │           │
│         │  [ G  Continuar com Google    ] │           │
│         │                                │           │
│         │  Já tem conta? Entrar          │           │
│         └────────────────────────────────┘           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 3. Dashboard — `/dashboard`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  Dashboard                                         │
│  Dashboard  │                                                    │
│  Itens      │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│  Estrutura  │  │ 48       │ │ 12       │ │  3       │ │  5   │ │
│  ────────── │  │ Itens    │ │ Slots    │ │ Locais   │ │ Sem  │ │
│  Config     │  │ no acervo│ │ em uso   │ │          │ │ slot │ │
│             │  └──────────┘ └──────────┘ └──────────┘ └──────┘ │
│             │                                                    │
│             │  ┌────────────────────────────────────────────┐   │
│             │  │ 🔍  Buscar itens...                    [🔍] │   │
│             │  └────────────────────────────────────────────┘   │
│             │                                                    │
│             │  Itens recentes                                    │
│             │  ┌─────────────────────────────────────────────┐  │
│             │  │ #IT001  Teste de Raven   📍 Casa › Armário › │  │
│             │  │         [alfabetização] [avaliação]  Prat. 1 │  │
│             │  ├─────────────────────────────────────────────┤  │
│             │  │ #IT002  Jogo da Memória  📍 Casa › Armário › │  │
│             │  │         [lúdico] [infantil]          Prat. 2 │  │
│             │  ├─────────────────────────────────────────────┤  │
│             │  │ #IT003  Relatório WISC   📍 — não alocado —  │  │
│             │  │         [digital] [avaliação]                │  │
│             │  └─────────────────────────────────────────────┘  │
│             │                                         Ver todos → │
└─────────────┴────────────────────────────────────────────────────┘
```

**Componentes:** `Card` (stats), `Input` (busca), tabela ou lista de itens recentes

---

## 4. Itens — `/itens`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  Itens                            [+ Novo item]    │
│  Dashboard  │                                                    │
│▶ Itens      │  ┌─────────────────────────────┐  ┌────────────┐  │
│  Estrutura  │  │ 🔍  Buscar por nome...       │  │ Tags  [▾]  │  │
│  ────────── │  └─────────────────────────────┘  └────────────┘  │
│  Config     │                                                    │
│             │  Filtros ativos: [alfabetização ×] [lúdico ×]     │
│             │                                                    │
│             │  ┌──────┬──────────────────┬────────────┬───────┐  │
│             │  │Código│ Nome             │ Localização│ Tags  │  │
│             │  ├──────┼──────────────────┼────────────┼───────┤  │
│             │  │IT001 │ Teste de Raven   │ Prat.1 ↗   │[alfa] │  │
│             │  │IT002 │ Jogo da Memória  │ Prat.2 ↗   │[lúd.] │  │
│             │  │IT003 │ Relatório WISC   │ — sem slot │[digit]│  │
│             │  │IT004 │ Blocos Lógicos   │ Prat.1 ↗   │[alfa] │  │
│             │  └──────┴──────────────────┴────────────┴───────┘  │
│             │                                                    │
│             │  Mostrando 4 de 48 itens     [ < ]  1  2  3  [ > ] │
└─────────────┴────────────────────────────────────────────────────┘
```

**Notas:**
- Dropdown "Tags" exibe lista de tags do usuário com checkbox para filtro múltiplo
- Clicar na linha → detalhe do item (`/itens/[id]`)
- Localização "↗" é link para o slot na Estrutura
- Paginação ou scroll infinito

---

## 5. Novo / Editar Item — `/itens/novo` e `/itens/[id]/editar`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  ← Voltar    Novo item                             │
│  Dashboard  │                                                    │
│▶ Itens      │  Nome *                                            │
│  Estrutura  │  [______________________________________________]   │
│  ────────── │                                                    │
│  Config     │  Descrição                                         │
│             │  [______________________________________________]   │
│             │  [______________________________________________]   │
│             │                                                    │
│             │  Tipo *                                            │
│             │  ( ) Físico   (•) Digital                          │
│             │                                                    │
│             │  ╔══ aparece somente se Tipo = Digital ══════════╗  │
│             │  ║  Arquivo digital                              ║  │
│             │  ║  [__URL do arquivo_________________________]  ║  │
│             │  ║  (campo exibido conforme config do perfil)   ║  │
│             │  ╚═══════════════════════════════════════════════╝  │
│             │                                                    │
│             │  Tags                                              │
│             │  [alfabetização ×] [avaliação ×] [digitar... ]    │
│             │   ↑ chips removíveis + input com autocomplete      │
│             │                                                    │
│             │  Slot (opcional)                                   │
│             │  Local [_____________▾]  Agrupador [_______▾]      │
│             │  Slot  [_____________▾]                            │
│             │                                                    │
│             │  [  Cancelar  ]              [  Salvar item  ]     │
└─────────────┴────────────────────────────────────────────────────┘
```

**Variante do campo digital conforme configuração do perfil:**

```
  Preferência = link:
  ┌─ Arquivo digital ───────────────────────────┐
  │  URL  [https://drive.google.com/file/...]   │
  └─────────────────────────────────────────────┘

  Preferência = upload:
  ┌─ Arquivo digital ───────────────────────────┐
  │  ┌─────────────────────────────────────┐   │
  │  │  📄  Arraste um PDF ou clique aqui  │   │
  │  │       (máx. 50 MB)                  │   │
  │  └─────────────────────────────────────┘   │
  └─────────────────────────────────────────────┘
```

---

## 6. Detalhe do Item — `/itens/[id]`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  ← Voltar aos itens              [Editar] [Remover]│
│  Dashboard  │                                                    │
│▶ Itens      │  Teste de Raven                  Código: #IT001   │
│  Estrutura  │  ─────────────────────────────────────────────     │
│  ────────── │  Tipo: Físico                                      │
│  Config     │                                                    │
│             │  Descrição                                         │
│             │  Conjunto de pranchas para avaliação de            │
│             │  inteligência não verbal.                          │
│             │                                                    │
│             │  Tags                                              │
│             │  [avaliação]  [inteligência]  [não-verbal]         │
│             │                                                    │
│             │  Localização                                       │
│             │  ┌─────────────────────────────────────────────┐  │
│             │  │  🏠 Casa  ›  🗄 Armário da Sala  ›  📦 Prat. 1 │  │
│             │  │  Código do slot: #SL003                      │  │
│             │  └─────────────────────────────────────────────┘  │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

**Variante quando item é digital (link):**
```
│  Arquivo digital                                               │
│  🔗 https://drive.google.com/file/abc123   [Abrir ↗]          │
```

**Variante quando item é digital (upload):**
```
│  Arquivo digital                                               │
│  📄 relatorio-wisc-2024.pdf                [Baixar ↓]         │
```

---

## 7. Estrutura — `/estrutura`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  Estrutura                        [+ Novo local]   │
│  Dashboard  │                                                    │
│  Itens      │  ┌──────────────────────────────────────────────┐  │
│▶ Estrutura  │  │  🏠  Casa                                [▸]  │  │
│  ────────── │  │  3 agrupadores · 12 slots                    │  │
│  Config     │  └──────────────────────────────────────────────┘  │
│             │                                                    │
│             │  ┌──────────────────────────────────────────────┐  │
│             │  │  🏢  Consultório                         [▸]  │  │
│             │  │  1 agrupador · 5 slots                       │  │
│             │  └──────────────────────────────────────────────┘  │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

Clicar em um card → `/estrutura/[localId]`

---

## 8. Local (agrupadores) — `/estrutura/[localId]`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  Estrutura › Casa             [+ Novo agrupador]   │
│  Dashboard  │                                                    │
│  Itens      │  ┌──────────────────────────────────────────────┐  │
│▶ Estrutura  │  │  🗄  Armário da Sala                     [▸]  │  │
│  ────────── │  │  5 slots · 18 itens alocados                 │  │
│  Config     │  └──────────────────────────────────────────────┘  │
│             │                                                    │
│             │  ┌──────────────────────────────────────────────┐  │
│             │  │  📚  Estante do Escritório               [▸]  │  │
│             │  │  4 slots · 9 itens alocados                  │  │
│             │  └──────────────────────────────────────────────┘  │
│             │                                                    │
│             │  ┌──────────────────────────────────────────────┐  │
│             │  │  📦  Caixa Organizadora                 [▸]  │  │
│             │  │  3 slots · 4 itens alocados                  │  │
│             │  └──────────────────────────────────────────────┘  │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

---

## 9. Agrupador (slots) — `/estrutura/[localId]/[agrupadorId]`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  Estrutura › Casa › Armário da Sala   [+ Novo slot]│
│  Dashboard  │                                                    │
│  Itens      │  ┌────────────┐ ┌────────────┐ ┌────────────┐     │
│▶ Estrutura  │  │ #SL001     │ │ #SL002     │ │ #SL003     │     │
│  ────────── │  │ Prateleira │ │ Prateleira │ │ Prateleira │     │
│  Config     │  │ Superior   │ │ do Meio    │ │ Inferior   │     │
│             │  │            │ │            │ │            │     │
│             │  │ 4 itens    │ │ 7 itens    │ │ 3 itens    │     │
│             │  │ [Ver ↗]    │ │ [Ver ↗]    │ │ [Ver ↗]    │     │
│             │  └────────────┘ └────────────┘ └────────────┘     │
│             │                                                    │
│             │  ┌────────────┐ ┌────────────┐                     │
│             │  │ #SL004     │ │ #SL005     │                     │
│             │  │ Gaveta     │ │ Gaveta     │                     │
│             │  │ Esquerda   │ │ Direita    │                     │
│             │  │            │ │            │                     │
│             │  │ 2 itens    │ │ 2 itens    │                     │
│             │  │ [Ver ↗]    │ │ [Ver ↗]    │                     │
│             │  └────────────┘ └────────────┘                     │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

"Ver ↗" filtra a tela de Itens pelo slot selecionado.

---

## 10. Configurações — `/configuracoes`

```
┌─────────────┬────────────────────────────────────────────────────┐
│             │  Configurações                                     │
│  Dashboard  │                                                    │
│  Itens      │  Perfil                                            │
│  Estrutura  │  ────────────────────────────────────────────      │
│▶ Config     │  Nome                                              │
│             │  [Marco Antonio______________________________]      │
│             │                                                    │
│             │  E-mail                                            │
│             │  [marco@email.com____________________________]      │
│             │                                                    │
│             │  [  Salvar perfil  ]                               │
│             │                                                    │
│             │                                                    │
│             │  Itens digitais                                    │
│             │  ────────────────────────────────────────────      │
│             │  Como prefere informar o arquivo de um item        │
│             │  digital?                                          │
│             │                                                    │
│             │  (•) Link externo (URL)                            │
│             │      Informe um link do Google Drive, Dropbox etc. │
│             │                                                    │
│             │  ( ) Upload de arquivo (PDF)                       │
│             │      Envie o arquivo direto para o sistema         │
│             │      (máx. 50 MB por arquivo, Cloudflare R2)       │
│             │                                                    │
│             │  [  Salvar preferência  ]                          │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

---

## Fluxo de Navegação

```
/login ──────────────────────────────→ /dashboard
/cadastro ───────────────────────────→ /dashboard

/dashboard
  ├─ busca rápida ──────────────────→ /itens?q=...
  └─ "Ver todos" ───────────────────→ /itens

/itens
  ├─ [+ Novo item] ─────────────────→ /itens/novo
  ├─ clicar na linha ───────────────→ /itens/[id]
  └─ localização "↗" ───────────────→ /estrutura/[localId]/[agrupadorId]

/itens/[id]
  ├─ [Editar] ──────────────────────→ /itens/[id]/editar
  └─ [Remover] → confirmação → ──────→ /itens

/estrutura
  └─ clicar no local ───────────────→ /estrutura/[localId]

/estrutura/[localId]
  └─ clicar no agrupador ───────────→ /estrutura/[localId]/[agrupadorId]

/estrutura/[localId]/[agrupadorId]
  └─ "Ver ↗" num slot ──────────────→ /itens?slotId=...
```

---

## Estados Especiais

### Tela vazia — primeiro acesso em /itens
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                    📦                                │
│         Seu acervo ainda está vazio                  │
│                                                      │
│    Comece cadastrando sua primeira estrutura         │
│    de armazenamento ou adicione um item.             │
│                                                      │
│    [  Criar estrutura  ]   [  Adicionar item  ]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Busca sem resultado
```
┌──────────────────────────────────────────────────────┐
│  🔍  Nenhum item encontrado para "xilofone"          │
│       Tente outros termos ou remova os filtros.      │
└──────────────────────────────────────────────────────┘
```

### Modal de confirmação de remoção
```
┌────────────────────────────────────┐
│  Remover item?                     │
│                                    │
│  "Teste de Raven" será removido    │
│  permanentemente. Esta ação não    │
│  pode ser desfeita.                │
│                                    │
│  [  Cancelar  ]  [  Sim, remover  ]│
└────────────────────────────────────┘
```
