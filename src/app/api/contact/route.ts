import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactConfirmation } from "@/emails/contact-confirmation";
import { ContactNotification } from "@/emails/contact-notification";
import { contactSchema } from "@/lib/schemas/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Victor M. Santos <no-reply@victormts.dev>";
const TO = "victormts.contato@gmail.com";

// ─── In-memory rate limit (per function instance — best-effort in serverless) ──
const ipStore = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_PER_WINDOW) return true;

  entry.count += 1;
  return false;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    // ── Origin check ────────────────────────────────────────────────────────
    const origin = request.headers.get("origin") ?? "";
    const allowedOrigins = [
      "https://www.victormts.dev",
      "https://victormts.dev",
      "http://localhost:3000",
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Origem não permitida" },
        { status: 403 },
      );
    }

    // ── Rate limit ───────────────────────────────────────────────────────────
    const ip = getIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde antes de enviar novamente." },
        { status: 429 },
      );
    }

    const body = await request.json();

    // ── Honeypot (bots preenchem, humanos não) ───────────────────────────────
    if (body._trap) {
      return NextResponse.json({ success: true }); // silently ignore
    }

    // ── Timing check (mínimo 4s entre abrir o form e enviar) ─────────────────
    const loadedAt = Number(body._t ?? 0);
    if (!loadedAt || Date.now() - loadedAt < 4000) {
      return NextResponse.json(
        { error: "Envio muito rápido. Tente novamente." },
        { status: 400 },
      );
    }

    // ── Validação ────────────────────────────────────────────────────────────
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Campos inválidos", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = result.data;

    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: `[Contato] ${subject} — ${name}`,
        react: ContactNotification({ name, email, subject, message }),
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        subject: `Mensagem recebida, ${name}!`,
        react: ContactConfirmation({ name, subject }),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 },
    );
  }
}
