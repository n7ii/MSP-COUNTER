import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/reports/redux/base-query.middleware.ts';

export type VolteyHistoryParams = {
	page?: number;
	size?: number;
	dateStart?: string;
	dateEnd?: string;
	transStatus?: string;
};

export type VolteyDashboardParams = {
	dateStart?: string;
	dateEnd?: string;
};

export const volteyApiSlice = createApi({
	reducerPath: 'volteyApiSlice',
	baseQuery,
	tagTypes: ['Voltey'],
	endpoints: (builder) => ({
		getVolteyHistory: builder.query<any, VolteyHistoryParams>({
			query: ({ page = 0, size = 10, dateStart, dateEnd, transStatus }) => ({
				url: '/voltey/report/history',
				method: 'GET',
				params: {
					page,
					size,
					dateStart,
					dateEnd,
					...(transStatus ? { transStatus } : {}),
				},
			}),
			providesTags: (_result, _error, { page }) => [{ type: 'Voltey', id: `HISTORY_${page}` }],
		}),
		getVolteyDashboard: builder.query<any, VolteyDashboardParams>({
			query: ({ dateStart, dateEnd }) => ({
				url: '/voltey/report/dashboard',
				method: 'GET',
				params: {
					dateStart,
					dateEnd,
				},
			}),
			providesTags: [{ type: 'Voltey', id: 'DASHBOARD' }],
		}),
	}),
});

export const {
	useGetVolteyHistoryQuery,
	useGetVolteyDashboardQuery,
	useLazyGetVolteyHistoryQuery,
} = volteyApiSlice;
export default volteyApiSlice;
