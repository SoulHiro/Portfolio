"use client";

import { CheckCircle, Loader2, MoveRight } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label, P } from "@/components/ui/typography";
import { contactSchema } from "@/lib/schemas/contact";

type FormState = {
  subject: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const inputClass =
  "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-body-md text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground transition-colors duration-300 resize-none";

export function ContactForm() {
  const loadedAt = useRef(Date.now());
  const [form, setForm] = useState<FormState>({
    subject: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [msgFocused, setMsgFocused] = useState(false);

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse({ ...form, name: "" });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          _t: loadedAt.current,
          _trap: "",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro desconhecido");
      }

      setForm({ subject: "", email: "", message: "" });
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.",
      );
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const isLoading = status === "loading";

  if (status === "success") {
    return (
      <div className="flex flex-col gap-6 py-8">
        <CheckCircle className="size-8 text-foreground/60" strokeWidth={1.5} />
        <div className="flex flex-col gap-2">
          <p className="text-body-md font-medium">Mensagem enviada.</p>
          <p className="text-body-sm text-muted-foreground leading-relaxed max-w-sm">
            Recebi sua mensagem e você também recebeu uma confirmação no seu
            email. Assim que eu visualizar, respondo o quanto antes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-label-sm text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit underline underline-offset-4"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-8">
      {/* Honeypot */}
      <input
        name="_trap"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
        aria-hidden="true"
      />

      {/* Subject */}
      <div className="flex flex-col gap-1">
        <Label size="sm" className="text-muted-foreground">
          Assunto
        </Label>
        <input
          value={form.subject}
          onChange={set("subject")}
          placeholder="Ex: Proposta de trabalho"
          className={inputClass}
        />
        {errors.subject && (
          <P size="xs" className="text-destructive mt-1">
            {errors.subject}
          </P>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label size="sm" className="text-muted-foreground">
          Email
        </Label>
        <input
          value={form.email}
          onChange={set("email")}
          type="email"
          placeholder="seu@email.com"
          className={inputClass}
        />
        {errors.email && (
          <P size="xs" className="text-destructive mt-1">
            {errors.email}
          </P>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <Label size="sm" className="text-muted-foreground">
          Mensagem
        </Label>
        <textarea
          value={form.message}
          onChange={set("message")}
          placeholder="Conte um pouco sobre o que você precisa..."
          onFocus={() => setMsgFocused(true)}
          onBlur={() => {
            if (!form.message) setMsgFocused(false);
          }}
          className={inputClass}
          style={{
            height: msgFocused || form.message ? "120px" : "48px",
            transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }}
        />
        {errors.message && (
          <P size="xs" className="text-destructive mt-1">
            {errors.message}
          </P>
        )}
      </div>

      {status === "error" && (
        <P size="sm" className="text-destructive">
          {errorMsg}
        </P>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="self-start rounded-sm px-6 py-3 gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            Enviar mensagem <MoveRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
