import Link from "next/link"
import { verifyEmail } from "@/actions/email-verification"

interface Props {
  params: Promise<{ token: string }>
}

export default async function VerificarEmailPage({ params }: Props) {
  const { token } = await params
  const result = await verifyEmail(token)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-4 rounded-xl border bg-card p-8 shadow-sm">
        {result.success ? (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="text-xl font-bold">E-mail confirmado!</h1>
            <p className="text-sm text-muted-foreground">
              Seu e-mail foi verificado com sucesso.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ir para o Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="text-5xl">⚠️</div>
            <h1 className="text-xl font-bold">Link inválido</h1>
            <p className="text-sm text-muted-foreground">{result.error}</p>
            <Link
              href="/dashboard"
              className="inline-block text-sm text-primary hover:underline"
            >
              Voltar ao Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
