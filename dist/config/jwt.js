import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "seu-secret-super-seguro-aqui-2025";
// Função para gerar token de acesso
export function generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "15m",
        algorithm: "HS256",
        issuer: "skate-spot-api",
        audience: "skate-spot-users",
    });
}
