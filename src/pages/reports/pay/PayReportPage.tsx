import { useMemo, useState } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import Badge from '@/components/ui/Badge.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import Select from '@/components/form/Select.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import VolteyDashboard from '@/pages/reports/voltey/components/VolteyDashboard.tsx';
import PayTransDetail from '@/pages/reports/pay/PayTransDetail.tsx';
import { exportAllToExcel } from '@/pages/reports/utils/statementUtils.ts';
import {
	PayReportService,
	useGetPayDashboardQuery,
	useGetPayHistoryQuery,
	useLazyGetPayHistoryQuery,
} from '@/pages/reports/redux/queries/payReportApiSlice.ts';
import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { Range } from 'react-date-range';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Button, Chip } from '@heroui/react';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { LuEye, LuSearch } from 'react-icons/lu';

const TRANS_STATUS_MAP: Record<
	string,
	{ label: string; color: 'success' | 'danger' | 'warning' | 'secondary' | 'default' }
> = {
	'01': { label: 'ສຳເລັດ', color: 'success' },
	'02': { label: 'ລໍຖ້າ', color: 'secondary' },
	'03': { label: 'ຄືນເງິນ', color: 'warning' },
	'04': { label: 'ຜິດພາດ', color: 'danger' },
};

const formatMoney = (value?: number, ccy?: string) => {
	if (value === null || value === undefined) return '-';
	return `${Number(value).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})} ${ccy || ''}`.trim();
};

type AppliedFilters = {
	dateStart: string;
	dateEnd: string;
	transStatus: string;
};

type PayReportPageProps = {
	service: PayReportService;
	title: string;
	soldOutLakLabel: string;
	soldOutUsdLabel: string;
};

const PayReportPage = ({
	service,
	title,
	soldOutLakLabel,
	soldOutUsdLabel,
}: PayReportPageProps) => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [isOpen, setIsOpen] = useState(false);
	const [transData, setTransData] = useState<any>(null);
	const [transStatus, setTransStatus] = useState('');
	const [appliedFilters, setAppliedFilters] = useState<AppliedFilters | null>(null);
	const [dateRange, setDateRange] = useState<Range[]>([
		{
			startDate: dayjs().startOf('month').startOf('day').toDate(),
			endDate: dayjs().endOf('day').toDate(),
			key: 'selection',
		},
	]);

	const startDateStr = dateRange[0].startDate
		? dayjs(dateRange[0].startDate).format('YYYY-MM-DD')
		: '';
	const endDateStr = dateRange[0].endDate ? dayjs(dateRange[0].endDate).format('YYYY-MM-DD') : '';

	const { data: historyData, isFetching: isHistoryLoading } = useGetPayHistoryQuery(
		{
			service,
			dateStart: appliedFilters?.dateStart,
			dateEnd: appliedFilters?.dateEnd,
			transStatus: appliedFilters?.transStatus,
			page: pageIndex,
			size: pageSize,
		},
		{ skip: !appliedFilters },
	);

	const { data: dashboardData, isFetching: isDashboardLoading } = useGetPayDashboardQuery(
		{
			service,
			dateStart: appliedFilters?.dateStart,
			dateEnd: appliedFilters?.dateEnd,
		},
		{ skip: !appliedFilters },
	);

	const [fetchAllHistory] = useLazyGetPayHistoryQuery();
	const rows = historyData?.body?.content || [];

	const columnHelper = createColumnHelper<any>();
	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				header: 'ລະຫັດ',
				cell: (info) => info.getValue() ?? '-',
			}),
			columnHelper.display({
				id: 'txnDate',
				header: 'ວັນທີທຸລະກໍາ',
				cell: (info) => {
					const row = info.row.original;
					return row.txnDate || row.paydate || row.timestamp || row.createAt || '-';
				},
			}),
			columnHelper.display({
				id: 'reference',
				header: 'ເລກອ້າງອີງ',
				cell: (info) => {
					const row = info.row.original;
					return (
						row.reference ||
						row.billNumber ||
						row.barcode ||
						row.referenceId ||
						row.xref ||
						'-'
					);
				},
			}),
			columnHelper.display({
				id: 'wlname',
				header: 'ຊື່ກະເປົາ',
				cell: (info) => {
					const row = info.row.original;
					return (
						row.userDetail?.wlname ||
						row.walletName ||
						row.cusName ||
						row.fullName ||
						row.taxrFulNm ||
						'-'
					);
				},
			}),
			columnHelper.display({
				id: 'bill',
				header: 'ລາຍການ',
				cell: (info) => {
					const row = info.row.original;
					return row.billName || row.name || row.serviceType || row.msisdn || row.tin || '-';
				},
			}),
			columnHelper.display({
				id: 'amount',
				header: 'ຈຳນວນເງິນ',
				cell: (info) => {
					const row = info.row.original;
					const amount = row.amount ?? row.curPayAmt ?? row.feeAmount ?? row.priceLak;
					return formatMoney(amount, row.ccy || 'LAK');
				},
			}),
			columnHelper.display({
				id: 'fee',
				header: 'ຄ່າທຳນຽມ',
				cell: (info) =>
					formatMoney(info.row.original.fee, info.row.original.feeCcy || 'LAK'),
			}),
			columnHelper.display({
				id: 'transStatus',
				header: 'ສະຖານະທຸລະກໍາ',
				cell: (info) => {
					const status = String(
						info.row.original.transStatus || info.row.original.statusTrans || '',
					);
					const mapped = TRANS_STATUS_MAP[status];
					return (
						<Chip size='sm' color={mapped?.color || 'default'} variant='flat'>
							{mapped ? `${status} · ${mapped.label}` : status || '-'}
						</Chip>
					);
				},
			}),
			columnHelper.display({
				id: 'actions',
				header: 'ຈັດການ',
				cell: (info) => (
					<Button
						isIconOnly
						color='default'
						variant='faded'
						onPress={() => {
							setTransData(info.row.original);
							setIsOpen(true);
						}}>
						<LuEye size='18' />
					</Button>
				),
			}),
		],
		[],
	);

	const table = useReactTable({
		data: rows,
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: historyData?.body?.totalPages || 1,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value ? dayjs(e.target.value).startOf('day').toDate() : undefined;
		setDateRange([
			{
				startDate: newDate,
				endDate: dateRange[0].endDate,
				key: 'selection',
			},
		]);
	};

	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value ? dayjs(e.target.value).endOf('day').toDate() : undefined;
		setDateRange([
			{
				startDate: dateRange[0].startDate,
				endDate: newDate,
				key: 'selection',
			},
		]);
	};

	const handleSearch = () => {
		if (!dateRange[0]?.startDate || !dateRange[0]?.endDate) {
			toast.error('ກະລຸນາເລືອກວັນທີເລີ່ມ ແລະ ວັນທີສິ້ນສຸດ!');
			return;
		}
		setPageIndex(0);
		setAppliedFilters({
			dateStart: dayjs(dateRange[0].startDate).format('YYYY-MM-DD'),
			dateEnd: dayjs(dateRange[0].endDate).format('YYYY-MM-DD'),
			transStatus,
		});
	};

	const exportAllDataToExcel = async () => {
		if (!appliedFilters) {
			toast.error('ກະລຸນາກົດຄົ້ນຫາກ່ອນ!');
			return;
		}
		try {
			const { data: allData } = await fetchAllHistory({
				service,
				...appliedFilters,
				page: 0,
				size: 1000000,
			});
			if (allData?.body?.content?.length) {
				await exportAllToExcel(allData.body.content, title);
			} else {
				toast.error('ບໍ່ມີຂໍ້ມູນສຳລັບສົ່ງອອກ.');
			}
		} catch (error) {
			console.error('Error exporting data:', error);
			toast.error('ສົ່ງອອກຂໍ້ມູນບໍ່ສຳເລັດ.');
		}
	};

	const isLoading = isHistoryLoading || isDashboardLoading;

	return (
		<>
			<ModalProvider
				isOpen={isOpen}
				onOpenChange={() => setIsOpen(false)}
				title={`ລາຍລະອຽດ ${title}`}
				scrollBehavior='outside'
				size='5xl'>
				<div className='py-4'>{transData && <PayTransDetail transaction={transData} />}</div>
			</ModalProvider>

			{isLoading && <Loading />}

			<PageWrapper name={title}>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap>
							<div className='flex flex-wrap items-center gap-4'>
								<p className='font-medium'>ເລືອກຊ່ວງວັນທີ:</p>
								<div className='flex items-center gap-2'>
									<div className='flex items-center rounded-md border p-1'>
										<Icon className='mx-1' icon='HeroCalendar' />
										<input
											type='date'
											value={startDateStr}
											onChange={handleStartDateChange}
											className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
										/>
									</div>
									<span className='text-gray-400'>-</span>
									<div className='flex items-center rounded-md border p-1'>
										<Icon className='mx-1' icon='HeroCalendar' />
										<input
											type='date'
											value={endDateStr}
											onChange={handleEndDateChange}
											className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
										/>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<label className='text-sm font-medium'>ສະຖານະທຸລະກໍາ</label>
									<Select
										name='transStatus'
										value={transStatus}
										onChange={(e) => setTransStatus(e.target.value)}
										className='w-44'>
										<option value=''>ທັງໝົດ</option>
										<option value='01'>01 · ສຳເລັດ</option>
										<option value='02'>02 · ລໍຖ້າ</option>
										<option value='03'>03 · ຄືນເງິນ</option>
										<option value='04'>04 · ຜິດພາດ</option>
									</Select>
								</div>
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<div className='flex items-center gap-2'>
							<Button
								variant='solid'
								className='w-full max-w-32'
								startContent={<LuSearch size='18' />}
								color='primary'
								onPress={handleSearch}>
								ຄົ້ນຫາ
							</Button>
							<Button
								variant='ghost'
								radius='sm'
								color='primary'
								startContent={<PiMicrosoftExcelLogoFill size='24' />}
								onPress={exportAllDataToExcel}>
								ສົ່ງອອກ Excel
							</Button>
						</div>
					</SubheaderRight>
				</Subheader>

				<Container>
					<VolteyDashboard
						data={dashboardData?.body}
						title={`ພາບລວມ ${title}`}
						soldOutLakLabel={soldOutLakLabel}
						soldOutUsdLabel={soldOutUsdLabel}
						showIncomeSummary={false}
					/>

					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>ລາຍການທຸລະກໍາ {title}</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{historyData?.body?.totalElements || 0} ລາຍການ
								</Badge>
							</CardHeaderChild>
						</CardHeader>
						<CardBody className='overflow-auto'>
							<TableTemplate className='min-w-[70rem]' table={table} />
						</CardBody>
						<TableCardFooterTemplate
							table={table}
							onPageChange={(newPage) => setPageIndex(newPage)}
							onPageSizeChange={(newSize) => {
								setPageSize(newSize);
								setPageIndex(0);
							}}>
							<div className='pagination-info'>
								<span>{`ສະແດງ ${historyData?.body?.numberOfElements || 0} ລາຍການ ຈາກທັງໝົດ ${historyData?.body?.totalElements || 0} ລາຍການ`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default PayReportPage;
