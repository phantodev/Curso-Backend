import type { FastifyInstance } from "fastify";
import type { QueryParams, TFilterProducts, TProducts } from "../types/types";
import { Product } from "../model/productSchema.ts";
import type { SortOrder } from "mongoose";

export default async function productsRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		try {
			const {
				page = 1,
				itemsPerPage = 1,
				sort = "name",
				order = "desc",
				name,
				minPrice,
				maxPrice,
				status,
			} = request.query as QueryParams;

			const filter: TFilterProducts = {};

			if (name) {
				filter.name = { $regex: name, $options: "i" };
			}

			if (status) {
				filter.status = status.toLowerCase() === "true"; // true ou false;
			}

			if (minPrice || maxPrice) {
				filter.price = {};
				if (minPrice) {
					filter.price.$gte = parseFloat(minPrice);
				}

				if (maxPrice) {
					filter.price.$lte = parseFloat(maxPrice);
				}
			}

			const skip = (Number(page) - 1) * Number(itemsPerPage);
			const sortOrder = order === "asc" ? 1 : -1;
			const sortObject: Record<string, SortOrder> = { [sort]: sortOrder };

			const [products, total] = await Promise.all([
				Product.find(filter)
					.sort(sortObject)
					.skip(skip)
					.limit(Number(itemsPerPage))
					.lean(),
				Product.countDocuments(filter),
			]);

			const totalPages = Math.ceil(total / Number(itemsPerPage));
			const hasNext = Number(page) < Number(totalPages);
			const hasPrev = Number(page) > 1;

			reply.code(200);

			return {
				data: products,
				pagination: {
					page,
					itemsPerPage,
					total,
					hasNext,
					hasPrev,
				},
			};
		} catch (error) {}
		const listProducts = await Product.find();
		reply.code(200);
		return listProducts;
	});
	fastify.post("/", async (request, reply) => {
		const bodyRequest = request.body as TProducts;

		const newProduct = new Product({
			name: bodyRequest.name,
			category: bodyRequest.category,
			description: bodyRequest.description,
			price: bodyRequest.price,
		});

		const result = await newProduct.save();
		reply.code(201);
		return result;
	});
}
