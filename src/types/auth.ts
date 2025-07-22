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
