import { Customer } from "../model/customerSchema.js";
import { Auth } from "../model/authSchema.js";
import bcrypt from "bcryptjs";
import { authLoginSchema } from "../zod-schemas/auth-schema.js";
import { generateAccessToken } from "../config/jwt.js";
export const authController = {
    login: async (request, reply) => {
        const body = request.body;
        if (body.email === "" || body.password === "") {
            reply.code(400).send({ message: "Dados inválidos!" });
        }
        const validationResult = authLoginSchema.safeParse(request.body);
        if (!validationResult.success) {
            reply.code(400).send({ message: "Dados inválidos!" });
        }
        const customer = await Auth.aggregate([
            { $match: { email: body.email } },
        ]);
        console.log(customer);
        if (customer.length === 0) {
            reply.code(401).send({ message: "Credenciais inválidas!" });
        }
        const isPasswordValid = bcrypt.compareSync(body.password, customer[0].password);
        if (!isPasswordValid) {
            reply.code(401).send({ message: "Credenciais inválidas" });
        }
        const userPayload = {
            user: {
                id: "123",
                name: "John Doe",
                username: "john.doe",
                avatar: "https://example.com/avatar.png",
                email: "john.doe@example.com",
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };
        const jwtEncoded = generateAccessToken(userPayload);
        reply.send({ token: jwtEncoded });
    },
    register: async (request, reply) => {
        const body = request.body;
        const newCustomer = new Customer({
            name: body.name,
            email: body.email,
            age: body.age,
        });
        try {
            const result = await newCustomer.save();
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(body.password, salt);
            const newAuth = new Auth({
                email: body.email,
                password: hashedPassword,
                clientId: result._id,
            });
            await newAuth.save();
            reply.code(201);
            return result;
        }
        catch (error) {
            reply.code(400);
            const errorObject = error;
            if (errorObject.errorResponse.code === 11000) {
                const duplicatedField = Object.keys(errorObject.errorResponse.keyValue)[0];
                const duplicatedValue = errorObject.errorResponse.keyValue[duplicatedField];
                return {
                    statusCode: 400,
                    code: errorObject.errorResponse.code,
                    error: errorObject.errorResponse.error,
                    message: `O valor "${duplicatedValue}" já está sendo usado no campo "${duplicatedField}". Por favor, use outro valor.`,
                };
            }
        }
    },
};
