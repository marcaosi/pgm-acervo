import { Toaster } from "sonner"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { EmailBanner } from "@/components/layout/email-banner"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const userId = session?.user?.id
  const showBanner = userId
    ? !(await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } }))
        ?.emailVerified
    : false

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {showBanner && <EmailBanner />}
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
