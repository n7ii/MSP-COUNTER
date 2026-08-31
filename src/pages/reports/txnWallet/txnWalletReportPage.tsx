import { useState, useEffect, useCallback } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';

import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import Badge from '@/components/ui/Badge.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';

import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import {
	createColumnHelper,
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	SortingState,
	ColumnFiltersState,
} from '@tanstack/react-table';
import { Range } from 'react-date-range';
import dayjs from 'dayjs';

import { useGetTxnWalletReportQuery } from '@/pages/reports/redux/queries/txnWalletApiSlice.ts';

import ModalProvider from '@/components/ui/modal/modalProvider.tsx';

import toast from 'react-hot-toast';
import {
	Button,
	Dropdown as HeroDropdown,
	DropdownItem as HeroDropdownItem,
	DropdownTrigger as HeroDropdownTrigger,
	DropdownMenu as HeroDropdownMenu,
	Select,
	SelectItem,
} from '@heroui/react';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { HiChevronDown } from 'react-icons/hi';
import PDFGenerator from '@/pages/reports/components/statementPDFAll.tsx';
import { useGetAcctListQuery } from '@/redux/queries/dashBroadApiSlice.ts';
import { useExcelExport } from '@/pages/reports/txnWallet/utils/exportUtils.tsx';

// Constants
const INITIAL_PAGE_SIZE = 10;
const EXPORT_PAGE_SIZE = 1000000;

const STM_TYPES = [
	{
		key: 'ALL',
		label: 'ທຸກລາຍການ (All Transactions)',
		icon: <PiMicrosoftExcelLogoFill size={20} className='text-green-600' />,
	},
	{
		key: 'TRN',
		label: 'ການໂອນເງິນ (Transfer)',
		icon: <PiMicrosoftExcelLogoFill size={20} className='text-blue-600' />,
	},
	{
		key: 'CASH_IN',
		label: 'ເງິນເຂົ້າ (Cash In)',
		icon: <PiMicrosoftExcelLogoFill size={20} className='text-emerald-600' />,
	},
	{
		key: 'CASH_OUT',
		label: 'ເງິນອອກ (Cash Out)',
		icon: <PiMicrosoftExcelLogoFill size={20} className='text-red-600' />,
	},
	{
		key: 'FEE',
		label: 'ຄ່າທຳນຽມ (Fee)',
		icon: <PiMicrosoftExcelLogoFill size={20} className='text-orange-600' />,
	},
	{
		key: 'EXPORT_ALL',
		label: 'ສົ່ງອອກທັງໝົດ (Export All with Sheets)',
		icon: <PiMicrosoftExcelLogoFill size={20} className='text-purple-600' />,
	},
];

const TxnWalletReportPage = () => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [walletNo] = useState('2131171001');
	const [searchTriggered] = useState(true);
	const [selectedStmType, setSelectedStmType] = useState<string>('ALL');
	const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

	const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().startOf('month').startOf('day').toDate(),
			endDate: dayjs().endOf('month').endOf('day').toDate(),
			key: 'selection',
		},
	]);

	// Get account list
	const { data: accountList } = useGetAcctListQuery();

	// PDF Export States
	const [pdfType, setPdfType] = useState<'type1' | null>(null);
	const [transPDF, setTransPDF] = useState<any>([]);
	const [transSummary, setTransSummary] = useState<any>(null);
	const [customerDetail, setCustomerDetail] = useState<any>(null);

	// Computed values for dates
	const startDate = state[0]?.startDate ? dayjs(state[0].startDate).format('YYYY-MM-DD') : '';
	const endDate = state[0]?.endDate ? dayjs(state[0].endDate).format('YYYY-MM-DD') : '';

	const [fetchedData, setFetchedData] = useState<any>(null);

	// Fetch data only when search is triggered
	const { data, isLoading, refetch } = useGetTxnWalletReportQuery(
		{
			page: pageIndex,
			size: pageSize,
			walletNo,
			dateStart: state[0].startDate
				? dayjs(state[0].startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss')
				: '',
			dateEnd: state[0].endDate
				? dayjs(state[0].endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
				: '',
		},
		{ skip: !searchTriggered },
	);

	useEffect(() => {
		if (data) {
			setFetchedData(data);
		}
	}, [data]);

	// Initialize Excel export hook
	const { isExporting, handleExport } = useExcelExport({
		refetch,
		pageSize,
		pageIndex,
		setPageSize,
		setPageIndex,
		searchTriggered,
		fetchedData,
		selectedChannel,
	});

	// Get unique channels from data
	const uniqueChannels = Array.from(
		new Set(fetchedData?.body?.content?.map((item: any) => item.channel).filter(Boolean)),
	).sort();

	// Columns for the table
	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('txnDate', {
			header: 'Transaction Date',
			cell: (info) => {
				const date = new Date(info.getValue());
				return date.toLocaleDateString('en-GB');
			},
		}),
		columnHelper.accessor('channel', {
			header: 'Channel',
			cell: (info) => info.getValue(),
			enableColumnFilter: true,
		}),
		columnHelper.accessor('fwlName', {
			header: 'Full Name',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('remark', {
			header: 'Description',
			cell: (info) => (
				<div className='max-w-md whitespace-pre-wrap break-words'>{info.getValue()}</div>
			),
		}),
		columnHelper.accessor('txNo', {
			header: 'Reference Number',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('debit', {
			header: 'Debit',
			cell: (info) => info.getValue().toLocaleString(),
		}),
		columnHelper.accessor('credit', {
			header: 'Credit',
			cell: (info) => info.getValue().toLocaleString(),
		}),
		columnHelper.accessor('afterTXN', {
			header: 'Balance',
			cell: (info) => info.getValue().toLocaleString(),
		}),
	];

	const table = useReactTable({
		data: fetchedData?.body?.content || [],
		columns,
		state: {
			sorting,
			globalFilter,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: fetchedData?.body?.totalPages || 1,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	const handleDateChange = (item: any) => {
		setState([item.selection]);
	};

	// Handle channel filter change
	const handleChannelFilterChange = (value: string) => {
		setSelectedChannel(value);
		if (value === 'ALL') {
			setColumnFilters([]);
		} else {
			setColumnFilters([{ id: 'channel', value }]);
		}
	};

	// Handle Excel export action
	const handleExportExcel = (key: React.Key) => {
		const selectedKey = key.toString();
		setSelectedStmType(selectedKey === 'EXPORT_ALL' ? 'ALL' : selectedKey);
		handleExport(selectedKey, {
			selectedStmType: selectedKey,
		});
	};

	// Export to PDF function
	const handleExportPdf = useCallback(async () => {
		try {
			if (!fetchedData?.body?.content?.length) {
				toast.error('No data available for PDF export.');
				return;
			}

			// Reset PDF state
			setPdfType(null);

			// Store original values
			const originalPageSize = pageSize;
			const originalPageIndex = pageIndex;

			// Set large page size for export
			setPageIndex(0);
			setPageSize(EXPORT_PAGE_SIZE);

			// Wait for state to update
			await new Promise((resolve) => setTimeout(resolve, 0));

			// Fetch all data
			const { data: allData } = await refetch();

			// Restore original pagination
			setPageSize(originalPageSize);
			setPageIndex(originalPageIndex);

			if (!allData?.body?.content?.length) {
				toast.error('No data available for PDF export.');
				return;
			}

			// Apply channel filter
			let transactions = allData.body.content;
			if (selectedChannel !== 'ALL') {
				transactions = transactions.filter((item: any) => item.channel === selectedChannel);
			}

			// Calculate transaction summary
			const totalDebit = transactions.reduce(
				(sum: number, txn: any) => sum + (txn.debit || 0),
				0,
			);
			const totalCredit = transactions.reduce(
				(sum: number, txn: any) => sum + (txn.credit || 0),
				0,
			);
			const currentBalance =
				transactions.length > 0 ? transactions[transactions.length - 1]?.afterTXN || 0 : 0;

			// Prepare customer detail (using wallet information)
			const customer = {
				firstNameEn: transactions[0]?.fwlName || 'N/A',
				accountNo: walletNo,
				addresses: [
					{
						village: 'N/A',
						city: 'Vientiane',
						province: 'Vientiane Capital',
					},
				],
				locked: true,
				status: 1,
				customer: {
					vfDocDate: dayjs().format('YYYY-MM-DD'),
				},
			};

			// Set PDF data
			setTransPDF(transactions);
			setTransSummary({
				debit: totalDebit,
				credit: totalCredit,
				currentBalance: currentBalance,
			});
			setCustomerDetail(customer);
			setPdfType('type1');

			toast.success('Generating PDF...');
		} catch (error) {
			console.error('Error exporting PDF:', error);
			toast.error('Failed to export PDF.');
		}
	}, [refetch, fetchedData, pageSize, pageIndex, selectedChannel]);

	return (
		<>
			<ModalProvider
				isOpen={isOpen}
				onOpenChange={() => setIsOpen(false)}
				title='ລາຍລະອຽດ'
				scrollBehavior='outside'
				size='3xl'>
				<div className='py-4'></div>
			</ModalProvider>
			{(isLoading || isExporting) && <Loading />}
			<PageWrapper name='Txn Wallet'>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap>
							<div className='mb-4 flex items-center gap-4 space-x-1'>
								<p>Date</p>
								<div className='flex items-center gap-2'>
									<div className='flex items-center rounded-md border p-1'>
										<Icon className='mx-1' icon='HeroCalendar' />
										<input
											type='date'
											value={state[0].startDate ? dayjs(state[0].startDate).format('YYYY-MM-DD') : ''}
											onChange={(e) => {
												const newDate = e.target.value ? dayjs(e.target.value).startOf('day').toDate() : undefined;
												handleDateChange({ selection: { startDate: newDate, endDate: state[0].endDate, key: 'selection' } });
											}}
											className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
										/>
									</div>
									<span className='text-gray-400'>-</span>
									<div className='flex items-center rounded-md border p-1'>
										<Icon className='mx-1' icon='HeroCalendar' />
										<input
											type='date'
											value={state[0].endDate ? dayjs(state[0].endDate).format('YYYY-MM-DD') : ''}
											onChange={(e) => {
												const newDate = e.target.value ? dayjs(e.target.value).endOf('day').toDate() : undefined;
												handleDateChange({ selection: { startDate: state[0].startDate, endDate: newDate, key: 'selection' } });
											}}
											className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
										/>
									</div>
								</div>

								<div className='flex items-center gap-2 md:gap-4'>
									<p>ເລກກະເປົ໋າ</p>
									<div className='flex items-center gap-2 rounded-md border bg-gray-50 px-4 py-2 md:min-w-[400px]'>
										<span className='font-medium text-gray-700'>
											{walletNo} -{' '}
											{accountList?.body?.find(
												(acc: any) => acc.accountNo === walletNo,
											)?.accountName || 'Loading...'}
										</span>
									</div>
								</div>

								{/* Channel Filter */}
								<div className='flex items-center gap-2'>
									<p>Channel</p>
									<Select
										placeholder='Select Channel'
										selectedKeys={[selectedChannel]}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0] as string;
											handleChannelFilterChange(selected);
										}}
										className='min-w-[200px]'
										size='sm'
										radius='sm'>
										{[
											{ key: 'ALL', label: 'ທັງໝົດ (All)' },
											...uniqueChannels.map((channel: any) => ({
												key: channel,
												label: channel,
											})),
										].map((item) => (
											<SelectItem key={item.key} value={item.key}>
												{item.label}
											</SelectItem>
										))}
									</Select>
								</div>
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<div className='flex items-center gap-3'>
							{/* Current Filter Indicator */}
							<div className='flex items-center gap-2'>
								{selectedStmType !== 'ALL' && searchTriggered && (
									<div className='flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5'>
										<Icon
											icon='HeroFunnel'
											className='text-blue-600'
											size='text-sm'
										/>
										<span className='text-sm font-medium text-blue-700'>
											{
												STM_TYPES.find((t) => t.key === selectedStmType)
													?.label
											}
										</span>
									</div>
								)}
								{selectedChannel !== 'ALL' && searchTriggered && (
									<div className='flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5'>
										<Icon
											icon='HeroFunnel'
											className='text-purple-600'
											size='text-sm'
										/>
										<span className='text-sm font-medium text-purple-700'>
											{selectedChannel}
										</span>
									</div>
								)}
							</div>

							{/* Divider */}
							{(selectedStmType !== 'ALL' || selectedChannel !== 'ALL') &&
								searchTriggered && <div className='h-8 w-px bg-gray-300' />}

							{/* Export Excel Dropdown */}
							<HeroDropdown>
								<HeroDropdownTrigger>
									<Button
										color='primary'
										radius='sm'
										variant='ghost'
										className='font-medium'
										startContent={<PiMicrosoftExcelLogoFill size={20} />}
										endContent={<HiChevronDown size={16} />}
										isDisabled={
											!searchTriggered ||
											!fetchedData?.body?.content?.length ||
											isExporting
										}
										isLoading={isExporting}>
										Export Excel
									</Button>
								</HeroDropdownTrigger>
								<HeroDropdownMenu
									aria-label='Export Excel by transaction type'
									onAction={handleExportExcel}>
									{STM_TYPES.map((type) => (
										<HeroDropdownItem
											key={type.key}
											startContent={type.icon}
											description={
												type.key === 'EXPORT_ALL'
													? 'ສົ່ງອອກທັງໝົດໃນຫຼາຍ Sheet'
													: 'ສົ່ງອອກເປັນໄຟລ໌ Excel'
											}
											className={
												type.key === 'EXPORT_ALL'
													? 'bg-purple-50 font-semibold'
													: selectedStmType === type.key
														? 'bg-primary-50'
														: ''
											}>
											{type.label}
										</HeroDropdownItem>
									))}
								</HeroDropdownMenu>
							</HeroDropdown>

							{/* Export PDF Button */}
							<Button
								variant='ghost'
								radius='sm'
								color='danger'
								className='font-medium'
								startContent={<AiOutlineFilePdf size={20} />}
								onPress={handleExportPdf}
								isDisabled={!fetchedData?.body?.content?.length}>
								Export PDF
							</Button>
						</div>

						{pdfType === 'type1' && transPDF.length > 0 && (
							<PDFGenerator
								startDate={startDate}
								endDate={endDate}
								customerDetail={customerDetail}
								transSummary={transSummary}
								transactionData={transPDF}
							/>
						)}
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>Transaction Wallet</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{table.getFilteredRowModel().rows.length} /{' '}
									{fetchedData?.body?.totalElements || 0} items
								</Badge>
							</CardHeaderChild>
						</CardHeader>
						<CardBody className='overflow-auto'>
							<TableTemplate
								className='table-fixed max-md:min-w-[50rem]'
								table={table}
							/>
						</CardBody>
						<TableCardFooterTemplate
							table={table}
							onPageChange={(newPage) => setPageIndex(newPage)}
							onPageSizeChange={(newSize) => setPageSize(newSize)}>
							<div className='pagination-info'>
								<span>{`Showing ${fetchedData?.body?.numberOfElements || 0} items out of ${fetchedData?.body?.totalElements || 0} total items`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default TxnWalletReportPage;
