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
	page?: string;
	itemsPerPage?: string;
	sort?: string;
	order?: "asc" | "desc";
	name?: string;
	minPrice?: string;
	maxPrice?: string;
	status?: string;
};

export type TProducts = {
	name: string;
	description: string;
	category: string;
	price: number;
};

export type TFilterProducts = {
	name?: { $regex: string; $options: string };
	price?: any;
	status?: any;
};
