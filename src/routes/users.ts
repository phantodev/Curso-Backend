import type { FastifyInstance } from "fastify";

export default async function usersRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		reply.send({ message: "Resposta de usuários" });
	});
}
