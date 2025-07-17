import type { FastifyInstance } from "fastify";
import { Customer } from "../model/customerSchema.ts";
import type { IError, QueryParams } from "../types/types.ts";
import {SortOrder} from 'mongoose'

export default async function customersRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		try {
			const {page = 1, itemsPerPage = 2, sort = "createdAt", order = "desc"} = request.query as QueryParams

			const skip = (page - 1) * itemsPerPage

			const sortOrder = order === 'asc' ? 1 : -1

			const sortObject: Record<string, SortOrder> = { [sort]: sortOrder}

			const [customers, total] = await Promise.all([
				Customer.find()
				.sort(sortObject)
				.skip(skip)
				.limit(itemsPerPage)
				.lean(),
				Customer.countDocuments()
			])
           
			const totalPages = Math.ceil(total / itemsPerPage)
			const hasNext = page < totalPages
			const hasPrev = page > 1

			reply.code(200)
			return {
				data: customers,
				pagination: {
					page,
					itemsPerPage,
					total,
					hasNext,
					hasPrev
				}
			}
		} catch (error) {
			reply.code(400)
			return error
		}
	});

	const postOptions = {
		schema: {
			body: {
				type: "object",
				additionalProperties: false,
				required: ["name", "email", "age"],
				properties: {
					name: { type: "string" },
					email: { type: "string" },
					age: { type: "number" },
				},
			},
		},
	};

	type RequestBody = {
		name: string;
		email: string;
		age: number;
	};

	fastify.post("/", postOptions, async (request, reply) => {
		const body = request.body as RequestBody;

		const newCustomer = new Customer({
			name: body.name,
			email: body.email,
			age: body.age,
		});

		try {
			const result = await newCustomer.save();

			reply.code(201);

			return result;
		} catch (error) {
			reply.code(400);

			const errorObject = error as IError;

			if (errorObject.errorResponse.code === 11000) {
				const duplicatedField = Object.keys(
					errorObject.errorResponse.keyValue,
				)[0];
				const duplicatedValue =
					errorObject.errorResponse.keyValue[duplicatedField];

				return {
					statusCode: 400,
					code: errorObject.errorResponse.code,
					error: errorObject.errorResponse.error,
					message: `O valor "${duplicatedValue}" já está sendo usado no campo "${duplicatedField}". Por favor, use outro valor.`,
				};
			}
		}
	});

	const putOptions = {
		schema: {
			body: {
				type: "object",
				additionalProperties: false,
				properties: {
					name: { type: "string" },
					email: { type: "string" },
					age: { type: "number" },
				},
			},
		},
	};

	fastify.put("/:id", putOptions, async (request, reply) => {
		const { id } = request.params as { id: string };
		const body = request.body as RequestBody;

		try {
			const result = await Customer.findByIdAndUpdate(
				id,
				{ name: body.name, email: body.email, age: body.age },
				{ new: true, runValidators: true },
			);

			reply.code(201);

			return result;
		} catch (error) {
			reply.code(400);

			const errorObject = error as IError;

			if (errorObject.errorResponse.code === 11000) {
				const duplicatedField = Object.keys(
					errorObject.errorResponse.keyValue,
				)[0];
				const duplicatedValue =
					errorObject.errorResponse.keyValue[duplicatedField];

				return {
					statusCode: 400,
					code: errorObject.errorResponse.code,
					error: errorObject.errorResponse.error,
					message: `O valor "${duplicatedValue}" já está sendo usado no campo "${duplicatedField}". Por favor, use outro valor.`,
				};
			}
		}
	});

	fastify.delete("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		await Customer.deleteOne({ _id: id });

		reply.code(200);
		reply.send({ message: "Cliente deletado" });
	});
}
