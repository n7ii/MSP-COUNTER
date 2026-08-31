import { AxiosResponse, isAxiosError } from 'axios';
import { APIError } from '@/types/apiType/api.type.ts';

const InternalError: APIError = {
	code: -500,
	message: 'Internal error during request',
};

export const getExceptionPayload = (ex: unknown): APIError => {
	// console.error(JSON.stringify(ex, null, 2));

	if (typeof ex !== 'object' || !ex || !isAxiosError(ex)) {
		// console.log("not object");
		return InternalError;
	}

	if (ex.code === 'ERR_NETWORK') {
		// console.log("ERR_NETWORK");
		return {
			code: -404,
			message: 'ການເຊື່ອມຕໍ່ຂັດຂ້ອງກະລຸນາກວດສອບອິນເຕີເນັດຂອງທ່ານແລ້ວລອງໃໝ່ອີກຄັ້ງ!',
		};
	}

	const typedException: AxiosResponse<APIError> = ex.response as AxiosResponse;
	// console.log("typedException", typedException.data);
	if (typedException.data) {
		return {
			code: typedException.data.code || typedException.status || InternalError.code,
			message:
				typedException.data.message ||
				(typedException.data?.error_description === 'null'
					? typedException.data?.error
					: typedException.data?.error_description) ||
				InternalError.message,
		};
	}

	return InternalError;
};
