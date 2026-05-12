import { auth } from "@/auth"
import { NextResponse } from "next/server"

const publicRoutes = ["/", "/login", "/cadastro"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = publicRoutes.includes(pathname)

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Usuário autenticado na landing ou nas páginas de auth → dashboard
  if (req.auth && (pathname === "/" || isPublic)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
