import { isAxiosError } from 'axios';
import { api } from '@/pages/settings/redux/api.ts';

const SUCCESS_STATUS = '01';
const ROW_LIST_KEYS = ['content', 'rows', 'items', 'data', 'list', 'details'] as const;
const BALANCE_KEYS = [
	'balance',
	'currentBalance',
	'availableBalance',
	'avBalance',
	'avbalance',
	'amount',
] as const;

export type SalaryRowStatus = 'NORMAL' | 'ERROR';

export interface SalaryRow {
	id?: number;
	tel?: string;
	amount?: number;
	uuid?: string;
	month?: number;
	year?: number;
	wlName?: string | null;
	wlNo?: string | null;
	status?: SalaryRowStatus | string | null;
	message?: string | null;
	sstatus?: number | null;
}

export interface SalaryAccount {
	raw: Record<string, unknown>;
	balance: number | null;
	balanceField: string | null;
	currency: string | null;
	accountNo: string | null;
	accountName: string | null;
}

interface Envelope<T> {
	header?: { status?: string; message?: string };
	body?: T;
}

export interface ImportSalaryParams {
	file: File;
	month: number;
	year: number;
	progressId: string;
}

const unwrap = <T>(data: Envelope<T> | undefined, fallbackMessage: string): T => {
	if (data?.header?.status !== SUCCESS_STATUS) {
		throw new Error(data?.header?.message || fallbackMessage);
	}
	return data.body as T;
};

export const getErrorMessage = (error: unknown, fallback = 'ເກີດຂໍ້ຜິດພາດ'): string => {
	if (isAxiosError(error)) {
		const data = error.response?.data as Envelope<unknown> & { message?: string };
		return data?.header?.message || data?.message || error.message || fallback;
	}
	if (error instanceof Error && error.message) return error.message;
	return fallback;
};

const saveBlob = (blob: Blob, filename: string) => {
	const href = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = href;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(href);
};

const filenameFromDisposition = (disposition: unknown): string | null => {
	if (typeof disposition !== 'string') return null;
	const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
	if (!match) return null;
	try {
		return decodeURIComponent(match[1]);
	} catch {
		return match[1];
	}
};

const downloadFile = async (
	path: string,
	params: Record<string, string> | undefined,
	fallbackName: string,
): Promise<void> => {
	const response = await api.get<Blob>(path, { params, responseType: 'blob' });
	const blob = response.data;

	if (blob.type.includes('json')) {
		const parsed = JSON.parse(await blob.text()) as Envelope<unknown>;
		throw new Error(parsed?.header?.message || 'ດາວໂຫຼດໄຟລ໌ບໍ່ສຳເລັດ');
	}

	saveBlob(blob, filenameFromDisposition(response.headers['content-disposition']) ?? fallbackName);
};

export const downloadSalaryTemplate = (): Promise<void> =>
	downloadFile('salary/template', undefined, 'salary_import_template.xlsx');

const toNumber = (value: unknown): number | null => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	if (typeof value === 'string' && value.trim() !== '') {
		const n = Number(value.replace(/,/g, ''));
		return Number.isFinite(n) ? n : null;
	}
	return null;
};

const toText = (value: unknown): string | null =>
	typeof value === 'string' && value.trim() !== '' ? value : null;

export const parseSalaryAccount = (body: unknown): SalaryAccount => {
	const raw = (Array.isArray(body) ? body[0] : body) as Record<string, unknown> | undefined;
	const source = raw && typeof raw === 'object' ? raw : {};

	let balance: number | null = null;
	let balanceField: string | null = null;
	for (const key of BALANCE_KEYS) {
		const value = toNumber(source[key]);
		if (value !== null) {
			balance = value;
			balanceField = key;
			break;
		}
	}

	return {
		raw: source,
		balance,
		balanceField,
		currency: toText(source.ccy) ?? toText(source.currency),
		accountNo: toText(source.accountNo) ?? toText(source.acctNo) ?? toText(source.glAcct),
		accountName: toText(source.accountName) ?? toText(source.acctName) ?? toText(source.name),
	};
};

export const getSalaryAccount = async (): Promise<SalaryAccount> => {
	const response = await api.get<Envelope<unknown>>('salary/account');
	return parseSalaryAccount(unwrap(response.data, 'ໂຫຼດຍອດເງິນບັນຊີ SALARY ບໍ່ສຳເລັດ'));
};

export const importSalary = async ({
	file,
	month,
	year,
	progressId,
}: ImportSalaryParams): Promise<string> => {
	const form = new FormData();
	form.append('file', file);
	form.append('month', String(month));
	form.append('year', String(year));
	form.append('progressId', progressId);

	const response = await api.post<Envelope<{ uuid?: string }>>('salary/import', form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	const body = unwrap(response.data, 'ນຳເຂົ້າໄຟລ໌ບໍ່ສຳເລັດ');

	if (!body?.uuid) throw new Error('ເຊີບເວີບໍ່ໄດ້ສົ່ງ Lot ID ກັບມາ');
	return body.uuid;
};

const extractRecords = (body: unknown): Record<string, unknown>[] => {
	if (Array.isArray(body)) return body as Record<string, unknown>[];

	if (body && typeof body === 'object') {
		const record = body as Record<string, unknown>;
		for (const key of ROW_LIST_KEYS) {
			if (Array.isArray(record[key])) return record[key] as Record<string, unknown>[];
		}
	}
	return [];
};

export const extractSalaryRows = (body: unknown): SalaryRow[] =>
	extractRecords(body) as SalaryRow[];

export interface SalaryHistoryItem extends SalaryRow {
	createdBy?: string | null;
	lastModifiedBy?: string | null;
}

export interface SalaryHistoryGroup {
	uuid: string;
	month?: number | null;
	year?: number | null;
	/** Number of salary rows in the lot. */
	total?: number | null;
	createdDate?: string | null;
	createdBy?: string | null;
	paidAmount?: number | null;
}

export interface SalaryHistoryGroupPage {
	groups: SalaryHistoryGroup[];
	/** Total number of groups when the server paginates, otherwise null (full list returned). */
	totalElements: number | null;
}

/** Both tabs share the same flow and response shape; only the path segment differs. */
export type SalaryGroupSource = 'history' | 'paid';

export const getSalaryHistoryGroups = async (
	source: SalaryGroupSource,
	page: number,
	size: number,
): Promise<SalaryHistoryGroupPage> => {
	const response = await api.get<Envelope<{ total?: number; groups?: SalaryHistoryGroup[] }>>(
		`salary/${source}/group`,
		{ params: { page, size } },
	);
	const body = unwrap(response.data, 'ໂຫຼດປະຫວັດບໍ່ສຳເລັດ');

	const groups = Array.isArray(body?.groups) ? body.groups : [];
	const total = toNumber(body?.total);

	return { groups, totalElements: total !== null && groups.length < total ? total : null };
};

export const getSalaryHistoryDetail = async (
	source: SalaryGroupSource,
	uuid: string,
): Promise<SalaryHistoryItem[]> => {
	const response = await api.get<Envelope<unknown>>(`salary/${source}/group/detail`, {
		params: { uuid },
	});
	return extractRecords(unwrap(response.data, 'ໂຫຼດລາຍລະອຽດບໍ່ສຳເລັດ')) as SalaryHistoryItem[];
};

export const downloadSalaryHistory = async (
	source: SalaryGroupSource,
	uuid: string,
): Promise<void> => {
	await downloadFile(
		`salary/${source}/group/detail/download`,
		{ uuid },
		`salary_${source}_${uuid.slice(0, 8)}.xlsx`,
	);
};

export interface SalaryCheckResult {
	rows: SalaryRow[];
	/** True when the server reported the check as failed but still returned the rows. */
	failed: boolean;
	message: string | null;
	accountingBalance: number | null;
	requiredAmount: number | null;
	enough: boolean | null;
}

export const checkSalary = async (uuid: string): Promise<SalaryCheckResult> => {
	// A failed check answers HTTP 400 with the offending rows in `body`, so 400 must not be
	// treated as a transport error (that would hide the rows and pop a generic alert).
	const response = await api.post<Envelope<unknown>>(
		'salary/check',
		{ uuid },
		{ validateStatus: (status) => (status >= 200 && status < 300) || status === 400 },
	);

	const { header, body } = response.data ?? {};
	const rows = extractSalaryRows(body);
	const failed = header?.status !== SUCCESS_STATUS;

	if (failed && rows.length === 0) {
		throw new Error(header?.message || 'ກວດສອບຂໍ້ມູນບໍ່ສຳເລັດ');
	}

	const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

	return {
		rows,
		failed,
		message: failed ? (header?.message ?? null) : null,
		accountingBalance: toNumber(record.accountingBalance),
		requiredAmount: toNumber(record.requiredAmount),
		enough: typeof record.enough === 'boolean' ? record.enough : null,
	};
};

export const confirmSalary = async (uuid: string): Promise<unknown> => {
	const response = await api.post<Envelope<unknown>>('salary/confirm', { uuid });
	return unwrap(response.data, 'ຢືນຢັນຈ່າຍເງິນເດືອນບໍ່ສຳເລັດ');
};
