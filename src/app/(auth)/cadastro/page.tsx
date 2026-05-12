import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/auth"
import { AuthForm } from "@/components/auth/auth-form"

export default function CadastroPage() {
  return (
    <AuthForm
      mode="signup"
      action={async (formData: FormData) => {
        "use server"
        const name = String(formData.get("name") ?? "").trim()
        const email = String(formData.get("email") ?? "").trim()
        const password = String(formData.get("password") ?? "")

        if (!name || !email || password.length < 6) return

        const exists = await prisma.user.findUnique({ where: { email } })
        if (exists) return

        const passwordHash = await bcrypt.hash(password, 12)
        await prisma.user.create({ data: { name, email, passwordHash } })

        await signIn("credentials", { email, password, redirectTo: "/dashboard" })
      }}
      googleAction={async () => {
        "use server"
        await signIn("google", { redirectTo: "/dashboard" })
      }}
    />
  )
}
