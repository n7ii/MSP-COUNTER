import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts'; // Adjust the import according to your file structure

export const feesApiSlice = createApi({
	reducerPath: 'feesApiSlice',
	baseQuery: baseQuery,
	tagTypes: ['Fees'],
	endpoints: (builder) => ({
		getFees: builder.query<
			any,
			{ page?: number; size?: number; search?: string; customerType?: string; ccy?: string }
		>({
			query: ({ page = 0, size = 10, search = '', customerType = '', ccy = '' }) => ({
				url: `/fees/get`,
				method: 'POST',
				params: { page, size, search },
				body: { customerType, ccy },
			}),
			providesTags: (result) =>
				result
					? result.body?.content?.map(({ id }: { id: number }) => ({
							type: 'Fees',
							id,
						}))
					: [],
		}),

		getFeeOption: builder.query<any, void>({
			query: () => ({
				url: `/fees/options`,
				method: 'GET',
			}),
		}),
		createFee: builder.mutation<any, any>({
			query: (newFee) => ({
				url: `/fees`,
				method: 'POST',
				body: newFee,
			}),
			invalidatesTags: [{ type: 'Fees' }],
		}),
		updateFee: builder.mutation<any, { id: number; feeData: any }>({
			query: ({ id, feeData }) => ({
				url: `/fees?id=${id}`,
				method: 'PUT',
				body: feeData,
			}),
			invalidatesTags: [{ type: 'Fees' }],
		}),
		deleteFee: builder.mutation<any, { id: number }>({
			query: ({ id }) => ({
				url: `/fees`,
				method: 'DELETE',
				params: { id },
			}),
			invalidatesTags: [{ type: 'Fees' }],
		}),
	}),
});

export const {
	useGetFeesQuery,
	useCreateFeeMutation,
	useUpdateFeeMutation,
	useDeleteFeeMutation,
	useGetFeeOptionQuery,
} = feesApiSlice;
export default feesApiSlice;
