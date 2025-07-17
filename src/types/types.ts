export interface IClients {
	name: string;
	age: number;
	address: {
		street: string;
		houseNumber: string;
	};
}

export interface IError {
	errorResponse: {
		code: number;
		error: string;
		keyValue: Record<string, string>;
		keyPattern?: Record<string, any>;
	};
}

export type QueryParams = {
	page?: number;
	itemsPerPage?: number;
	sort?: string;
	order?: "asc" | "desc";
};
