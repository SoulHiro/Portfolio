import { z } from "zod";

export const contactSchema = z.object({
  subject: z.string().min(1),
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "Mensagem deve ter ao menos 10 caracteres"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
