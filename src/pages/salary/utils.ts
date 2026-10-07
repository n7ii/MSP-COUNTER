import { ProgressMessage } from '@/pages/salary/services/progressSocket.ts';
import { SalaryRow } from '@/pages/salary/services/salaryApi.ts';

export const MAX_RECORDS = 500;
export const MAX_FILE_SIZE_MB = 15;
export const CURRENCY = 'LAK';
export const EXCEL_EXTENSIONS = ['.xlsx', '.xls'];
export const PAGE_SIZE = 10;

export const BTN_PRIMARY = 'bg-[#157F3F] font-semibold text-white data-[hover=true]:opacity-90';
export const BTN_BACK = 'bg-[#00706A] font-semibold text-white data-[hover=true]:opacity-90';
export const BTN_OUTLINE =
	'border-1 border-[#157F3F] bg-transparent font-semibold text-[#157F3F] dark:text-emerald-400 dark:border-emerald-500';

export interface OperationProgress {
	percent: number;
	processed: number;
	total: number;
}

export const EMPTY_PROGRESS: OperationProgress = { percent: 0, processed: 0, total: 0 };

export const toProgress = (p: ProgressMessage): OperationProgress => ({
	percent: p.percent,
	processed: p.processed,
	total: p.total,
});

export const formatAmount = (value: number) =>
	Number.isInteger(value)
		? value.toLocaleString('en-US')
		: value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const isExcelFile = (file: File) =>
	EXCEL_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

export const isNormal = (row: SalaryRow) => row.status === 'NORMAL';

export const sumAmount = (rows: SalaryRow[]) =>
	rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

export const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
