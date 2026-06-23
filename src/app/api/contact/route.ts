import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas/contact";
import { ContactNotification } from "@/emails/contact-notification";
import { ContactConfirmation } from "@/emails/contact-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Victor M. Santos <no-reply@victormts.dev>";
const TO = "victormts.contato@gmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
