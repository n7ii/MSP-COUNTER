import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts';

export const logApiSlice = createApi({
	reducerPath: 'logApiSlice',
	baseQuery: baseQuery,
	tagTypes: ['Log'],
	endpoints: (builder) => ({
		getNotificationLogs: builder.query<any, { page?: number; size?: number; search?: string }>({
			query: ({ page = 0, size = 10, search = '' }) => ({
				url: '/log/notification',
				method: 'GET',
				params: { page, size, search },
			}),
			providesTags: [{ type: 'Log', id: 'NOTIFICATION' }],
		}),
		getTransactionLogs: builder.query<any, { page?: number; size?: number; search?: string }>({
			query: ({ page = 0, size = 10, search = '' }) => ({
				url: '/log/transaction',
				method: 'GET',
				params: { page, size, search },
			}),
			providesTags: [{ type: 'Log', id: 'TRANSACTION' }],
		}),
		getCustomerLogs: builder.query<any, { page?: number; size?: number; search?: string }>({
			query: ({ page = 0, size = 10, search = '' }) => ({
				url: '/log/customer',
				method: 'GET',
				params: { page, size, search },
			}),
			providesTags: [{ type: 'Log', id: 'CUSTOMER' }],
		}),
		getTxnRequestLogs: builder.query<any, { page?: number; size?: number; search?: string }>({
			query: ({ page = 0, size = 10, search = '' }) => ({
				url: '/log/txn-request',
				method: 'GET',
				params: { page, size, search },
			}),
			providesTags: [{ type: 'Log', id: 'TXN_REQUEST' }],
		}),
	}),
});

export const {
	useGetNotificationLogsQuery,
	useGetTransactionLogsQuery,
	useGetCustomerLogsQuery,
	useGetTxnRequestLogsQuery,
} = logApiSlice;
export default logApiSlice;
