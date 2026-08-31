import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/pages/settings/redux/base-query.middleware.ts";

export const txnTypeApiSlice = createApi({
    reducerPath: "txnTypeApiSlice",
    baseQuery: baseQuery,
    tagTypes: ["TxnType"],
    endpoints: (builder) => ({
        getTxnType: builder.query<any, { page?: number; size?: number; search?: string }>({
            query: ({ page = 0, size = 10 }) => ({
                url: "/txnType",
                method: "GET",
                params: { page, size },
            }),
            providesTags: ( { page }) => [
                { type: "TxnType", id: `PAGE_${page}` },
            ],
        }),
        createTxnType: builder.mutation<any, { code: string; nameEn: string; nameLa: string; status: boolean }>({
            query: (newTxnType) => ({
                url: "/txnType",
                method: "POST",
                body: newTxnType,
            }),
            invalidatesTags: [{ type: "TxnType" }],
        }),
        updateTxnType: builder.mutation<any, { id: number; code: string; nameEn: string; nameLa: string; status: boolean }>({
            query: ({ id, ...updateData }) => ({
                url: `/txnType?id=${id}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: [{ type: "TxnType" }],
        }),
    }),
});

export const { useGetTxnTypeQuery, useCreateTxnTypeMutation, useUpdateTxnTypeMutation } = txnTypeApiSlice;
export default txnTypeApiSlice;
