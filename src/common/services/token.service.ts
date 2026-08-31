// import jwt_decode from "jwt-decode"
import { IToken } from '@/types/apiType/api.type.ts';
// import { IJWTDecode } from "@/types/auth.type"

const SESSION_STORE = 'session';

const getSession = (): IToken | null => {
	const sessionStore = sessionStorage.getItem(SESSION_STORE);

	if (sessionStore) {
		return JSON.parse(sessionStore);
	}
	return null;
};

export class TokenService {
	getSession = (): IToken | null => {
		return getSession();
	};

	getAccessToken = (): string | null => {
		const session = getSession();
		return session?.accessToken ?? null;
	};

	getLoggedAt = (): string | null => {
		const session = getSession();
		return session?.loggedAt ?? null;
	};

	storeTokens = (tokens: IToken) => {
		sessionStorage.setItem(
			SESSION_STORE,
			JSON.stringify({
				...tokens,
				loggedAt: tokens.loggedAt || new Date().toISOString(),
			}),
		);
	};

	removeTokens = () => {
		sessionStorage.removeItem(SESSION_STORE);
	};

	// decodeToken = (token: string): IJWTDecode | undefined => {
	//   return jwt_decode<IJWTDecode | undefined>(token)
	// }
}
