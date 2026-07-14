import { z } from "zod";

export const contactSchema = z.object({
  subject: z.string().min(1, "Informe o assunto"),
  name: z.string().optional().default(""),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "Mensagem deve ter ao menos 10 caracteres"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
