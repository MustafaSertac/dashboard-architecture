import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi girin"),
  password: z.string().min(1, "Sifre gereklidir"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ad en az 2 karakter olmalidir"),
    email: z.string().email("Gecerli bir e-posta adresi girin"),
    password: z.string().min(6, "Sifre en az 6 karakter olmalidir"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Sifreler eslesmiyor",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi girin"),
  newPassword: z.string().min(6, "Sifre en az 6 karakter olmalidir"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
