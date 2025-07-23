import type { FastifyInstance } from "fastify";
import { Customer } from "../model/customerSchema.ts";
import { Product } from "../model/productSchema.ts";
import mongoose from "mongoose";
import { z } from "zod";
// import productsController from "../controller/productsController.ts";

export default async function customerProductsRoutes(fastify: FastifyInstance) {
	const AddFavoriteProductsSchema = z.object({
		productIds: z
			.array(z.string().min(24, "ID do produto deve ter 24 caracteres"))
			.min(1, "Pelo menos um produto deve ser fornecido")
			.max(10, "Máximo de 10 produtos favoritos"),
	});

	const RemoveFavoriteProductsSchema = z.object({
		productIds: z
			.array(z.string().min(24, "ID do produto deve ter 24 caracteres"))
			.min(1, "Pelo menos um produto deve ser fornecido")
			.max(10, "Máximo de 10 produtos favoritos"),
	});

	fastify.post("/:customerId/favorites", async (request, reply) => {
		const { customerId } = request.params as { customerId: string };

		if (!mongoose.Types.ObjectId.isValid(customerId)) {
			return reply.status(400).send({
				error: "ID inválido",
				message: "O ID do cliente fornecido não é válido.",
			});
		}

		const validationResult = AddFavoriteProductsSchema.safeParse(request.body);

		if (!validationResult.success) {
			reply.code(400);
			return {
				statusCode: 400,
				error: "Dados inválidos",
				message: "Os dados fornecidos não são válidos",
				details: validationResult.error.issues.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				})),
			};
		}

		const { productIds } = validationResult.data;

		try {
			console.log("Customer ID:", customerId);
			console.log("Product IDs:", productIds);

			const customerExists = await Customer.findById(customerId);

			if (!customerExists) {
				reply.code(404);
				return {
					statusCode: 404,
					error: "Cliente não encontrado",
				};
			}

			// AGREGGATION PIPELINE
			const products = await Product.find({
				_id: { $in: productIds },
			});

			if (products.length !== productIds.length) {
				reply.code(404);
				return {
					statusCode: 404,
					error: "Produto não encontrado",
				};
			}

			const existingFavoriteProducts = customerExists.favoriteProducts || [];

			const productObjectIds = products.map(
				(product) => new mongoose.Types.ObjectId(product._id),
			);

			const newFavoriteProducts = [
				...existingFavoriteProducts,
				...productObjectIds,
			];

			customerExists.favoriteProducts = newFavoriteProducts;

			await customerExists.save();

			// const updatedCustomer = await Customer.findById(customerId);

			const updatedCustomer = await Customer.findById(customerId).populate(
				"favoriteProducts",
				"name price category",
			);

			if (!updatedCustomer) {
				reply.code(404);
				return {
					statusCode: 404,
					error: "Cliente não encontrado",
				};
			}

			reply.code(200);
			return {
				statusCode: 200,
				message: "Produtos favoritos adicionados com sucesso",
				data: updatedCustomer,
			};
		} catch (error) {
			console.error("Erro ao adicionar produtos favoritos:", error);

			// Verificar se é um erro de validação do MongoDB
			if (error instanceof mongoose.Error.CastError) {
				reply.code(400);
				return {
					statusCode: 400,
					error: "ID inválido",
					message: "Um ou mais IDs fornecidos não são válidos",
					timestamp: new Date().toISOString(),
					path: `/${customerId}/favorites`,
				};
			}

			// Verificar se é um erro de conexão com o banco
			if (error instanceof mongoose.Error.MongooseServerSelectionError) {
				reply.code(503);
				return {
					statusCode: 503,
					error: "Serviço indisponível",
					message:
						"Não foi possível conectar com o banco de dados. Tente novamente em alguns instantes.",
					timestamp: new Date().toISOString(),
					path: `/${customerId}/favorites`,
				};
			}

			// Erro genérico do servidor
			reply.code(500);
			return {
				statusCode: 500,
				error: "Erro interno do servidor",
				message:
					"Ocorreu um erro inesperado ao processar sua requisição. Nossa equipe foi notificada.",
				timestamp: new Date().toISOString(),
				path: `/${customerId}/favorites`,
				...(process.env.NODE_ENV === "development" && {
					details: error instanceof Error ? error.message : "Erro desconhecido",
					stack: error instanceof Error ? error.stack : undefined,
				}),
			};
		}
	});

	fastify.delete("/:customerId/favorites/remove", async (request, reply) => {
		const { customerId } = request.params as { customerId: string };

		if (!mongoose.Types.ObjectId.isValid(customerId)) {
			return reply.status(400).send({
				error: "ID inválido",
				message: "O ID do cliente fornecido não é válido.",
			});
		}

		const validationResult = RemoveFavoriteProductsSchema.safeParse(
			request.body,
		);

		if (!validationResult.success) {
			reply.code(400);
			return {
				statusCode: 400,
				error: "Dados inválidos",
				message: "Os dados fornecidos não são válidos",
				details: validationResult.error.issues.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				})),
			};
		}

		const { productIds } = validationResult.data;

		try {
			console.log("Customer ID:", customerId);
			console.log("Product IDs:", productIds);

			const customerExists = await Customer.findById(customerId);

			if (!customerExists) {
				reply.code(404);
				return {
					statusCode: 404,
					error: "Cliente não encontrado",
				};
			}

			const existingFavoriteProducts = customerExists.favoriteProducts || [];

			const updatedFavoriteProducts = existingFavoriteProducts.filter(
				(productId) => !productIds.includes(productId.toString()),
			);

			customerExists.favoriteProducts = updatedFavoriteProducts;

			await customerExists.save();

			const updatedCustomer = await Customer.findById(customerId).populate(
				"favoriteProducts",
				"name price category",
			);

			if (!updatedCustomer) {
				reply.code(404);
				return {
					statusCode: 404,
					error: "Cliente não encontrado",
				};
			}

			reply.code(200);
			return {
				statusCode: 200,
				message: "Produtos favoritos removidos com sucesso",
				data: updatedCustomer,
			};
		} catch (error) {
			console.error("Erro ao remover produtos favoritos:", error);

			// Verificar se é um erro de validação do MongoDB
			if (error instanceof mongoose.Error.CastError) {
				reply.code(400);
				return {
					statusCode: 400,
					error: "ID inválido",
					message: "Um ou mais IDs fornecidos não são válidos",
					timestamp: new Date().toISOString(),
					path: `/${customerId}/favorites/remove`,
				};
			}

			// Verificar se é um erro de conexão com o banco
			if (error instanceof mongoose.Error.MongooseServerSelectionError) {
				reply.code(503);
				return {
					statusCode: 503,
					error: "Serviço indisponível",
					message:
						"Não foi possível conectar com o banco de dados. Tente novamente em alguns instantes.",
					timestamp: new Date().toISOString(),
					path: `/${customerId}/favorites/remove`,
				};
			}

			// Erro genérico do servidor
			reply.code(500);
			return {
				statusCode: 500,
				error: "Erro interno do servidor",
				message:
					"Ocorreu um erro inesperado ao processar sua requisição. Nossa equipe foi notificada.",
				timestamp: new Date().toISOString(),
				path: `/${customerId}/favorites/remove`,
				...(process.env.NODE_ENV === "development" && {
					details: error instanceof Error ? error.message : "Erro desconhecido",
					stack: error instanceof Error ? error.stack : undefined,
				}),
			};
		}
	});

	fastify.get("/:customerId/favorites", async (request, reply) => {
		const { customerId } = request.params as { customerId: string };

		try {
			const customerExists = await Customer.findById(customerId);

			if (!customerExists) {
				reply.code(404);
				return {
					statusCode: 404,
					error: "Cliente não encontrado",
				};
			}

			const favoriteProducts = await Product.find({
				_id: { $in: customerExists.favoriteProducts },
			});

			reply.code(200);
			return {
				statusCode: 200,
				message: "Produtos favoritos encontrados com sucesso",
				data: favoriteProducts,
			};
		} catch (error) {
			console.error("Erro ao buscar produtos favoritos do cliente:", error);

			// Verificar se é um erro de validação do MongoDB
			if (error instanceof mongoose.Error.CastError) {
				reply.code(400);
				return {
					statusCode: 400,
					error: "ID inválido",
					message: "O ID do cliente fornecido não é válido",
					timestamp: new Date().toISOString(),
					path: `/${customerId}/favorites`,
				};
			}

			// Verificar se é um erro de conexão com o banco
			if (error instanceof mongoose.Error.MongooseServerSelectionError) {
				reply.code(503);
				return {
					statusCode: 503,
					error: "Serviço indisponível",
					message:
						"Não foi possível conectar com o banco de dados. Tente novamente em alguns instantes.",
					timestamp: new Date().toISOString(),
					path: `/${customerId}/favorites`,
				};
			}

			// Erro genérico do servidor
			reply.code(500);
			return {
				statusCode: 500,
				error: "Erro interno do servidor",
				message:
					"Ocorreu um erro inesperado ao processar sua requisição. Nossa equipe foi notificada.",
				timestamp: new Date().toISOString(),
				path: `/${customerId}/favorites`,
				...(process.env.NODE_ENV === "development" && {
					details: error instanceof Error ? error.message : "Erro desconhecido",
					stack: error instanceof Error ? error.stack : undefined,
				}),
			};
		}
	});

	// fastify.get(
	// 	"/products/:productId/favorites",
	// 	productsController.getFavoritesProducts,
	// );
}
