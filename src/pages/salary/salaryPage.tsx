import { useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import { useAppSelector } from '@/redux/hooks.ts';
import CompleteView, { PayrollReceipt } from '@/pages/salary/components/CompleteView.tsx';
import ConfirmView from '@/pages/salary/components/ConfirmView.tsx';
import HistoryView from '@/pages/salary/components/HistoryView.tsx';
import PayrollStepper from '@/pages/salary/components/PayrollStepper.tsx';
import SalaryAccountCard from '@/pages/salary/components/SalaryAccountCard.tsx';
import UploadModal, { UploadStage } from '@/pages/salary/components/UploadModal.tsx';
import UploadPreviewView from '@/pages/salary/components/UploadPreviewView.tsx';
import { runWithProgress } from '@/pages/salary/services/progressSocket.ts';
import {
	checkSalary,
	confirmSalary,
	downloadSalaryTemplate,
	getErrorMessage,
	importSalary,
	SalaryCheckResult,
	SalaryRow,
} from '@/pages/salary/services/salaryApi.ts';
import {
	CURRENCY,
	EMPTY_PROGRESS,
	formatAmount,
	isExcelFile,
	isNormal,
	MAX_FILE_SIZE_MB,
	MAX_RECORDS,
	OperationProgress,
	sumAmount,
	toProgress,
} from '@/pages/salary/utils.ts';

type View = 'upload' | 'history' | 'paid' | 'confirm' | 'complete';

interface Lot {
	id: string;
	fileName: string;
	month: number;
	year: number;
}

const TRANSACTION_ID_KEYS = ['transactionId', 'txnId', 'txNo', 'refNo', 'referenceId', 'uuid'];

const pickTransactionId = (result: unknown, fallback: string): string => {
	if (result && typeof result === 'object') {
		const record = result as Record<string, unknown>;
		for (const key of TRANSACTION_ID_KEYS) {
			const value = record[key];
			if (typeof value === 'string' && value.trim()) return value;
		}
	}
	return fallback;
};

const SalaryPage = () => {
	const username = useAppSelector((state) => state.auth?.user?.body?.username);

	const [view, setView] = useState<View>('upload');
	const [month, setMonth] = useState<number | null>(() => dayjs().month() + 1);
	const [year, setYear] = useState<number | null>(() => dayjs().year());

	const [uploadOpen, setUploadOpen] = useState(false);
	const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
	const [uploadProgress, setUploadProgress] = useState<OperationProgress>(EMPTY_PROGRESS);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [templateLoading, setTemplateLoading] = useState(false);

	const [lot, setLot] = useState<Lot | null>(null);
	const [rows, setRows] = useState<SalaryRow[] | null>(null);
	const [checkInfo, setCheckInfo] = useState<SalaryCheckResult | null>(null);
	const [checking, setChecking] = useState(false);
	const [checkError, setCheckError] = useState<string | null>(null);

	const [confirming, setConfirming] = useState(false);
	const [confirmProgress, setConfirmProgress] = useState<OperationProgress>(EMPTY_PROGRESS);
	const [confirmError, setConfirmError] = useState<string | null>(null);
	const [receipt, setReceipt] = useState<PayrollReceipt | null>(null);
	const [downloading, setDownloading] = useState(false);

	const [balanceRefreshKey, setBalanceRefreshKey] = useState(0);

	const busyGuard = useRef(false);
	const busy = templateLoading || uploadStage !== 'idle' || checking || confirming;

	const years = useMemo(() => {
		const current = dayjs().year();
		return [current - 3, current - 2, current - 1, current, current + 1];
	}, []);

	const normalRows = useMemo(() => (rows ?? []).filter(isNormal), [rows]);
	const total = useMemo(() => sumAmount(normalRows), [normalRows]);

	const statusWarning = useMemo(() => {
		if (!rows || rows.length === 0) return null;
		const hasStatus = rows.some((r) => r.status === 'NORMAL' || r.status === 'ERROR');
		if (hasStatus) return null;
		return `Status NORMAL/ERROR not found. Fields received: ${Object.keys(rows[0]).join(', ')}`;
	}, [rows]);

	const balanceWarning = useMemo(() => {
		if (checkInfo?.enough !== false) return null;
		const fmt = (v: number | null) => (v === null ? '-' : formatAmount(v));
		return `SALARY account balance is not enough. Balance: ${fmt(checkInfo.accountingBalance)} ${CURRENCY}, required: ${fmt(checkInfo.requiredAmount)} ${CURRENCY}.`;
	}, [checkInfo]);

	const canNext = !!lot && normalRows.length > 0 && (rows?.length ?? 0) <= MAX_RECORDS;

	const reached = view === 'complete' ? 4 : view === 'confirm' ? 3 : view === 'upload' && rows ? 2 : 1;

	const runExclusive = async (action: () => Promise<void>) => {
		if (busyGuard.current) return;
		busyGuard.current = true;
		try {
			await action();
		} finally {
			busyGuard.current = false;
		}
	};

	const applyCheck = (result: SalaryCheckResult) => {
		setRows(result.rows);
		setCheckInfo(result);
	};

	const resetLot = () => {
		setLot(null);
		setRows(null);
		setCheckInfo(null);
		setCheckError(null);
		setConfirmError(null);
		setConfirmProgress(EMPTY_PROGRESS);
		setUploadProgress(EMPTY_PROGRESS);
		setUploadError(null);
	};

	const resetAll = () => {
		resetLot();
		setReceipt(null);
		setView('upload');
	};

	const handleOpenUpload = () => {
		if (!month || !year) {
			toast.error('Please select month and year first');
			return;
		}
		setUploadError(null);
		setUploadOpen(true);
	};

	const handleDownloadTemplate = () =>
		runExclusive(async () => {
			setTemplateLoading(true);
			setUploadError(null);
			try {
				await downloadSalaryTemplate();
			} catch (e) {
				const message = getErrorMessage(e, 'Failed to download the template');
				if (uploadOpen) setUploadError(message);
				else toast.error(message);
			} finally {
				setTemplateLoading(false);
			}
		});

	const handleFileSelected = (file: File) =>
		runExclusive(async () => {
			if (!month || !year) {
				setUploadError('Please select month and year first');
				return;
			}
			if (!isExcelFile(file)) {
				setUploadError('The file must be in .xls or .xlsx format only');
				return;
			}
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				setUploadError(`The file size must not exceed ${MAX_FILE_SIZE_MB} MB`);
				return;
			}

			resetLot();
			setUploadStage('uploading');
			const progressId = uuidv4();

			let lotId: string;
			try {
				lotId = await runWithProgress({
					kind: 'import',
					progressId,
					post: () => importSalary({ file, month, year, progressId }),
					onProgress: (p) => setUploadProgress(toProgress(p)),
				});
			} catch (e) {
				setUploadError(getErrorMessage(e, 'Failed to upload the file'));
				setUploadStage('idle');
				return;
			}

			setLot({ id: lotId, fileName: file.name, month, year });
			setUploadStage('checking');

			try {
				applyCheck(await checkSalary(lotId));
			} catch (e) {
				setCheckError(getErrorMessage(e, 'Failed to check the data'));
			} finally {
				setUploadStage('idle');
				setUploadOpen(false);
			}
		});

	const handleRetryCheck = () =>
		runExclusive(async () => {
			if (!lot) return;

			setChecking(true);
			setCheckError(null);
			try {
				applyCheck(await checkSalary(lot.id));
			} catch (e) {
				setCheckError(getErrorMessage(e, 'Failed to check the data'));
			} finally {
				setChecking(false);
			}
		});

	const handleConfirm = () =>
		runExclusive(async () => {
			if (!lot) return;

			setConfirming(true);
			setConfirmError(null);
			setConfirmProgress(EMPTY_PROGRESS);

			try {
				const result = await runWithProgress({
					kind: 'confirm',
					progressId: lot.id,
					post: () => confirmSalary(lot.id),
					onProgress: (p) => setConfirmProgress(toProgress(p)),
				});

				setReceipt({
					transactionId: pickTransactionId(result, lot.id),
					transactionDate: dayjs().format('DD/MM/YYYY HH:mm:ss'),
					fileName: lot.fileName,
					total,
					createdBy: username ?? '-',
					records: normalRows.length,
					description: `Salary month ${lot.month}`,
				});
				setView('complete');
				setBalanceRefreshKey((k) => k + 1);
				toast.success('Transfer successfully');
			} catch (e) {
				setConfirmError(getErrorMessage(e, 'Failed to confirm the transfer'));
			} finally {
				setConfirming(false);
			}
		});

	const handleDownloadDetail = async () => {
		if (!receipt || downloading) return;

		setDownloading(true);
		try {
			const XLSX = await import('xlsx');
			const sheet = XLSX.utils.json_to_sheet(
				normalRows.map((r, i) => ({
					'#': i + 1,
					'Telephone number': r.tel ?? '',
					'Full Name': r.wlName ?? '',
					'Wallet No': r.wlNo ?? '',
					[`Salary (${CURRENCY})`]: r.amount ?? 0,
				})),
			);
			const book = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(book, sheet, 'Payroll');
			XLSX.writeFile(book, `MSP_Payroll_Detail_${receipt.transactionId}.xlsx`);
		} catch (e) {
			toast.error(getErrorMessage(e, 'Failed to download the detail'));
		} finally {
			setDownloading(false);
		}
	};

	return (
		<PageWrapper name='ນຳເຂົ້າເງິນເດືອນ'>
			<div className='px-4 py-6 sm:px-8 lg:px-12'>
				<h1 className='mb-3 text-xl font-semibold'>Payroll</h1>
				<div className='mb-4'>
					<SalaryAccountCard refreshKey={balanceRefreshKey} />
				</div>

				<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_12rem]'>
					<div className='order-2 min-w-0 lg:order-1'>
						{view === 'upload' && (
							<UploadPreviewView
								rows={rows}
								month={month}
								year={year}
								years={years}
								busy={busy}
								checkError={checkError}
								statusWarning={statusWarning}
								balanceWarning={balanceWarning}
								canRetryCheck={!!lot && rows === null}
								canNext={canNext}
								onMonthChange={setMonth}
								onYearChange={setYear}
								onUpload={handleOpenUpload}
								onRetryCheck={handleRetryCheck}
								onNext={() => {
									setConfirmError(null);
									setView('confirm');
								}}
								onOpenTab={setView}
								templateLoading={templateLoading}
								onDownloadTemplate={handleDownloadTemplate}
							/>
						)}

						{(view === 'history' || view === 'paid') && (
							<HistoryView
								key={view}
								source={view}
								onTabChange={(tab) => setView(tab === 'payroll' ? 'upload' : tab)}
							/>
						)}

						{view === 'confirm' && lot && (
							<ConfirmView
								fileName={lot.fileName}
								description={`Salary month ${lot.month}`}
								rows={normalRows}
								total={total}
								confirming={confirming}
								progress={confirmProgress}
								error={confirmError}
								onBack={() => setView('upload')}
								onConfirm={handleConfirm}
							/>
						)}

						{view === 'complete' && receipt && (
							<CompleteView
								receipt={receipt}
								downloading={downloading}
								onDownload={handleDownloadDetail}
								onBack={resetAll}
							/>
						)}
					</div>

					<aside className='order-1 lg:order-2'>
						<PayrollStepper reached={reached} />
					</aside>
				</div>
			</div>

			<UploadModal
				isOpen={uploadOpen}
				onClose={() => setUploadOpen(false)}
				stage={uploadStage}
				progress={uploadProgress}
				error={uploadError}
				templateLoading={templateLoading}
				onFileSelected={handleFileSelected}
				onDownloadTemplate={handleDownloadTemplate}
			/>
		</PageWrapper>
	);
};

export default SalaryPage;
