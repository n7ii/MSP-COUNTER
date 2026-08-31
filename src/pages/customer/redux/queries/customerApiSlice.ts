import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts';

export const customerApiSlice = createApi({
	reducerPath: 'customerApi',
	baseQuery: baseQuery,
	tagTypes: ['Customer'],
	endpoints: (builder) => ({
		getCustomer: builder.query<
			any,
			{ page?: number; size?: number; search?: string; approved: boolean }
		>({
			query: ({ page = 0, size = 10, approved, search }) => ({
				url: '/customer',
				method: 'GET',
				params: { page, size, approved, search },
			}),
			providesTags: ({ page }) => [{ type: 'Customer', id: `PAGE_${page}` }],
		}),

		getCustomerDetail: builder.query<any, { id?: string; page?: number; size?: number }>({
			query: ({ id, page = 0, size = 10 }) => ({
				url: '/customer/moreDetail',
				method: 'GET',
				params: { id, page, size },
			}),
			providesTags: ({ page }) => [{ type: 'Customer', id: `PAGE_${page}` }],
		}),

		getCustomerDocs: builder.query<any, { id?: any | undefined }>({
			query: ({ id }) => ({
				url: '/customer/doc',
				method: 'GET',
				params: { id }, // Pass the id correctly as a parameter
			}),
			providesTags: [{ type: 'Customer' }],
		}),

		vertifyDoc: builder.mutation<
			any,
			{ customerId: number; comment: string; verifiedPass: boolean }
		>({
			query: ({ customerId, comment, verifiedPass }) => ({
				url: '/customer/vertifyDoc',
				method: 'PUT',
				body: { customerId, comment, verifiedPass },
			}),
			invalidatesTags: [{ type: 'Customer' }],
		}),

		getCustomerById: builder.query<any, { customerId?: string }>({
			query: ({ customerId }) => ({
				url: '/customer/cusId',
				method: 'GET',
				params: { customerId },
			}),
			providesTags: [{ type: 'Customer' }],
		}),

		getDeviceDetail: builder.query<any, { customerId?: string }>({
			query: ({ customerId }) => ({
				url: '/customer/deviceDetail',
				method: 'GET',
				params: { customerId },
			}),
			providesTags: [{ type: 'Customer' }],
		}),
		updateWalletStatus: builder.mutation<
			any,
			{ usernameOrTel?: any; status: string; reason: string }
		>({
			query: ({ usernameOrTel, status, reason }) => ({
				url: '/walletStatus',
				method: 'POST',
				body: { usernameOrTel, status, reason },
			}),
			invalidatesTags: [{ type: 'Customer' }],
		}),

		updateCustomerInfo: builder.mutation<any, { customerId: number; data: any }>({
			query: ({ customerId, data }) => ({
				url: `/edit/customer/info?customerId=${customerId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Customer' }],
		}),

		updateCustomerType: builder.mutation<any, { customerId: number; data: any }>({
			query: ({ customerId, data }) => ({
				url: `/edit/customer/customer-type?customerId=${customerId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: [{ type: 'Customer' }],
		}),

		changeAdminPassword: builder.mutation<any, { adminId: number; newPassword: string }>({
			query: ({ adminId, newPassword }) => ({
				url: `/admin/change/password`,
				method: 'POST',
				body: { adminId, newPassword },
			}),
		}),

		resetCustomerPassword: builder.mutation<any, { customerId: number; data: any }>({
			query: ({ customerId, data }) => ({
				url: `/cutomer/otp/reset?customerId=${customerId}`,
				method: 'PUT',
				body: data,
			}),
		}),

		resetOtp: builder.mutation<any, { tel: string }>({
			query: ({ tel }) => ({
				url: '/cutomer/otp/unlock',
				method: 'POST',
				params: { tel },
			}),
		}),
		resetQuestion: builder.mutation<any, { tel: number }>({
			query: ({ tel }) => ({
				url: '/reset/question',
				method: 'GET',
				params: { tel },
			}),
		}),
	}),
});

export const {
	useResetOtpMutation,
	useResetCustomerPasswordMutation,
	useUpdateCustomerInfoMutation,
	useUpdateWalletStatusMutation,
	useResetQuestionMutation,
	useGetCustomerQuery,
	useVertifyDocMutation,
	useGetCustomerDetailQuery,
	useGetDeviceDetailQuery,
	useGetCustomerDocsQuery,
	useGetCustomerByIdQuery,
	useChangeAdminPasswordMutation,
	useUpdateCustomerTypeMutation,
} = customerApiSlice;
export default customerApiSlice;
