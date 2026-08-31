import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IRoot, ILoginRes, IGetMeResponse, AuthState } from '@/types/apiType/auth.type.ts';
import { TokenService } from '@/common/services/token.service.ts';
import { APIError, APIStatus } from '@/types/apiType/api.type.ts';

import { getExceptionPayload } from '@/common/api/axiosException.ts';
import { api } from '@/redux/api.ts';

const tokenService = new TokenService();

export const login = createAsyncThunk<IRoot<ILoginRes>, any, { rejectValue: APIError }>(
	'SignIn/login',
	async (body, { rejectWithValue }) => {
		try {
			const credentials = import.meta.env.VITE_BASIC_AUTH;
			const encodedCredentials = btoa(credentials);

			const response = await api.post<IRoot<ILoginRes>>('authz/oauth/token', body, {
				headers: {
					Authorization: `Basic ${encodedCredentials}`,
				},
			});

			if (response.data.body && response.data.body.token?.access_token) {
				tokenService.storeTokens({
					accessToken: response.data.body.token.access_token,
					loggedAt: new Date().toISOString(),
				});
			}
			return response.data;
		} catch (ex) {
			console.error('Sign-up error:', ex);
			return rejectWithValue(getExceptionPayload(ex));
		}
	},
);

export const signUp = createAsyncThunk<any, any, { rejectValue: APIError }>(
	'SignUp/signUp',
	async (body, { rejectWithValue }) => {
		try {
			const response = await api.post<any>('/authz/regis/register', body, {
				headers: {
					'x-access-token': import.meta.env.VITE_ACCESS_TOKEN,
				},
			});

			return response;
		} catch (ex) {
			console.error('Sign-up error:', ex);
			return rejectWithValue(getExceptionPayload(ex));
		}
	},
);

export const logout = createAsyncThunk<void, void, { rejectValue: APIError }>(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get(`/authz/oauth/logout`);
			console.log('res', response);
			return response.data;
		} catch (error: any) {
			console.error('Logout error:', error);
			return rejectWithValue({
				message: error?.response?.data?.message || 'Logout failed',
				code: error?.response?.status || '500',
			});
		}
	},
);
export const getMe = createAsyncThunk<
	IRoot<IGetMeResponse> | undefined,
	void,
	{ rejectValue: APIError }
>('SignIn/getMe', async (_, { rejectWithValue }) => {
	try {
		const accessToken = tokenService.getAccessToken();
		if (accessToken) {
			const res = await api.get<IRoot<IGetMeResponse>>('authz/check_token_data');
			return res.data;
		}
		return undefined;
	} catch (ex) {
		return rejectWithValue(getExceptionPayload(ex));
	}
});

const initialState: AuthState = {
	isAuthenticated: false,
	status: APIStatus.IDLE,
	accessToken: '',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		signOut: (state) => {
			state.isAuthenticated = false;
			state.accessToken = null;
			state.refreshToken = null;
			state.user = undefined;
			// todo: Remove JWT Tokens
			tokenService.removeTokens();
		},
	},
	extraReducers: (builder) => {
		builder.addCase(logout.fulfilled, (state) => {
			state.isAuthenticated = false;
			state.accessToken = null;
			state.refreshToken = null;
			state.user = undefined;
			// todo: Remove JWT Tokens
			tokenService.removeTokens();
		});
		builder.addCase(login.pending, (state) => {
			state.status = APIStatus.PENDING;
		});
		builder.addCase(login.fulfilled, (state, { payload }) => {
			if (payload.header.status === '01') {
				state.status = APIStatus.FULFILLED;
				state.isAuthenticated = true;
				state.accessToken = payload.body?.token.access_token;
			} else {
				state.status = APIStatus.REJECTED;
				state.isAuthenticated = false;
				state.accessToken = '';
			}

			// state.refreshToken = payload.refresh_token
		});
		builder.addCase(login.rejected, (state) => {
			state.status = APIStatus.REJECTED;
		});
		builder.addCase(getMe.pending, (state) => {
			state.status = APIStatus.PENDING;
		});
		builder.addCase(getMe.fulfilled, (state, { payload }) => {
			state.user = payload;
			state.accessToken = tokenService.getAccessToken();
			// state.refreshToken = tokenService.getRefreshToken()
			state.isAuthenticated = !!payload;
			state.status = payload ? APIStatus.FULFILLED : APIStatus.REJECTED;
		});
		builder.addCase(getMe.rejected, (state) => {
			state.status = APIStatus.REJECTED;
		});
		builder.addCase(signUp.pending, (state) => {
			console.log('Sign-up pending');
			state.status = APIStatus.PENDING;
		});
		builder.addCase(signUp.fulfilled, (state) => {
			console.log('Sign-up fulfilled');
			state.status = APIStatus.FULFILLED;
		});
		builder.addCase(signUp.rejected, (state, action) => {
			console.log('Sign-up rejected', action.error);
			state.status = APIStatus.REJECTED;
		});
	},
});

export const { signOut } = authSlice.actions;

export default authSlice.reducer;
