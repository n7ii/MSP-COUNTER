export enum APIStatus {
	IDLE = "IDLE",
	PENDING = "PENDING",
	REJECTED = "REJECTED",
	FULFILLED = "FULFILLED",
}

export interface APIError {
	message: string;
	code: number;
	error?: string;
	error_description?: string;
}

export interface APIData<T> {
	success?: boolean;
	message: string;
	code: number;
	data: T;
	response: T;
}
export interface APIDataRes {
	message: string;
	status: number;
}

export interface APIResponse<T> {
	timestamp?: string;
	status: APIStatus;
	message?: string;
	reason?: string;
	data?: T;
	error?: APIError;
}

export interface IToken {
	accessToken: string;
	loggedAt?: string;
}

export interface IResponse {
	session: Partial<IToken>;
}

interface ApiResHeader {
	timestamp: string;
	code: string;
	message: string;
	status: string;
	traceId: string;
}

export interface APIRes<T> {
	header: ApiResHeader;
	body: T;
}
