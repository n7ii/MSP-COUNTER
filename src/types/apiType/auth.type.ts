import {APIStatus} from "@/types/apiType/api.type.ts";

export interface IRoot<T> {
	header: IHeader
	body: T
}
export interface IHeader {
	timestamp: string
	code: string
	message: string
	status: string
	traceId: string
}

export interface ILoginBody {
	username: string
	password: string
}

export interface ILoginRes {
	gender: string
	email: string
	name: string
	surname: string
	role: string
	token: ILoginResToken
}

export interface ILoginResToken {
	token_type: string
	access_token: string
	refresh_token: string
	expires_in: number
	jti: string
}

export interface IGetMeResponse {
	createdBy: any
	lastModifiedBy: any
	id: number
	name: string
	approved: string
	approvedBy: string
	surename: string
	gender: string
	username: string
	tel: string
	email: string
	password: string
	loginSession: number
	lastLogin: string
	locked: boolean
	lockReason: any
	lockTime: any
	loginIp: string
	status: boolean
	role: string
	custRoles: any[]
	login: boolean
}

export interface AuthState {
	isAuthenticated: boolean;
	// authorities?: UserRole[];
	accessToken?: string | null;
	refreshToken?: string | null;
	user?: IRoot<IGetMeResponse>;
	status: APIStatus;
}