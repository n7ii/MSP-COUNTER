import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/reports/redux/base-query.middleware.ts';

export type PayReportService = 'water' | 'phone' | 'edl' | 'easy';

export type PayHistoryParams = {
	service: PayReportService;
	page?: number;
	size?: number;
	dateStart?: string;
	dateEnd?: string;
	transStatus?: string;
};

export type PayDashboardParams = {
	service: PayReportService;
	dateStart?: string;
	dateEnd?: string;
};

export type PayDashboardBody = {
	successTransaction?: number;
	errorTransaction?: number;
	holdTransaction?: number;
	revertTransaction?: number;
	allTransaction?: number;
	totalLak?: number | null;
};

export const payReportApiSlice = createApi({
	reducerPath: 'payReportApiSlice',
	baseQuery,
	tagTypes: ['PayReport'],
	endpoints: (builder) => ({
		getPayHistory: builder.query<any, PayHistoryParams>({
			query: ({ service, page = 0, size = 10, dateStart, dateEnd, transStatus }) => ({
				url: `/pay/report/${service}/history`,
				method: 'GET',
				params: {
					page,
					size,
					dateStart,
					dateEnd,
					...(transStatus ? { transStatus } : {}),
				},
			}),
			providesTags: (_result, _error, { service, page }) => [
				{ type: 'PayReport', id: `${service}_HISTORY_${page}` },
			],
		}),
		getPayDashboard: builder.query<{ body?: PayDashboardBody }, PayDashboardParams>({
			query: ({ service, dateStart, dateEnd }) => ({
				url: `/pay/report/${service}/dashboard`,
				method: 'GET',
				params: {
					dateStart,
					dateEnd,
				},
			}),
			providesTags: (_result, _error, { service }) => [
				{ type: 'PayReport', id: `${service}_DASHBOARD` },
			],
		}),
	}),
});

export const {
	useGetPayHistoryQuery,
	useGetPayDashboardQuery,
	useLazyGetPayHistoryQuery,
} = payReportApiSlice;
export default payReportApiSlice;
