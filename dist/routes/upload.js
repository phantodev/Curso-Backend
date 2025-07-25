import { uploadFile, uploadMultipleFiles } from "../controller/uploadController.js";
export default async function uploadRoutes(fastify) {
    fastify.post("/", uploadFile);
    fastify.post("/multi-upload", uploadMultipleFiles);
}
