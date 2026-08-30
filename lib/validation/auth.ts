import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(x => x.password === x.confirmPassword, { path: ["confirmPassword"], message: "Les mots de passe ne correspondent pas." });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});