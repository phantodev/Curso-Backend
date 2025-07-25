import { Product } from "../model/productSchema.js";
export const productsController = {
    getAllProducts: async (request, reply) => {
        console.log(request.user);
        try {
            const { page = 1, itemsPerPage = 1, sort = "name", order = "desc", name, minPrice, maxPrice, status, } = request.query;
            const filter = {};
            // Este é o momento que fazemos o FILTRO baseado em um usuário que está vindo
            // pelo token JWT
            if (request.user?.id) {
                filter.clientId = request.user.id;
            }
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
            const sortObject = { [sort]: sortOrder };
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
        }
        catch (error) { }
        const listProducts = await Product.find();
        reply.code(200);
        return listProducts;
    },
    createProduct: async (request, reply) => {
        const bodyRequest = request.body;
        const newProduct = new Product({
            name: bodyRequest.name,
            category: bodyRequest.category,
            description: bodyRequest.description,
            price: bodyRequest.price,
        });
        const result = await newProduct.save();
        reply.code(201);
        return result;
    },
};
