import axios from 'axios';

import { getExceptionPayload } from '@/common/api/axiosException.ts';
import { AlertService } from '@/common/services/alert.service.ts';
import { TokenService } from '@/common/services/token.service.ts';

const alertService = new AlertService();
const tokenService = new TokenService();

const instance = axios.create({
	baseURL: import.meta.env.VITE_SETTING_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

instance.interceptors.request.use(
	(config) => {
		const token = tokenService.getAccessToken();

		if (token) {
			config.headers['authorization'] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

instance.interceptors.response.use(
	async (response) => {
		// todo: if error response
		const data: any = response.data;

		if (data?.code === 401) {
			tokenService.removeTokens();
			await alertService.error('Session ໝົດອາຍຸ, ກະລຸນາເຂົາລະບົບໃໝ່');
		} else if (data?.headers && data.headers) {
		}

		return response;
	},
	async (error) => {
		if (error?.response?.status === 401) {
			tokenService.removeTokens();
			// window.location.reload()
		} else {
			const ex = getExceptionPayload(error);
			await alertService.error(ex.message);
		}

		return Promise.reject(error);
	},
);

export const api = instance;
