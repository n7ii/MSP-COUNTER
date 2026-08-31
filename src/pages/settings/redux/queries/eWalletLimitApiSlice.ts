import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts';

export const walletLimitApiSlice = createApi({
	reducerPath: 'walletLimitApiSlice',
	baseQuery: baseQuery,
	tagTypes: ['walletLimit'],
	endpoints: (builder) => ({
		getWalletLimit: builder.query<any, { page?: number; size?: number; search?: string }>({
			query: ({ page = 0, size = 10, search = '' }) => ({
				url: '/walletLimit',
				method: 'GET',
				params: { page, size, search },
			}),
			providesTags: ({ page }) => [{ type: 'walletLimit', id: `PAGE_${page}` }],
		}),
		createWalletLimit: builder.mutation<any, any>({
			query: (newTxnType) => ({
				url: '/walletLimit',
				method: 'POST',
				body: newTxnType,
			}),
			invalidatesTags: [{ type: 'walletLimit' }],
		}),
		updateWalletLimit: builder.mutation<
			any,
			{
				walletId: number;
				maxAmount: string;
				minAmount: string;
				cusTypeId: string;
				status: boolean;
			}
		>({
			query: ({ walletId, ...updateData }) => ({
				url: `/walletLimit?id=${walletId}`,
				method: 'PUT',
				body: updateData,
			}),
			invalidatesTags: [{ type: 'walletLimit' }],
		}),
		deleteWalletLimit: builder.mutation<any, { id: number }>({
			query: ({ id }) => ({
				url: `/walletLimit?id=${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'walletLimit' }],
		}),
	}),
});

export const {
	useCreateWalletLimitMutation,
	useUpdateWalletLimitMutation,
	useGetWalletLimitQuery,
	useDeleteWalletLimitMutation,
} = walletLimitApiSlice;
export default walletLimitApiSlice;
