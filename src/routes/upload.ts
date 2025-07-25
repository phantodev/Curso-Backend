import type { FastifyInstance } from "fastify";
import { uploadFile, uploadMultipleFiles } from "../controller/uploadController";


export default async function uploadRoutes(fastify: FastifyInstance) {
	fastify.post("/", uploadFile );
	fastify.post("/multi-upload", uploadMultipleFiles)
}
