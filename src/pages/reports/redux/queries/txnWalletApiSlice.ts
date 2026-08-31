import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts';

// Define the API slice
export const txnWalletApiSlice = createApi({
	reducerPath: 'TxnWalletApi',
	baseQuery: baseQuery,
	tagTypes: ['TxnWallet'],
	endpoints: (builder) => ({
		getTxnWalletReport: builder.query<
			any,
			{
				page?: number;
				size?: number;
				dateStart?: string;
				dateEnd?: string;
				walletNo?: string;
			}
		>({
			query: ({ page = 0, size = 10, dateStart, dateEnd, walletNo }) => ({
				url: '/txnWallet/report',
				method: 'POST', // Use POST method since you're sending a body
				params: {
					page, // Send pagination as query params
					size, // Send pagination as query params
				},
				body: {
					walletNo: walletNo, // Send walletNo in the body
					refNo: walletNo, // Send refNo in the body
					dateStart, // Send dateStart in the body
					dateEnd, // Send dateEnd in the body
				},
			}),
			providesTags: ({ page }) => [{ type: 'TxnWallet', id: `PAGE_${page}` }],
		}),
		getCustomerStatement: builder.query<
			any,
			{
				page?: number;
				size?: number;
				dateStart?: string;
				dateEnd?: string;
				customerUsername?: string;
				sort?: string;
			}
		>({
			query: ({ page = 0, size = 10, dateStart, dateEnd, customerUsername, sort }) => ({
				url: '/txnWallet/summary/customer/statement',
				method: 'POST',
				params: {
					page,
					size,
					sort,
				},
				body: {
					customerUsername: customerUsername,
					customerTel: customerUsername,
					dateStart,
					dateEnd,
				},
			}),
			providesTags: ({ page }) => [{ type: 'TxnWallet', id: `PAGE_${page}` }],
		}),
		getSummaryGL: builder.query<
			any,
			{
				page?: number;
				size?: number;
				dateStart?: string;
				dateEnd?: string;
				wlNo?: string;
				type?: string;
			}
		>({
			query: ({ page = 0, size = 10, dateStart, dateEnd, type, wlNo }) => ({
				url: '/txnWallet/summary/gl',
				method: 'POST', // Use POST method since you're sending a body
				params: {
					page, // Send pagination as query params
					size, // Send pagination as query params
				},
				body: {
					wlNo,
					type, // Send walletNo in the body
					dateStart, // Send dateStart in the body
					dateEnd, // Send dateEnd in the body
				},
			}),
			providesTags: ({ page }) => [{ type: 'TxnWallet', id: `PAGE_${page}` }],
		}),

		// OLD API — commented, replaced by GET /pay/report/{water|phone|edl|easy}/history|dashboard
		// getWaterReport: builder.query<
		// 	any,
		// 	{
		// 		page?: number;
		// 		size?: number;
		// 		dateStart?: string;
		// 		dateEnd?: string;
		// 		provinceCode?: string;
		// 		walletNo?: string;
		// 	}
		// >({
		// 	query: ({ page = 0, size = 10, dateStart, dateEnd, provinceCode, walletNo }) => ({
		// 		url: '/report/water',
		// 		method: 'POST',
		// 		params: { page, size },
		// 		body: { provinceCode, walletNo, dateStart, dateEnd },
		// 	}),
		// 	providesTags: ({ page }) => [{ type: 'TxnWallet', id: `PAGE_${page}` }],
		// }),
		// getBillPhone: builder.query<
		// 	any,
		// 	{
		// 		page?: number;
		// 		size?: number;
		// 		dateStart?: string;
		// 		dateEnd?: string;
		// 		vendor?: string;
		// 		username?: string;
		// 		msisdn?: string;
		// 	}
		// >({
		// 	query: ({ page = 0, size = 10, dateStart, dateEnd, vendor, username, msisdn }) => ({
		// 		url: '/report/phoneBill',
		// 		method: 'POST',
		// 		params: { page, size },
		// 		body: { vendor, username, msisdn, dateStart, dateEnd },
		// 	}),
		// 	providesTags: ({ page }) => [{ type: 'TxnWallet', id: `PAGE_${page}` }],
		// }),
		// getEdlReport: builder.query<
		// 	any,
		// 	{
		// 		page?: number;
		// 		size?: number;
		// 		dateStart?: string;
		// 		dateEnd?: string;
		// 		walletNo?: string;
		// 		edlAccountNo?: string;
		// 	}
		// >({
		// 	query: ({ page = 0, size = 10, dateStart, dateEnd, walletNo, edlAccountNo }) => ({
		// 		url: '/report/edl',
		// 		method: 'POST',
		// 		params: { page, size },
		// 		body: { walletNo, edlAccountNo, dateStart, dateEnd },
		// 	}),
		// 	providesTags: ({ page }) => [{ type: 'TxnWallet', id: `PAGE_${page}` }],
		// }),
		// getEasyTax: builder.query<
		// 	any,
		// 	{
		// 		page?: number;
		// 		size?: number;
		// 		dateStart?: string;
		// 		dateEnd?: string;
		// 		xref?: string;
		// 		barCode?: string;
		// 		tin?: string;
		// 	}
		// >({
		// 	query: ({ page = 0, size = 10, dateStart, dateEnd, xref, barCode, tin }) => ({
		// 		url: '/report/easyTax',
		// 		method: 'POST',
		// 		params: { page, size },
		// 		body: { xref, barCode, tin, dateStart, dateEnd },
		// 	}),
		// 	providesTags: ({ page }) => [{ type: 'TxnWallet', id: `PAGE_${page}` }],
		// }),

		getProvince: builder.query<any, void>({
			query: () => ({
				url: '/options/province',
				method: 'GET',
			}),
		}),

		getSmsReport: builder.query<
			any,
			{
				provider?: string;
				dateStart?: string;
				dateEnd?: string;
			}
		>({
			query: ({ provider, dateStart, dateEnd }) => ({
				url: '/sms',
				method: 'GET',
				params: {
					provider,
					dateStart,
					dateEnd,
				},
			}),
		}),
	}),
});

export const {
	useGetProvinceQuery,
	useGetTxnWalletReportQuery,
	useGetCustomerStatementQuery,
	useGetSummaryGLQuery,
	useGetSmsReportQuery,
	useLazyGetSmsReportQuery,
	// OLD API hooks — commented
	// useGetEasyTaxQuery,
	// useGetEdlReportQuery,
	// useGetWaterReportQuery,
	// useGetBillPhoneQuery,
	// useLazyGetEdlReportQuery,
} = txnWalletApiSlice;
export default txnWalletApiSlice;
