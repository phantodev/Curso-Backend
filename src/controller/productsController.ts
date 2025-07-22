// export const productsController = {
// 	getFavoritesProducts: async (request, reply) => {
// 		const { productId } = request.params as { productId: string };

// 		try {
// 			const productExists = await Product.findById(productId);
// 			if (!productExists) {
// 				reply.code(404);
// 				return {
// 					statusCode: 404,
// 					error: "Produto não encontrado",
// 					message: "O produto especificado não foi encontrado.",
// 				};
// 			}

// 			const customers = await Customer.find({
// 				favoriteProducts: productId,
// 			}).select("name email age createdAt");

// 			reply.code(200);
// 			return {
// 				statusCode: 200,
// 				message: "Clientes favoritos encontrados com sucesso",
// 				data: customers,
// 			};
// 		} catch (error) {
// 			console.error("Erro ao buscar clientes favoritos do produto:", error);

// 			// Verificar se é um erro de validação do MongoDB
// 			if (error instanceof mongoose.Error.CastError) {
// 				reply.code(400);
// 				return {
// 					statusCode: 400,
// 					error: "ID inválido",
// 					message: "O ID do produto fornecido não é válido",
// 					timestamp: new Date().toISOString(),
// 					path: `/products/${productId}/favorites`,
// 				};
// 			}

// 			// Verificar se é um erro de conexão com o banco
// 			if (error instanceof mongoose.Error.MongooseServerSelectionError) {
// 				reply.code(503);
// 				return {
// 					statusCode: 503,
// 					error: "Serviço indisponível",
// 					message:
// 						"Não foi possível conectar com o banco de dados. Tente novamente em alguns instantes.",
// 					timestamp: new Date().toISOString(),
// 					path: `/products/${productId}/favorites`,
// 				};
// 			}

// 			// Erro genérico do servidor
// 			reply.code(500);
// 			return {
// 				statusCode: 500,
// 				error: "Erro interno do servidor",
// 				message:
// 					"Ocorreu um erro inesperado ao processar sua requisição. Nossa equipe foi notificada.",
// 				timestamp: new Date().toISOString(),
// 				path: `/products/${productId}/favorites`,
// 				...(process.env.NODE_ENV === "development" && {
// 					details: error instanceof Error ? error.message : "Erro desconhecido",
// 					stack: error instanceof Error ? error.stack : undefined,
// 				}),
// 			};
// 		}
// 	},
// };

// export default productsController;
