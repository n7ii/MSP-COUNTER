import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts'; // Adjust the import according to your file structure
type PeriodType = 'WEEK' | 'MONTH' | 'YEAR';

interface DashboardQueryParams {
	period?: PeriodType;
	useCustomize?: boolean;
	dateStart?: string;
	dateEnd?: string;
}

export const dashBroadApiSlice = createApi({
	reducerPath: 'dashBroadApiSlice',
	baseQuery: baseQuery,
	tagTypes: ['Dashboard'],
	endpoints: (builder) => ({
		getReconcile: builder.query<any, { glAcct: any }>({
			query: ({ glAcct }) => ({
				url: `/txnWallet/gl/detail?glAccountNumber=${glAcct}`,
				method: 'GET',
			}),
		}),
		getAcctList: builder.query<any, void>({
			query: () => ({
				url: `txnWallet/account/List`,
				method: 'GET',
			}),
		}),
		getDashBroad: builder.query<any, DashboardQueryParams>({
			query: (params) => ({
				url: `/dashboard`,
				method: 'POST',
				body: params.useCustomize
					? {
							period: params.period,
							useCustomize: true,
							dateStart: params.dateStart,
							dateEnd: params.dateEnd,
						}
					: {
							period: params.period,
						},
			}),
		}),

		getDashBroadDetail: builder.query<any, DashboardQueryParams>({
			query: (params) => ({
				url: `/dashboard/detail`,
				method: 'POST',
				body: params.useCustomize
					? {
							period: params.period,
							useCustomize: true,
							dateStart: params.dateStart,
							dateEnd: params.dateEnd,
						}
					: {
							period: params.period,
						},
			}),
		}),

		getSummaryFee: builder.query<any, { dateStart: string; dateEnd: string }>({
			query: (body) => ({
				url: `txnWallet/summary/fee`,
				method: 'POST',
				body: body,
			}),
		}),
	}),
});

export const {
	useGetSummaryFeeQuery,
	useGetDashBroadQuery,
	useGetDashBroadDetailQuery,
	useGetReconcileQuery,
	useGetAcctListQuery,
} = dashBroadApiSlice;
export default dashBroadApiSlice;
