import Link from "next/link"
import {
  MapPin,
  Tag,
  Search,
  FileDigit,
  ArrowRight,
  Box,
  Layers,
  CheckCircle2,
} from "lucide-react"

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="font-bold text-emerald-800 text-lg tracking-tight">pgm-acervo</span>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex h-8 items-center rounded-full bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800 transition-colors"
          >
            Começar grátis
          </Link>
        </nav>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-gradient-to-b from-emerald-50 via-white to-white py-20 px-6 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-800 mb-6">
          Gestão de acervo profissional
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
          Organize seus materiais.{" "}
          <span className="text-emerald-700">Encontre na hora.</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          Cadastre, localize e gerencie seus materiais físicos e digitais em um só lugar.
          Nunca mais perca tempo procurando onde está aquele teste, jogo ou recurso.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-800 transition-colors"
          >
            Criar conta gratuita
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Mockup visual */}
        <div className="mt-14 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-slate-50">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-slate-400">pgm-acervo.vercel.app</span>
          </div>
          <div className="grid grid-cols-4 gap-px bg-slate-100 text-left text-sm">
            <div className="col-span-1 bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase">Menu</p>
              {["Dashboard", "Itens", "Estrutura", "Configurações"].map((item, i) => (
                <div
                  key={item}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    i === 1 ? "bg-emerald-50 text-emerald-800" : "text-slate-500"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="col-span-3 bg-white p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">Itens do acervo</p>
                <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs text-white">
                  + Novo item
                </span>
              </div>
              <div className="rounded-lg border bg-slate-50 px-3 py-2 text-slate-400 text-xs">
                🔍  Buscar por nome...
              </div>
              <div className="flex gap-2 flex-wrap">
                {["alfabetização", "avaliação", "lúdico", "motor"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {[
                { code: "IT-A3K9F", name: "Teste de Raven", local: "Casa › Armário › Prat. 1", tags: ["avaliação"] },
                { code: "IT-B7X2Q", name: "Jogo da Memória", local: "Casa › Armário › Prat. 2", tags: ["lúdico"] },
                { code: "IT-C1M8R", name: "Blocos Lógicos", local: "Casa › Estante › Gaveta", tags: ["alfabetização"] },
              ].map((item) => (
                <div key={item.code} className="flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5">
                  <span className="font-mono text-xs text-slate-400 shrink-0">{item.code}</span>
                  <span className="flex-1 text-sm font-medium text-slate-700 truncate">{item.name}</span>
                  <span className="text-xs text-slate-400 truncate hidden sm:block">📍 {item.local}</span>
                  <div className="flex gap-1">
                    {item.tags.map((t) => (
                      <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  {
    icon: MapPin,
    color: "bg-emerald-100 text-emerald-700",
    title: "Localização precisa",
    description:
      "Organize em locais, agrupadores e slots. Cada item tem um endereço físico dentro da sua casa ou consultório.",
  },
  {
    icon: Tag,
    color: "bg-teal-100 text-teal-700",
    title: "Busca por tags",
    description:
      "Associe palavras-chave a cada item. Filtre por uma ou mais tags e encontre tudo que precisa em segundos.",
  },
  {
    icon: FileDigit,
    color: "bg-green-100 text-green-700",
    title: "Itens digitais",
    description:
      "Além dos materiais físicos, armazene links e PDFs. O acervo físico e digital em um só lugar.",
  },
  {
    icon: Search,
    color: "bg-lime-100 text-lime-700",
    title: "Busca instantânea",
    description:
      "Digite o nome ou filtre por tags e veja exatamente onde o item está localizado, sem precisar lembrar.",
  },
]

function Features() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tudo que você precisa para organizar
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Pensado para profissionais que trabalham com muitos materiais e precisam de agilidade no dia a dia.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, color, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex rounded-xl p-3 mb-4 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Como funciona ────────────────────────────────────────────────────────────

const steps = [
  {
    icon: Layers,
    number: "01",
    color: "bg-emerald-50 text-emerald-700",
    title: "Crie sua estrutura",
    description:
      "Cadastre os locais da sua casa ou consultório, adicione agrupadores (armários, estantes) e slots (prateleiras, gavetas).",
  },
  {
    icon: Box,
    number: "02",
    color: "bg-teal-50 text-teal-700",
    title: "Cadastre seus itens",
    description:
      "Adicione nome, descrição e tags a cada item. Informe o slot onde está guardado — físico ou digital.",
  },
  {
    icon: Search,
    number: "03",
    color: "bg-green-50 text-green-700",
    title: "Encontre na hora",
    description:
      "Busque por nome ou filtre por tags. O sistema mostra exatamente onde o item está localizado.",
  },
]

function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Como funciona</h2>
          <p className="mt-3 text-slate-500">Três passos para ter seu acervo organizado.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, number, color, title, description }) => (
            <div key={number} className="relative">
              <div className={`inline-flex rounded-2xl p-4 mb-4 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="absolute top-0 right-0 text-5xl font-black text-slate-100 select-none leading-none">
                {number}
              </span>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Para quem é ──────────────────────────────────────────────────────────────

const profiles = [
  {
    emoji: "🧩",
    title: "Psicopedagogas",
    items: ["Testes de avaliação", "Jogos e brinquedos", "Materiais de alfabetização", "Fichas e relatórios digitais"],
  },
  {
    emoji: "🩺",
    title: "Terapeutas",
    items: ["Recursos terapêuticos", "Materiais sensoriais", "Fichas e protocolos", "Apostilas digitais"],
  },
  {
    emoji: "📚",
    title: "Educadores",
    items: ["Material didático", "Jogos pedagógicos", "Recursos audiovisuais", "Planos de aula digitais"],
  },
  {
    emoji: "🗂",
    title: "Profissionais em geral",
    items: ["Qualquer acervo físico", "Documentos digitais", "Equipamentos e ferramentas", "Materiais de escritório"],
  },
]

function ForWhom() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Para quem é</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Ideal para qualquer profissional que precisa organizar e localizar materiais rapidamente.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map(({ emoji, title, items }) => (
            <div key={title} className="rounded-2xl border bg-white p-6 shadow-sm">
              <span className="text-3xl mb-3 block">{emoji}</span>
              <h3 className="font-semibold text-slate-900 mb-3">{title}</h3>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA final ────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-emerald-700 to-teal-600">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white">Pronto para organizar seu acervo?</h2>
        <p className="mt-4 text-emerald-100">
          Crie sua conta gratuitamente e comece a organizar seus materiais agora mesmo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-800 shadow hover:bg-emerald-50 transition-colors"
          >
            Criar conta gratuita
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t bg-white py-8 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <span className="font-semibold text-emerald-800">pgm-acervo</span>
        <span>© {new Date().getFullYear()} pgm-acervo. Todos os direitos reservados.</span>
        <div className="flex gap-4">
          <Link href="/login" className="hover:text-slate-700 transition-colors">Entrar</Link>
          <Link href="/cadastro" className="hover:text-slate-700 transition-colors">Cadastrar</Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <ForWhom />
      <CtaSection />
      <Footer />
    </div>
  )
}
