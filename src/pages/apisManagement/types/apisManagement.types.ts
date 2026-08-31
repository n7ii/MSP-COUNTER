// API Response Types
export interface ApiResponseHeader {
	status: string;
	message: string;
	timestamp?: string;
}

export interface ApiResponse<T = any> {
	header: ApiResponseHeader;
	body: T;
}

// Debit Entry Types
export interface DebitEntry {
	dr_ac: string;
	dr_amt: string;
	dr_desc: string;
}

// Credit Entry Types
export interface CreditEntry {
	cr_ac: string;
	cr_amt: string;
}

// API Transaction Data Types
export interface ApiTransactionData {
	trn_id: string;
	trn_desc: string;
	bis_date: string;
	status: 'wait' | 'cancel' | 'success' | string;
	create_date: string;
	update_date?: string;
	currency: string;
	acc_book: string;
	ex_rate: string | number;
	fail_reason?: string;
	debit: DebitEntry[];
	credit: CreditEntry[];
}

// Upload Request Payload
export interface UploadApiPayload {
	trn_id: string;
	trn_desc: string;
	bis_date: string;
	status: string;
	create_date: string;
	currency: string;
	acc_book: string;
	ex_rate: string | number;
	debit: DebitEntry[];
	credit: CreditEntry[];
}

// Search Query Types
export interface SearchApisQuery {
	startDate?: string;
	endDate?: string;
}

// Cancel API Request
export interface CancelApiRequest {
	trn_id: string;
}

// Cancel API Response
export interface CancelApiResponse extends ApiResponse<null> {}

// Get APIs Data Response
export interface GetApisDataResponse extends ApiResponse<ApiTransactionData[]> {}

// Upload API Response
export interface UploadApiResponse extends ApiResponse<ApiTransactionData> {}

// Form Values for Formik
export interface UploadApiFormValues {
	trn_id: string;
	trn_desc: string;
	bis_date: string;
	status: string;
	create_date: string;
	currency?: string;
	acc_book: string;
	ex_rate?: string;
	debit: DebitEntry[];
	credit: CreditEntry[];
}

// Modal Props Types
export interface UploadApiModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: UploadApiFormValues) => Promise<void>;
	isLoading: boolean;
}

// Table Column Data Type
export interface ApiTableData extends ApiTransactionData {
	no?: number;
}

// Status Badge Types
export type TransactionStatus = 'wait' | 'cancel' | 'success';

// Pagination State
export interface PaginationState {
	pageIndex: number;
	pageSize: number;
}

// Date Range State (for react-date-range)
export interface DateRangeState {
	startDate: Date;
	endDate: Date;
	key: string;
}
