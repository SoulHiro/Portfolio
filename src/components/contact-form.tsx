"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { contactSchema } from "@/lib/schemas/contact";
import { Label, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { MoveRight, Loader2 } from "lucide-react";

const SUBJECTS = ["Geral", "Parceria", "Feedback", "Outro"] as const;

type FormState = {
  subject: string;
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const inputClass =
  "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-body-md text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground transition-colors duration-300 resize-none";

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    subject: SUBJECTS[0],
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msgFocused, setMsgFocused] = useState(false);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);

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
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error();
      setForm({ subject: SUBJECTS[0], name: "", email: "", message: "" });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-8">
      {/* Subject */}
      <div className="flex flex-col gap-3">
        <Label size="sm" className="text-muted-foreground">Assunto</Label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, subject: s }))}
              className={cn(
                "px-4 py-1.5 text-body-sm border transition-colors duration-200 cursor-pointer",
                form.subject === s
                  ? "border-foreground text-foreground bg-foreground/5"
                  : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <Label size="sm" className="text-muted-foreground">Nome</Label>
        <input
          value={form.name}
          onChange={set("name")}
          placeholder="Seu nome"
          className={inputClass}
        />
        {errors.name && <P size="xs" className="text-destructive mt-1">{errors.name}</P>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label size="sm" className="text-muted-foreground">Email</Label>
        <input
          value={form.email}
          onChange={set("email")}
          type="email"
          placeholder="seu@email.com"
          className={inputClass}
        />
        {errors.email && <P size="xs" className="text-destructive mt-1">{errors.email}</P>}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <Label size="sm" className="text-muted-foreground">Mensagem</Label>
        <textarea
          value={form.message}
          onChange={set("message")}
          placeholder="Conte um pouco sobre o que você precisa..."
          onFocus={() => setMsgFocused(true)}
          onBlur={() => { if (!form.message) setMsgFocused(false); }}
          className={inputClass}
          style={{
            height: msgFocused || form.message ? "120px" : "48px",
            transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }}
        />
        {errors.message && <P size="xs" className="text-destructive mt-1">{errors.message}</P>}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full rounded-sm py-4 md:py-6 gap-2">
        {isLoading ? (
          <><Loader2 className="size-4 animate-spin" /> Enviando...</>
        ) : status === "success" ? (
          "Mensagem enviada!"
        ) : status === "error" ? (
          "Erro ao enviar. Tente novamente."
        ) : (
          <>Enviar mensagem <MoveRight className="size-4" /></>
        )}
      </Button>
    </form>
  );
}
