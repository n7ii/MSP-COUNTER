import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/pages/settings/redux/base-query.middleware.ts";

export const txnLimitApiSlice = createApi({
    reducerPath: "txnLimitApiSlice",
    baseQuery: baseQuery,
    tagTypes: ["txnLimit"],
    endpoints: (builder) => ({
        getTxnLimit: builder.query<any, { page?: number; size?: number; search?: string }>({
            query: ({ page = 0, size = 10, search = '' }) => ({
                url: "/txnLimit",
                method: "GET",
                params: { page, size, search },
            }),
            providesTags: ( { page }) => [
                { type: "txnLimit", id: `PAGE_${page}` },
            ],
        }),
        createTxnLimit: builder.mutation<any, { code: string; nameEn: string; nameLa: string; status: boolean }>({
            query: (newTxnType) => ({
                url: "/txnLimit",
                method: "POST",
                body: newTxnType,
            }),
            invalidatesTags: [{ type: "txnLimit" }],
        }),
        updateTxnLimit: builder.mutation<any, { id: number; code: string; nameEn: string; nameLa: string; status: boolean }>({
            query: ({ id, ...updateData }) => ({
                url: `/txnLimit?id=${id}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: [{ type: "txnLimit" }],
        }),
    }),
});

export const { useCreateTxnLimitMutation, useUpdateTxnLimitMutation, useGetTxnLimitQuery } = txnLimitApiSlice;
export default txnLimitApiSlice;
