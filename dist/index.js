import Fastify from "fastify";
import usersRoutes from "./routes/users.js";
import customersRoutes from "./routes/customers.js";
import { connectDatabase } from "./config/database.js";
import productsRoutes from "./routes/products.js";
import customerProductsRoutes from "./routes/customer-products.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import multipart from "@fastify/multipart";
async function start() {
    const fastify = Fastify({
        logger: true,
        // Configuração para aceitar arquivos binários
        bodyLimit: 10485760, // 10MB
    });
    // Registrar plugin multipart
    await fastify.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB por arquivo
            files: 10, // Máximo 10 arquivos
        }
    });
    // Configurar para aceitar arquivos binários (mantém compatibilidade)
    fastify.addContentTypeParser('application/octet-stream', { parseAs: 'buffer' }, (req, body, done) => {
        done(null, body);
    });
    fastify.addContentTypeParser('image/*', { parseAs: 'buffer' }, (req, body, done) => {
        done(null, body);
    });
    fastify.addContentTypeParser('*/*', { parseAs: 'buffer' }, (req, body, done) => {
        done(null, body);
    });
    fastify.register(uploadRoutes, { prefix: "/upload" });
    fastify.register(usersRoutes, { prefix: "/users" });
    fastify.register(authRoutes, { prefix: "/auth" });
    fastify.register(customerProductsRoutes, { prefix: "/customer-products" });
    fastify.register(productsRoutes, { prefix: "/products" });
    fastify.register(customersRoutes, { prefix: "/customers" });
    await connectDatabase();
    fastify.listen({ port: 4500 }, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        console.log("Aplicação rodando que nem um foguete! ✔");
    });
}
start().catch((err) => {
    console.error("Erro ao iniciar a aplicação", err);
    process.exit(1);
});
