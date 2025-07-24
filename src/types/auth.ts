import { FastifyRequest } from "fastify";

// Interface para o payload do JWT
export interface JWTPayload {
	user: {
		id: string;
		name: string;
		username: string;
		avatar: string;
		email: string;
		role: "user" | "admin";
		createdAt: Date;
		updatedAt: Date;
	};
	iat?: number;
	exp?: number;
	iss?: string;
	aud?: string;
}

export type TAuthRegister = {
	name: string;
	email: string;
	age: number;
	password: string;
};

export interface CustomRequest extends FastifyRequest {
	user?: JWTPayload["user"];
}
