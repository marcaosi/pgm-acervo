import { Resend } from "resend"

// Inicialização lazy para não quebrar quando RESEND_API_KEY não está configurado
let _resend: Resend | null = null
function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM = process.env.EMAIL_FROM ?? "pgm-acervo <onboarding@resend.dev>"
const APP_URL = process.env.AUTH_URL ?? "http://localhost:3000"

export async function sendPasswordResetEmail(to: string, token: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY não configurado — e-mail não enviado")
    return
  }
  const url = `${APP_URL}/redefinir-senha/${token}`
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Redefinir sua senha — pgm-acervo",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#166534">Redefinir senha</h2>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no pgm-acervo.</p>
        <p>Clique no botão abaixo para criar uma nova senha. O link expira em <strong>1 hora</strong>.</p>
        <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#166534;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Redefinir senha
        </a>
        <p style="color:#6b7280;font-size:14px">Se você não solicitou isso, ignore este e-mail.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:12px">pgm-acervo — Gestão de acervo profissional</p>
      </div>
    `,
  })
}

export async function sendVerificationEmail(to: string, token: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY não configurado — e-mail não enviado")
    return
  }
  const url = `${APP_URL}/verificar-email/${token}`
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Confirme seu e-mail — pgm-acervo",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#166534">Bem-vindo ao pgm-acervo!</h2>
        <p>Confirme seu endereço de e-mail clicando no botão abaixo.</p>
        <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#166534;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Confirmar e-mail
        </a>
        <p style="color:#6b7280;font-size:14px">O link expira em 24 horas.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:12px">pgm-acervo — Gestão de acervo profissional</p>
      </div>
    `,
  })
}
