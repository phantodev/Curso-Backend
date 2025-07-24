import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import type { CustomRequest, JWTPayload } from "../types/auth.ts";

const JWT_SECRET =
	process.env.JWT_SECRET || "seu-secret-super-seguro-aqui-2025";

// Middleware de autenticação
export const authenticateToken = async (
	request: CustomRequest,
	reply: FastifyReply,
) => {
	try {
		console.log(request.headers);
		const authHeader = request.headers.authorization;
		const token = authHeader?.split(" ")[1]; // Bearer TOKEN

		if (!token) {
			return reply.code(401).send({ message: "Token não fornecido" });
		}

		const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
		request.user = decoded.user; // Adiciona o usuário ao request
	} catch (error) {
		return reply.code(403).send({ message: "Token inválido" });
	}
};

// Middleware de autorização baseado em roles
export const authorizeRoles = (...roles: string[]) => {
	return async (request: CustomRequest, reply: FastifyReply) => {
		if (!request.user) {
			return reply.code(401).send({ message: "Usuário não autenticado" });
		}

		if (!roles.includes(request.user.role)) {
			return reply.code(403).send({ message: "Acesso negado" });
		}
	};
};
