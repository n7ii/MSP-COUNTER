import { FC, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { LuDownload, LuSearch, LuUpload } from 'react-icons/lu';
import PayrollTable from '@/pages/salary/components/PayrollTable.tsx';
import PayrollTabs from '@/pages/salary/components/PayrollTabs.tsx';
import StepBanner from '@/pages/salary/components/StepBanner.tsx';
import TablePagination from '@/pages/salary/components/TablePagination.tsx';
import { SalaryRow } from '@/pages/salary/services/salaryApi.ts';
import { BTN_OUTLINE, BTN_PRIMARY, MAX_RECORDS, MONTHS, PAGE_SIZE } from '@/pages/salary/utils.ts';

interface IUploadPreviewViewProps {
	rows: SalaryRow[] | null;
	month: number | null;
	year: number | null;
	years: number[];
	busy: boolean;
	checkError: string | null;
	statusWarning: string | null;
	balanceWarning: string | null;
	canRetryCheck: boolean;
	canNext: boolean;
	onMonthChange: (month: number) => void;
	onYearChange: (year: number) => void;
	onUpload: () => void;
	onRetryCheck: () => void;
	onNext: () => void;
	onOpenTab: (tab: 'history' | 'paid') => void;
	templateLoading: boolean;
	onDownloadTemplate: () => void;
}

const selectClassNames = { trigger: 'bg-zinc-100 dark:bg-zinc-800 min-h-9 h-9', base: 'w-32' };

const UploadPreviewView: FC<IUploadPreviewViewProps> = ({
	rows,
	month,
	year,
	years,
	busy,
	checkError,
	statusWarning,
	balanceWarning,
	canRetryCheck,
	canNext,
	onMonthChange,
	onYearChange,
	onUpload,
	onRetryCheck,
	onNext,
	onOpenTab,
	templateLoading,
	onDownloadTemplate,
}) => {
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);

	const [statusFilter, setStatusFilter] = useState<'all' | 'error' | 'normal'>('all');

	useEffect(() => {
		setSearchInput('');
		setSearch('');
		setStatusFilter('all');
		setPage(0);
	}, [rows]);

	const all = rows ?? [];
	const inactiveCount = all.filter((r) => r.status === 'ERROR').length;
	const activeCount = all.filter((r) => r.status === 'NORMAL').length;
	const overLimit = all.length > MAX_RECORDS;

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return all.filter((r) => {
			if (statusFilter === 'error' && r.status !== 'ERROR') return false;
			if (statusFilter === 'normal' && r.status !== 'NORMAL') return false;
			if (!q) return true;
			return (
				(r.tel ?? '').toLowerCase().includes(q) ||
				(r.wlName ?? '').toLowerCase().includes(q) ||
				(r.wlNo ?? '').toLowerCase().includes(q)
			);
		});
	}, [all, search, statusFilter]);

	const changeFilter = (value: 'all' | 'error' | 'normal') => {
		setStatusFilter(value);
		setPage(0);
	};

	const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

	const applySearch = () => {
		setSearch(searchInput);
		setPage(0);
	};

	return (
		<div className='rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900'>
			<PayrollTabs
				active='payroll'
				disabled={busy}
				onChange={(tab) => tab !== 'payroll' && onOpenTab(tab)}
			/>

			<div className='mb-4'>
				<div className='text-sm font-semibold'>Add/Remove Account Salary</div>
				<div className='text-[11px] text-zinc-500'>
					(Maximum list transaction {MAX_RECORDS} per account)
				</div>
			</div>

			<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
				<div className='flex items-center gap-3'>
					<Input
						size='sm'
						aria-label='Search telephone'
						placeholder='Search Telephone'
						value={searchInput}
						onValueChange={setSearchInput}
						onKeyDown={(e) => e.key === 'Enter' && applySearch()}
						isDisabled={all.length === 0}
						endContent={<LuSearch className='text-zinc-400' size={16} />}
						classNames={{ base: 'w-56', inputWrapper: 'bg-zinc-100 dark:bg-zinc-800' }}
					/>
					<Button
						variant='bordered'
						className={classNames(BTN_OUTLINE, 'min-w-24')}
						isDisabled={all.length === 0}
						onPress={applySearch}>
						Search
					</Button>
				</div>

				<div className='flex flex-wrap items-center gap-3'>
					<Select
						size='sm'
						aria-label='Month'
						placeholder='Month'
						isDisabled={busy}
						disallowEmptySelection
						selectedKeys={month ? [String(month)] : []}
						onSelectionChange={(keys) => {
							const value = Number(Array.from(keys)[0]);
							if (value) onMonthChange(value);
						}}
						classNames={selectClassNames}>
						{MONTHS.map((name, i) => (
							<SelectItem key={String(i + 1)}>{name}</SelectItem>
						))}
					</Select>
					<Select
						size='sm'
						aria-label='Year'
						placeholder='Year'
						isDisabled={busy}
						disallowEmptySelection
						selectedKeys={year ? [String(year)] : []}
						onSelectionChange={(keys) => {
							const value = Number(Array.from(keys)[0]);
							if (value) onYearChange(value);
						}}
						classNames={{ ...selectClassNames, base: 'w-28' }}>
						{years.map((y) => (
							<SelectItem key={String(y)}>{String(y)}</SelectItem>
						))}
					</Select>
					<Button
						variant='bordered'
						className={classNames(BTN_OUTLINE, 'min-w-28')}
						isDisabled={busy}
						isLoading={templateLoading}
						startContent={!templateLoading && <LuDownload size={16} />}
						onPress={onDownloadTemplate}>
						Download Format
					</Button>
					<Button
						variant='bordered'
						className={classNames(BTN_OUTLINE, 'min-w-28')}
						isDisabled={busy}
						startContent={<LuUpload size={16} />}
						onPress={onUpload}>
						Upload File
					</Button>
				</div>
			</div>

			{checkError && (
				<StepBanner variant='error' className='mb-4'>
					<div className='flex flex-wrap items-center gap-3'>
						<span>{checkError}</span>
						{canRetryCheck && (
							<Button size='sm' variant='flat' isDisabled={busy} onPress={onRetryCheck}>
								Retry
							</Button>
						)}
					</div>
				</StepBanner>
			)}
			{statusWarning && (
				<StepBanner variant='warning' className='mb-4'>
					{statusWarning}
				</StepBanner>
			)}
			{balanceWarning && (
				<StepBanner variant='error' className='mb-4'>
					{balanceWarning}
				</StepBanner>
			)}
			{overLimit && (
				<StepBanner variant='error' className='mb-4'>
					The file contains {all.length} records. The maximum is {MAX_RECORDS}. Please upload
					a smaller file.
				</StepBanner>
			)}
			{!overLimit && inactiveCount > 0 && (
				<StepBanner variant='error' className='mb-4'>
					{inactiveCount} record(s) failed the check and will be skipped. See the Error
					column for the reason.
				</StepBanner>
			)}

			{inactiveCount > 0 && (
				<div className='mb-3 flex flex-wrap gap-2' role='group' aria-label='Filter rows'>
					{(
						[
							['all', `All (${all.length})`],
							['error', `Error (${inactiveCount})`],
							['normal', `Active (${activeCount})`],
						] as const
					).map(([value, label]) => (
						<button
							key={value}
							type='button'
							aria-pressed={statusFilter === value}
							onClick={() => changeFilter(value)}
							className={classNames(
								'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
								statusFilter === value
									? value === 'error'
										? 'border-red-500 bg-red-500 text-white'
										: 'border-primary bg-primary text-white'
									: 'border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800',
							)}>
							{label}
						</button>
					))}
				</div>
			)}

			<PayrollTable
				rows={pageRows}
				offset={page * pageSize}
				showDetails={inactiveCount > 0}
			/>

			{all.length > 0 && (
				<div className='mt-3'>
					<TablePagination
						page={page}
						pageSize={pageSize}
						total={filtered.length}
						onPageChange={setPage}
						onPageSizeChange={(size) => {
							setPageSize(size);
							setPage(0);
						}}
					/>
				</div>
			)}

			<div className='mt-5 flex flex-wrap items-end justify-between gap-4'>
				<div className='space-y-1 text-xs text-zinc-500'>
					{all.length > 0 && (
						<div className='text-sm font-semibold text-zinc-800 dark:text-zinc-100'>
							Total Record: {all.length}
						</div>
					)}
					<p className='max-w-md'>
						<span className='font-semibold text-zinc-800 dark:text-zinc-100'>Remark:</span>{' '}
						Account information displayed is based on the details provided when the salary
						account was added to the system
					</p>
				</div>
				<Button
					className={classNames(BTN_PRIMARY, 'min-w-48')}
					isDisabled={!canNext || busy}
					onPress={onNext}>
					Next
				</Button>
			</div>
		</div>
	);
};

export default UploadPreviewView;
