import type { FastifyInstance } from "fastify";

export default async function customersRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		reply.send({ message: "Resposta de clientes" });
	});
}
