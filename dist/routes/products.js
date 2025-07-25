import { productsController } from "../controller/productsController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
export default async function productsRoutes(fastify) {
    fastify.get("/", {
        preHandler: [authenticateToken, authorizeRoles("user", "admin")],
    }, productsController.getAllProducts);
    fastify.post("/", {
        preHandler: [authenticateToken, authorizeRoles("admin")],
    }, productsController.createProduct);
}
