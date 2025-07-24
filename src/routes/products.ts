import type { FastifyInstance } from "fastify";
import { productsController } from "../controller/productsController.ts";
import { authenticateToken, authorizeRoles } from "../middleware/auth.ts";

export default async function productsRoutes(fastify: FastifyInstance) {
	fastify.get(
		"/",
		{
			preHandler: [authenticateToken, authorizeRoles("user", "admin")],
		},
		productsController.getAllProducts,
	);
	fastify.post(
		"/",
		{
			preHandler: [authenticateToken, authorizeRoles("admin")],
		},
		productsController.createProduct,
	);
}
