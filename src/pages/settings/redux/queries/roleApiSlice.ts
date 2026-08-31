import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts'; // Adjust the import according to your file structure

export const roleApiSlice = createApi({
	reducerPath: 'roleApiSlice',
	baseQuery: baseQuery,
	tagTypes: ['Role'],
	endpoints: (builder) => ({
		getRole: builder.query<any, { page?: number; size?: number }>({
			query: ({ page = 0, size = 10 }) => ({
				url: `/role`,
				method: 'GET',
				params: { page, size },
			}),
			providesTags: (result) =>
				result
					? result.body?.content?.map(({ id }: { id: number }) => ({ type: 'Role', id }))
					: [],
		}),
		createRole: builder.mutation<any, any>({
			query: (roleName) => ({
				url: `/role`,
				method: 'POST',
				body: roleName,
			}),
			invalidatesTags: [{ type: 'Role' }],
		}),
		updateRole: builder.mutation<any, { id: number; roleData: any }>({
			query: ({ id, roleData }) => ({
				url: `/role?id=${id}`,
				method: 'PUT',
				body: roleData,
			}),
			invalidatesTags: [{ type: 'Role' }],
		}),
	}),
});

export const { useGetRoleQuery, useCreateRoleMutation, useUpdateRoleMutation } = roleApiSlice;
export default roleApiSlice;
