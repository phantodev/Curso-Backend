import type { FastifyInstance } from "fastify";
import { generateAccessToken } from "../config/jwt.ts";

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		const userPayload = {
			user: {
				id: "123",
				name: "John Doe",
				username: "john.doe",
				avatar: "https://example.com/avatar.png",
				email: "john.doe@example.com",
				role: "user" as const,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};

		const jwtEncoded = generateAccessToken(userPayload);

		reply.send({ token: jwtEncoded });
	});
}
