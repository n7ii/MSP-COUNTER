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
		// Check for 401 in response data
		const { data } = response;

		if (data?.code === 401) {
			tokenService.removeTokens();
			await alertService.error('Session ໝົດອາຍຸ, ກະລຸນາເຂົາລະບົບໃໝ່');
			// Redirect to login page
			window.location.href = '/auth'; // or your login route
		}

		return response;
	},
	async (error) => {
		// Check for 401 HTTP status
		if (error?.response?.status === 401) {
			tokenService.removeTokens();
			await alertService.error('Session ໝົດອາຍຸ, ກະລຸນາເຂົາລະບົບໃໝ່');
			// Redirect to login page
			window.location.href = '/auth'; // or your login route
			return Promise.reject(error); // Still reject to stop further processing
		} else {
			const ex = getExceptionPayload(error);
			await alertService.error(ex.message);
		}

		return Promise.reject(error);
	},
);

export const api = instance;
