import type { FastifyInstance } from "fastify";
import { authController } from "../controller/authController.ts";

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post("/login",authController.login );
	fastify.post("/register", authController.register)
}
