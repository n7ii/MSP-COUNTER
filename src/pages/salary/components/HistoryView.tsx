import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Button, Spinner } from '@heroui/react';
import { LuDownload, LuEye, LuPackageOpen, LuRefreshCw } from 'react-icons/lu';
import HistoryDetailView from '@/pages/salary/components/HistoryDetailView.tsx';
import PayrollTabs, { PayrollTab } from '@/pages/salary/components/PayrollTabs.tsx';
import StepBanner from '@/pages/salary/components/StepBanner.tsx';
import TablePagination from '@/pages/salary/components/TablePagination.tsx';
import {
	downloadSalaryHistory,
	getErrorMessage,
	getSalaryHistoryGroups,
	SalaryGroupSource,
	SalaryHistoryGroup,
} from '@/pages/salary/services/salaryApi.ts';
import { BTN_OUTLINE, CURRENCY, formatAmount, PAGE_SIZE } from '@/pages/salary/utils.ts';

interface IHistoryViewProps {
	/** Which list to show. Remount (via `key`) when this changes. */
	source: SalaryGroupSource;
	onTabChange: (tab: PayrollTab) => void;
}

const TITLES: Record<SalaryGroupSource, string> = {
	history: 'Payroll History',
	paid: 'Paid Payroll',
};

const HEADERS = [
	'#',
	'Date',
	'Month/Year',
	'Records',
	`Paid Amount (${CURRENCY})`,
	'Create By',
	'Action',
];

const formatDate = (value?: string | null) => {
	if (!value) return '-';
	const parsed = dayjs(value);
	return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm:ss') : value;
};

const HistoryView: FC<IHistoryViewProps> = ({ source, onTabChange }) => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [groups, setGroups] = useState<SalaryHistoryGroup[]>([]);
	const [totalElements, setTotalElements] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);
	const [detail, setDetail] = useState<SalaryHistoryGroup | null>(null);
	const [downloadingId, setDownloadingId] = useState<string | null>(null);

	const serverPaged = totalElements !== null;

	const load = useCallback(
		async (targetPage: number, size: number) => {
			setLoading(true);
			setError(null);
			try {
				const result = await getSalaryHistoryGroups(source, targetPage, size);
				setGroups(result.groups);
				setTotalElements(result.totalElements);
				setLoaded(true);
			} catch (e) {
				setError(getErrorMessage(e, 'Failed to load the list'));
			} finally {
				setLoading(false);
			}
		},
		[source],
	);

	useEffect(() => {
		if (loaded && !serverPaged) return;
		load(page, pageSize);
	}, [page, pageSize, load]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleDownload = async (uuid: string) => {
		if (downloadingId) return;
		setDownloadingId(uuid);
		try {
			await downloadSalaryHistory(source, uuid);
		} catch (e) {
			toast.error(getErrorMessage(e, 'Failed to download'));
		} finally {
			setDownloadingId(null);
		}
	};

	const total = serverPaged ? (totalElements ?? 0) : groups.length;
	const visible = useMemo(
		() => (serverPaged ? groups : groups.slice(page * pageSize, (page + 1) * pageSize)),
		[groups, serverPaged, page, pageSize],
	);
	const offset = page * pageSize;

	if (detail) {
		return <HistoryDetailView source={source} group={detail} onBack={() => setDetail(null)} />;
	}

	return (
		<div className='rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900'>
			<PayrollTabs active={source} disabled={loading} onChange={onTabChange} />

			<div className='mb-4 flex items-center justify-between gap-3'>
				<div className='text-sm font-semibold'>{TITLES[source]}</div>
				<Button
					size='sm'
					variant='flat'
					isDisabled={loading}
					startContent={!loading && <LuRefreshCw size={16} />}
					onPress={() => load(page, pageSize)}>
					{loading ? <Spinner size='sm' color='current' /> : 'Reload'}
				</Button>
			</div>

			{error && (
				<StepBanner variant='error' className='mb-4'>
					{error}
				</StepBanner>
			)}

			<div className='overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700'>
				<table className='w-full min-w-[52rem] border-collapse text-sm'>
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
							visible.map((group, i) => (
								<tr
									key={group.uuid}
									className='border-t border-zinc-100 dark:border-zinc-800'>
									<td className='px-4 py-2.5 text-center'>{offset + i + 1}</td>
									<td className='whitespace-nowrap px-4 py-2.5'>
										{formatDate(group.createdDate)}
									</td>
									<td className='px-4 py-2.5'>
										{group.month && group.year ? `${group.month}/${group.year}` : '-'}
									</td>
									<td className='px-4 py-2.5 tabular-nums'>{group.total ?? '-'}</td>
									<td className='px-4 py-2.5 font-semibold tabular-nums'>
										{typeof group.paidAmount === 'number'
											? formatAmount(group.paidAmount)
											: '-'}
									</td>
									<td className='px-4 py-2.5'>{group.createdBy ?? '-'}</td>
									<td className='px-4 py-2'>
										<div className='flex gap-2'>
											<Button
												size='sm'
												variant='bordered'
												className={classNames(BTN_OUTLINE)}
												startContent={<LuEye size={14} />}
												onPress={() => setDetail(group)}>
												Detail
											</Button>
											<Button
												size='sm'
												variant='bordered'
												className={classNames(BTN_OUTLINE)}
												isLoading={downloadingId === group.uuid}
												isDisabled={!!downloadingId}
												startContent={
													downloadingId !== group.uuid && <LuDownload size={14} />
												}
												onPress={() => handleDownload(group.uuid)}>
												Download
											</Button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{total > 0 && (
				<div className='mt-3'>
					<TablePagination
						page={page}
						pageSize={pageSize}
						total={total}
						onPageChange={setPage}
						onPageSizeChange={(size) => {
							setPageSize(size);
							setPage(0);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default HistoryView;
