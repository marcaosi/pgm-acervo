# Requisitos — pgm-acervo

## Visão Geral do Produto

**pgm-acervo** é um SaaS para gestão de acervos pessoais de uso profissional. Permite que profissionais (ex: psicopedagogas, terapeutas, educadores) organizem seus materiais físicos e digitais em estruturas hierárquicas de armazenamento, localizem itens por busca textual ou filtro por tags e identifiquem fisicamente cada item e local por meio de códigos gerados automaticamente.

**Stack:** Next.js · PostgreSQL (Prisma) · Tailwind CSS · Cloudflare R2

---

## Requisitos Funcionais — MVP

### RF01 — Autenticação e Multi-tenancy

| # | Requisito |
|---|---|
| RF01.1 | Usuário pode se cadastrar com e-mail e senha |
| RF01.2 | Usuário pode fazer login com e-mail/senha ou conta Google (OAuth 2.0) |
| RF01.3 | Usuário pode fazer logout |
| RF01.4 | Cada usuário só acessa e gerencia seus próprios dados (isolamento total por tenant) |
| RF01.5 | Usuário pode editar seu perfil (nome, e-mail) |

### RF02 — Configurações do Perfil

| # | Requisito |
|---|---|
| RF02.1 | Usuário configura preferência para itens digitais: **link externo** ou **upload para Cloudflare R2** |
| RF02.2 | A preferência definida afeta o formulário de cadastro de itens digitais em todo o sistema |

### RF03 — Gestão de Locais, Agrupadores e Slots

| # | Requisito |
|---|---|
| RF03.1 | Usuário pode cadastrar **Locais** (ex: Casa, Consultório) |
| RF03.2 | Dentro de um Local, pode cadastrar **Agrupadores** (ex: Armário da Sala, Estante) |
| RF03.3 | Dentro de um Agrupador, pode cadastrar **Slots** (ex: Prateleira 1, Gaveta Superior) |
| RF03.4 | Cada Slot recebe um **código alfanumérico único** gerado automaticamente no cadastro |
| RF03.5 | Usuário pode editar e remover Locais, Agrupadores e Slots |
| RF03.6 | Remoção de um Slot com itens alocados deve exigir confirmação explícita |

### RF04 — Gestão de Itens

| # | Requisito |
|---|---|
| RF04.1 | Usuário pode cadastrar um Item com: nome, descrição, tipo (físico ou digital), tags e slot |
| RF04.2 | Cada Item recebe um **código alfanumérico único** gerado automaticamente no cadastro |
| RF04.3 | Para itens digitais com preferência **link**: exibir campo de URL |
| RF04.4 | Para itens digitais com preferência **upload**: exibir campo para envio de arquivo PDF, armazenado no Cloudflare R2 |
| RF04.5 | Usuário pode editar e remover itens |
| RF04.6 | Um item pode ser cadastrado sem slot atribuído (estado: "não alocado") |

### RF05 — Tags

| # | Requisito |
|---|---|
| RF05.1 | Tags são criadas livremente em texto no momento do cadastro do item |
| RF05.2 | Um item pode ter múltiplas tags |
| RF05.3 | Tags existentes são sugeridas via autocomplete ao digitar |

### RF06 — Busca e Filtro

| # | Requisito |
|---|---|
| RF06.1 | Usuário pode buscar itens por nome ou descrição (busca textual) |
| RF06.2 | Usuário pode filtrar itens por uma ou mais tags |
| RF06.3 | Resultados exibem: nome do item, tags e localização completa (Local › Agrupador › Slot) |
| RF06.4 | Busca textual e filtro por tag podem ser combinados simultaneamente |

---

## Requisitos Não Funcionais — MVP

| # | Requisito |
|---|---|
| RNF01 | **Isolamento de dados:** nenhum usuário pode acessar dados de outro em qualquer rota ou query |
| RNF02 | **Performance:** busca e filtro retornam resultados em menos de 2 segundos para acervos de até 10.000 itens; índices criados para nome e tags |
| RNF03 | **Upload:** arquivos PDF com limite de 50 MB; upload direto para Cloudflare R2 (sem trafegar pelo servidor) |
| RNF04 | **Usabilidade:** interface responsiva (desktop e mobile); formulários com validação em tempo real |
| RNF05 | **Manutenibilidade:** TypeScript estrito; separação clara entre camadas (UI, server actions, banco) |

---

## Fora do Escopo do MVP

- Impressão de etiquetas e geração de QR Code
- Compartilhamento de acervo entre usuários
- Importação/exportação em massa (CSV, Excel)
- Aplicativo mobile nativo
- API pública para terceiros
- Planos e cobrança (billing/subscription)

---

## Glossário

| Termo | Definição |
|---|---|
| **Local** | Espaço físico de nível mais alto (ex: Casa, Consultório) |
| **Agrupador** | Estrutura dentro de um Local que agrupa Slots (ex: Armário, Estante) |
| **Slot** | Posição específica dentro de um Agrupador (ex: Prateleira 2, Gaveta Central) |
| **Item** | Objeto físico ou arquivo digital cadastrado no acervo |
| **Tag** | Palavra-chave associada a um item usada em busca e filtro |
| **Código** | Identificador alfanumérico único gerado automaticamente para Slots e Itens, usado em etiquetas |
| **Tenant** | Usuário com dados completamente isolados dos demais no sistema |
