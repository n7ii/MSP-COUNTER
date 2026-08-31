import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/pages/settings/redux/base-query.middleware.ts';

// Response interfaces
interface ApiHeader {
	timestamp: string;
	code: string;
	message: string;
	status: string;
	traceId: string;
}

interface RevertHistoryItem {
	createdBy: string;
	lastModifiedBy: string;
	id: number;
	time_revert: string | null;
	referenceId: string;
	code: string;
	roll_back: string | null;
	message: string;
	revert_txn_no: string | null;
	revert_ref: string | null;
	amount: number | null;
	fee: number | null;
	revert_username: string | null;
	revert_tel: string | null;
	revert_name: string | null;
	revert_sure_name: string | null;
}

interface Pageable {
	sort: {
		unsorted: boolean;
		sorted: boolean;
		empty: boolean;
	};
	pageNumber: number;
	pageSize: number;
	offset: number;
	paged: boolean;
	unpaged: boolean;
}

interface RevertHistoryBody {
	content: RevertHistoryItem[];
	pageable: Pageable;
	totalPages: number;
	totalElements: number;
	last: boolean;
	sort: {
		unsorted: boolean;
		sorted: boolean;
		empty: boolean;
	};
	first: boolean;
	numberOfElements: number;
	size: number;
	number: number;
	empty: boolean;
}

interface RevertHistoryResponse {
	header: ApiHeader;
	body: RevertHistoryBody;
}

interface TransactionDetail {
	createdBy: string;
	lastModifiedBy: string;
	id: number;
	dtrq: string;
	rfNo: string;
	receiptNo: string | null;
	customer: string;
	channel: string;
	fromMember: string;
	toMember: string;
	wlNo: string;
	fwlNo: string;
	fwlName: string;
	fccy: string;
	ftel: string;
	twlNo: string;
	twlName: string;
	tccy: string;
	ttel: string;
	txNo: string;
	txnDate: string;
	bisDate: string;
	debit: number;
	credit: number;
	amount: number;
	ccy: string;
	beforeTXN: number;
	afterTXN: number;
	fee: number;
	feeCcy: string;
	rate: number;
	rateCcy: string;
	drcrgType: string;
	dpwdType: string;
	stmType: string;
	remark: string;
	status: boolean;
	txstatus: number;
	circ: string;
	atvtacct: string;
	func: string;
}

interface RevertDetailResponse {
	header: ApiHeader;
	body: TransactionDetail[];
}

interface RevertResponse {
	header: ApiHeader;
	body: any;
}

interface RevertRequest {
	transactionId: string;
	reason: string;
}

export const revertApiSlice = createApi({
	reducerPath: 'revertApi',
	baseQuery: baseQuery,
	tagTypes: ['Revert'],
	endpoints: (builder) => ({
		getRevertHistory: builder.query<
			RevertHistoryResponse,
			{ transactionId?: string; page?: number; size?: number }
		>({
			query: ({ transactionId, page = 0, size = 10 }) => ({
				url: '/revert/history',
				method: 'GET',
				params: transactionId ? { transactionId, page, size } : { page, size },
			}),
			providesTags: (_, __, { transactionId, page }) => [
				{ type: 'Revert', id: `HISTORY_${transactionId || 'ALL'}_PAGE_${page}` },
			],
		}),

		getRevertDetail: builder.query<RevertDetailResponse, { transactionId: string }>({
			query: ({ transactionId }) => ({
				url: '/revert/detail',
				method: 'GET',
				params: { transactionId },
			}),
			providesTags: (_, __, { transactionId }) => [
				{ type: 'Revert', id: `DETAIL_${transactionId}` },
			],
		}),

		revertTransaction: builder.mutation<RevertResponse, RevertRequest>({
			query: ({ transactionId, reason }) => ({
				url: '/revert',
				method: 'POST',
				body: { transactionId, reason },
			}),
			invalidatesTags: (_, __, { transactionId }) => [
				{ type: 'Revert', id: `HISTORY_${transactionId}_PAGE_0` },
				{ type: 'Revert', id: `DETAIL_${transactionId}` },
			],
		}),
	}),
});

export const { useGetRevertHistoryQuery, useGetRevertDetailQuery, useRevertTransactionMutation } =
	revertApiSlice;

export default revertApiSlice;
