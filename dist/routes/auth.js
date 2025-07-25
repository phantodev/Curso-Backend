import { authController } from "../controller/authController.js";
export default async function authRoutes(fastify) {
    fastify.post("/login", authController.login);
    fastify.post("/register", authController.register);
}
