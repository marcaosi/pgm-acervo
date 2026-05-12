import { auth, signOut } from "@/auth"

export async function Header() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-background sticky top-0 z-10">
      <div />
      <div className="flex items-center gap-3">
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.name ?? user?.email}
            </span>
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sair
            </button>
          </div>
        </form>
      </div>
    </header>
  )
}
