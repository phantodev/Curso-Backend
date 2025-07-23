import z from "zod";

export const authLoginSchema = z.object({
    email: z.email({message: "E-mail inválido"}),
    password: z.string().min(8, {message: "Senha minimo 8 caracteres"})
})