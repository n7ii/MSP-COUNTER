import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts';
import {
	CancelApiRequest,
	CancelApiResponse,
	GetApisDataResponse,
	SearchApisQuery,
	UploadApiPayload,
	UploadApiResponse,
} from '@/pages/apisManagement/types/apisManagement.types.ts';

export const apisManagementApiSlice = createApi({
	reducerPath: 'apisManagementApi',
	baseQuery: baseQuery,
	tagTypes: ['ApisData'],
	endpoints: (builder) => ({
		getApisData: builder.query<GetApisDataResponse, SearchApisQuery>({
			query: ({ startDate, endDate }) => ({
				url: '/apis/searchByDate',
				method: 'POST',
				body: {
					startDate,
					endDate,
				},
			}),
			providesTags: ['ApisData'],
		}),
		cancelApi: builder.mutation<CancelApiResponse, CancelApiRequest>({
			query: ({ trn_id }) => ({
				url: '/apis/cancel',
				method: 'PATCH',
				body: {
					trn_id,
				},
			}),
			invalidatesTags: ['ApisData'],
		}),
		uploadApisData: builder.mutation<UploadApiResponse, UploadApiPayload>({
			query: (data) => ({
				url: '/apis/uplodad',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['ApisData'],
		}),
	}),
});

export const { useGetApisDataQuery, useCancelApiMutation, useUploadApisDataMutation } =
	apisManagementApiSlice;

export default apisManagementApiSlice;
