import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/redux/base-query.middleware';

export const userApiSlice = createApi({
	reducerPath: 'userApiSlice',
	baseQuery: baseQuery,
	tagTypes: ['User'],
	endpoints: (builder) => ({
		getRegister: builder.query<any, { page?: number; size?: number; search?: string }>({
			query: ({ page = 0, size = 10, search = '' }) => ({
				url: '/authz/regis/getRegister',
				method: 'GET',
				params: { page, size, search },
			}),
			providesTags: ({ page }) => [{ type: 'User', id: `PAGE_${page}` }],
		}),
		approveUser: builder.mutation<any, { id: number; roles: string }>({
			query: ({ id, roles }) => ({
				url: `/authz/regis/approved?id=${id}`,
				method: 'POST',
				body: {
					role: roles, // Send roles in the body
				},
			}),
			invalidatesTags: ['User'], // Adjust this based on your tag system
		}),

		getRole: builder.query<any, void>({
			query: () => ({
				url: '/authz/role',
				method: 'GET',
			}),
		}),
	}),
});

export const { useGetRegisterQuery, useApproveUserMutation, useGetRoleQuery } = userApiSlice;
export default userApiSlice;
