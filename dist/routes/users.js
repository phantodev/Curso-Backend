export default async function usersRoutes(fastify) {
    fastify.get("/", async (request, reply) => {
        reply.send({ message: "Resposta de usuários" });
    });
}
