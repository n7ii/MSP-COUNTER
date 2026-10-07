import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Button, Spinner } from '@heroui/react';
import { LuArrowLeft, LuDownload, LuPackageOpen } from 'react-icons/lu';
import StepBanner from '@/pages/salary/components/StepBanner.tsx';
import TablePagination from '@/pages/salary/components/TablePagination.tsx';
import {
	downloadSalaryHistory,
	getErrorMessage,
	getSalaryHistoryDetail,
	SalaryGroupSource,
	SalaryHistoryGroup,
	SalaryHistoryItem,
} from '@/pages/salary/services/salaryApi.ts';
import { BTN_BACK, BTN_PRIMARY, CURRENCY, formatAmount, PAGE_SIZE } from '@/pages/salary/utils.ts';

interface IHistoryDetailViewProps {
	source: SalaryGroupSource;
	group: SalaryHistoryGroup;
	onBack: () => void;
}

const CHIP_BASE = 'inline-block rounded-full px-3 py-0.5 text-[11px] font-medium';

const HEADERS = [
	'#',
	'Telephone number',
	'Full Name',
	'Wallet No',
	`Salary (${CURRENCY})`,
	'Status',
	'Paid',
	'Message',
];

const StatusChip: FC<{ status?: string | null }> = ({ status }) => {
	if (!status) return <>-</>;

	const text = status.toUpperCase();
	const color =
		text === 'ERROR'
			? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
			: text === 'NORMAL'
				? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
				: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300';

	return <span className={`${CHIP_BASE} ${color}`}>{status}</span>;
};

const PaidChip: FC<{ sstatus?: number | null }> = ({ sstatus }) => {
	if (sstatus === undefined || sstatus === null) return <>-</>;

	return (
		<span
			className={classNames(
				CHIP_BASE,
				sstatus === 1
					? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
					: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
			)}>
			{sstatus === 1 ? 'Paid' : 'Not paid'}
		</span>
	);
};

const HistoryDetailView: FC<IHistoryDetailViewProps> = ({ source, group, onBack }) => {
	const [items, setItems] = useState<SalaryHistoryItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [downloading, setDownloading] = useState(false);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			setItems(await getSalaryHistoryDetail(source, group.uuid));
		} catch (e) {
			setError(getErrorMessage(e, 'Failed to load details'));
		} finally {
			setLoading(false);
		}
	}, [source, group.uuid]);

	useEffect(() => {
		load();
	}, [load]);

	const handleDownload = async () => {
		if (downloading) return;
		setDownloading(true);
		try {
			await downloadSalaryHistory(source, group.uuid);
		} catch (e) {
			toast.error(getErrorMessage(e, 'Failed to download'));
		} finally {
			setDownloading(false);
		}
	};

	const visible = useMemo(
		() => items.slice(page * pageSize, (page + 1) * pageSize),
		[items, page, pageSize],
	);
	const offset = page * pageSize;

	return (
		<div className='rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900'>
			<div className='mb-4 flex flex-wrap items-start justify-between gap-4'>
				<div>
					<div className='text-base font-semibold'>
						{source === 'paid' ? 'Paid Detail' : 'History Detail'}{' '}
						{group.month && group.year ? `- ${group.month}/${group.year}` : ''}
					</div>
					<div className='mt-1 space-y-0.5 text-xs text-zinc-500'>
						<div className='break-all'>Lot ID: {group.uuid}</div>
						{group.createdDate && dayjs(group.createdDate).isValid() && (
							<div>
								Date: {dayjs(group.createdDate).format('DD/MM/YYYY HH:mm:ss')}
								{group.createdBy ? ` by ${group.createdBy}` : ''}
							</div>
						)}
						{typeof group.paidAmount === 'number' && (
							<div>
								Paid Amount:{' '}
								<span className='font-semibold text-zinc-800 dark:text-zinc-100'>
									{formatAmount(group.paidAmount)} {CURRENCY}
								</span>
							</div>
						)}
					</div>
				</div>

				<Button
					className={BTN_PRIMARY}
					isLoading={downloading}
					startContent={!downloading && <LuDownload size={16} />}
					onPress={handleDownload}>
					Download
				</Button>
			</div>

			{error && (
				<StepBanner variant='error' className='mb-4'>
					<div className='flex flex-wrap items-center gap-3'>
						<span>{error}</span>
						<Button size='sm' variant='flat' isDisabled={loading} onPress={load}>
							Retry
						</Button>
					</div>
				</StepBanner>
			)}

			<div className='overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700'>
				<table className='w-full min-w-[56rem] border-collapse text-sm'>
					<thead>
						<tr className='bg-primary text-white'>
							{HEADERS.map((header, i) => (
								<th
									key={header}
									className={`whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold ${i === 0 ? 'w-16 text-center' : ''}`}>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{visible.length === 0 ? (
							<tr>
								<td colSpan={HEADERS.length} className='py-8'>
									<div className='flex items-center justify-center gap-2 text-sm font-medium text-zinc-500'>
										{loading ? (
											<Spinner size='sm' />
										) : (
											<LuPackageOpen size={28} className='text-primary-300' />
										)}
										{loading ? 'Loading...' : 'No data'}
									</div>
								</td>
							</tr>
						) : (
							visible.map((row, i) => (
								<tr
									key={row.id ?? `${row.tel}-${offset + i}`}
									className={classNames(
										'border-t border-zinc-100 align-top dark:border-zinc-800',
										row.status === 'ERROR' && 'bg-red-50/70 dark:bg-red-950/20',
									)}>
									<td className='px-4 py-2.5 text-center'>{offset + i + 1}</td>
									<td className='px-4 py-2.5'>{row.tel ?? '-'}</td>
									<td className='px-4 py-2.5'>{row.wlName ?? '-'}</td>
									<td className='px-4 py-2.5'>{row.wlNo ?? '-'}</td>
									<td className='px-4 py-2.5 font-semibold tabular-nums'>
										{typeof row.amount === 'number' ? formatAmount(row.amount) : '-'}
									</td>
									<td className='px-4 py-2.5'>
										<StatusChip status={row.status} />
									</td>
									<td className='px-4 py-2.5'>
										<PaidChip sstatus={row.sstatus} />
									</td>
									<td className='max-w-[16rem] break-words px-4 py-2.5 text-xs text-red-600 dark:text-red-400'>
										{row.status === 'ERROR'
											? (row.message ??
												(row.wlNo
													? 'No reason provided'
													: 'Wallet not found for this telephone number'))
											: (row.message ?? '')}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{items.length > 0 && (
				<div className='mt-3'>
					<TablePagination
						page={page}
						pageSize={pageSize}
						total={items.length}
						onPageChange={setPage}
						onPageSizeChange={(size) => {
							setPageSize(size);
							setPage(0);
						}}
					/>
				</div>
			)}

			<div className='mt-6'>
				<Button
					className={classNames(BTN_BACK, 'min-w-44')}
					startContent={<LuArrowLeft size={16} />}
					onPress={onBack}>
					Back
				</Button>
			</div>
		</div>
	);
};

export default HistoryDetailView;
