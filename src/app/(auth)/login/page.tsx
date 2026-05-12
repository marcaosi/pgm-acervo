import { signIn } from "@/auth"
import { AuthForm } from "@/components/auth/auth-form"

export default function LoginPage() {
  return (
    <AuthForm
      mode="login"
      action={async (formData: FormData) => {
        "use server"
        await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirectTo: "/dashboard",
        })
      }}
      googleAction={async () => {
        "use server"
        await signIn("google", { redirectTo: "/dashboard" })
      }}
    />
  )
}
