import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts'; // Adjust the import according to your file structure

export const questionApiSlice = createApi({
	reducerPath: 'questionApiSlice',
	baseQuery: baseQuery,
	tagTypes: ['Question'],
	endpoints: (builder) => ({
		getQuestion: builder.query<any, { page?: number; size?: number }>({
			query: ({ page = 0, size = 10 }) => ({
				url: `/question`,
				method: 'GET',
				params: { page, size },
			}),
			providesTags: (result) =>
				result
					? result.body?.content?.map(({ id }: { id: number }) => ({
							type: 'Question',
							id,
						}))
					: [],
		}),
		createQuestion: builder.mutation<any, any>({
			query: (questionName) => ({
				url: `/question`,
				method: 'POST',
				body: questionName,
			}),
			invalidatesTags: [{ type: 'Question' }],
		}),
		updateQuestion: builder.mutation<any, { id: number; questionData: any }>({
			query: ({ id, questionData }) => ({
				url: `/question?id=${id}`,
				method: 'PUT',
				body: questionData,
			}),
			invalidatesTags: [{ type: 'Question' }],
		}),
	}),
});

export const { useGetQuestionQuery, useCreateQuestionMutation, useUpdateQuestionMutation } =
	questionApiSlice;
export default questionApiSlice;
