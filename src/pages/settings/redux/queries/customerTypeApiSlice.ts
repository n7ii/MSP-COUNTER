import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/pages/settings/redux/base-query.middleware.ts";

export const customerTypeApiSlice = createApi({
    reducerPath: "customerTypeApi",
    baseQuery: baseQuery,
    tagTypes: ["CustomerType"],
    endpoints: (builder) => ({
        getCustomerType: builder.query<any, { page?: number; size?: number; search?: string }>({
            query: ({ page = 0, size = 10 }) => ({
                url: "/customerType",
                method: "GET",
                params: { page, size },
            }),
            providesTags: ({ page }) => [
                { type: "CustomerType", id: `PAGE_${page}` },
            ],
        }),
        createCustomerType: builder.mutation<
            any,
            { nameEn: string; nameLa: string; status: boolean; feeStatus: boolean; tplStatus: boolean }
        >({
            query: (customerType) => ({
                url: "/customerType",
                method: "POST",
                body: customerType,
            }),
            invalidatesTags: [{ type: "CustomerType" }],
        }),
        updateCustomerType: builder.mutation<
            any,
            { id: number; nameEn: string; nameLa: string; status: boolean; feeStatus: boolean; tplStatus: boolean }
        >({
            query: ({ id, ...updateData }) => ({
                url: `/customerType?id=${id}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: [{ type: "CustomerType" }],
        }),
    }),
});

export const { useGetCustomerTypeQuery, useCreateCustomerTypeMutation, useUpdateCustomerTypeMutation } =
    customerTypeApiSlice;
export default customerTypeApiSlice;
