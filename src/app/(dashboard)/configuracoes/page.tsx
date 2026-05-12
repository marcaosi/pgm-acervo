import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/configuracoes/profile-form"
import { PreferenceForm } from "@/components/configuracoes/preference-form"

export default async function ConfiguracoesPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [user, settings] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.userSettings.findUnique({ where: { userId } }),
  ])

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seu perfil e preferências.</p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Perfil</h2>
          <p className="text-sm text-muted-foreground">Seu nome e e-mail de acesso.</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <ProfileForm user={{ name: user.name, email: user.email ?? "" }} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Itens digitais</h2>
          <p className="text-sm text-muted-foreground">
            Como prefere informar o arquivo de um item digital no cadastro.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <PreferenceForm current={settings?.digitalItemPreference ?? "LINK"} />
        </div>
      </section>
    </div>
  )
}
