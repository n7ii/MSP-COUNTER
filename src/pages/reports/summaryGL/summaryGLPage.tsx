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
} from '@heroui/react';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { LuSearch } from 'react-icons/lu';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { HiChevronDown } from 'react-icons/hi';
import PDFGenerator from '@/pages/reports/components/statementPDFAll.tsx';
import Select from '@/components/form/Select.tsx';
import { useGetAcctListQuery } from '@/redux/queries/dashBroadApiSlice.ts';
import { exportToExcel } from '@/pages/reports/summaryGL/components/excels/ExportSummaryWallet.tsx';
import { exportAllToExcel } from '@/pages/reports/utils/statementUtils.ts';

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

const SummaryGlPage = () => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [walletNo, setWalletNo] = useState('');
	const [searchTriggered, setSearchTriggered] = useState(false);
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
		setSearchTriggered(false);
	};

	const handleInputChange = (e: any) => {
		const value = e.target.value;
		setWalletNo(value);
		setSearchTriggered(false);
	};

	const handleChannelFilterChange = (e: any) => {
		const value = e.target.value;
		setSelectedChannel(value);
		if (value === 'ALL') {
			setColumnFilters([]);
		} else {
			setColumnFilters([{ id: 'channel', value }]);
		}
	};

	const handleSearch = () => {
		if (!state[0]?.endDate) {
			toast.error('ກະລຸນາເລືອກວັນທີ!');
		} else if (!walletNo) {
			toast.error('ກະລຸນາເລືອກເລກກະເປົ໋າ!');
		} else {
			setSearchTriggered(true);
			refetch();
		}
	};

	// Export filtered data by type
	const exportTypeDataToExcel = async (typeKey?: string) => {
		try {
			if (!searchTriggered || !fetchedData?.body?.content?.length) {
				toast.error('ກະລຸນາຄົ້ນຫາຂໍ້ມູນກ່ອນສົ່ງອອກ!');
				return;
			}

			const exportType = typeKey || selectedStmType;
			const originalPageSize = pageSize;
			const originalPageIndex = pageIndex;

			setPageIndex(0);
			setPageSize(EXPORT_PAGE_SIZE);

			await new Promise((resolve) => setTimeout(resolve, 200));

			const { data: allData } = await refetch();

			if (allData?.body?.content?.length) {
				// Filter data by selected statement type and channel
				let filteredData = allData.body.content;

				if (exportType !== 'ALL') {
					filteredData = filteredData.filter((item: any) => item.stmType === exportType);
				}

				// Apply channel filter
				if (selectedChannel !== 'ALL') {
					filteredData = filteredData.filter(
						(item: any) => item.channel === selectedChannel,
					);
				}

				if (filteredData.length === 0) {
					toast.error(`ບໍ່ມີຂໍ້ມູນປະເພດ ${exportType}`);
					setPageSize(originalPageSize);
					setPageIndex(originalPageIndex);
					return;
				}

				console.log('Filtered data:', filteredData);

				// Generate filename based on type
				const fileName = `Summary_GL_Wallet_${exportType}_Report`;

				await exportToExcel(filteredData, fileName);
			} else {
				toast.error('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
			}

			setPageSize(originalPageSize);
			setPageIndex(originalPageIndex);
		} catch (error) {
			console.error('Error exporting data:', error);
			toast.error('ການສົ່ງອອກຂໍ້ມູນລົ້ມເຫລວ');
		}
	};

	// Export all data with multiple sheets
	const exportExcelAll = async () => {
		try {
			if (!searchTriggered || !fetchedData?.body?.content?.length) {
				toast.error('ກະລຸນາຄົ້ນຫາຂໍ້ມູນກ່ອນສົ່ງອອກ!');
				return;
			}

			const originalPageSize = pageSize;
			const originalPageIndex = pageIndex;

			setPageIndex(0);
			setPageSize(EXPORT_PAGE_SIZE);

			await new Promise((resolve) => setTimeout(resolve, 200));

			const { data: allData } = await refetch();

			if (allData?.body?.content?.length) {
				// Apply channel filter if selected
				let dataToExport = allData.body.content;
				if (selectedChannel !== 'ALL') {
					dataToExport = dataToExport.filter(
						(item: any) => item.channel === selectedChannel,
					);
				}

				console.log('Exporting all data with multiple sheets...');
				await exportAllToExcel(dataToExport, 'Summary_GL_Wallet_All_Report');

				toast.success(`ສົ່ງອອກທັງໝົດສຳເລັດ ${dataToExport.length} ລາຍການ`);
			} else {
				toast.error('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
			}

			setPageSize(originalPageSize);
			setPageIndex(originalPageIndex);
		} catch (error) {
			console.error('Error exporting data:', error);
			toast.error('ການສົ່ງອອກຂໍ້ມູນລົ້ມເຫລວ');
		}
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

			// Get selected account details
			const selectedAccount = accountList?.body?.find(
				(account: any) => account.accountNo === walletNo,
			);

			console.log('selectedAccount', selectedAccount);

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

			// Prepare customer detail
			const customer = {
				firstNameEn: selectedAccount?.accountName || transactions[0]?.fwlName || 'N/A',
				accountNo: selectedAccount?.accountNo,
				addresses: [
					{
						village: '',
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
	}, [refetch, fetchedData, pageSize, pageIndex, walletNo, accountList, selectedChannel]);

	const handleExportExcel = (key: React.Key) => {
		const selectedKey = key.toString();

		if (selectedKey === 'EXPORT_ALL') {
			exportExcelAll();
		} else {
			setSelectedStmType(selectedKey);
			exportTypeDataToExcel(selectedKey);
		}
	};

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
			{isLoading && <Loading />}
			<PageWrapper name='Summary GL'>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap>
							<div className='mb-4 flex flex-wrap items-center gap-4'>
								<div className='flex items-center gap-2'>
									<p>Date</p>
									<div className='flex items-center gap-2'>
										<div className='flex items-center rounded-md border p-1'>
											<Icon className='mx-1' icon='HeroCalendar' />
											<input
												type='date'
												value={
													state[0].startDate
														? dayjs(state[0].startDate).format(
																'YYYY-MM-DD',
															)
														: ''
												}
												onChange={(e) => {
													const newDate = e.target.value
														? dayjs(e.target.value)
																.startOf('day')
																.toDate()
														: undefined;
													handleDateChange({
														selection: {
															startDate: newDate,
															endDate: state[0].endDate,
															key: 'selection',
														},
													});
												}}
												className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
											/>
										</div>
										<span className='text-gray-400'>-</span>
										<div className='flex items-center rounded-md border p-1'>
											<Icon className='mx-1' icon='HeroCalendar' />
											<input
												type='date'
												value={
													state[0].endDate
														? dayjs(state[0].endDate).format(
																'YYYY-MM-DD',
															)
														: ''
												}
												onChange={(e) => {
													const newDate = e.target.value
														? dayjs(e.target.value)
																.endOf('day')
																.toDate()
														: undefined;
													handleDateChange({
														selection: {
															startDate: state[0].startDate,
															endDate: newDate,
															key: 'selection',
														},
													});
												}}
												className='border-none bg-transparent px-1 py-1 text-sm outline-none focus:ring-0'
											/>
										</div>
									</div>
								</div>

								<div className='flex items-center gap-2'>
									<p>ບັນຊີຕິດຕາມ</p>
									<Select
										id='wlNo'
										name='wlNo'
										className='w-full md:min-w-[400px]'
										value={walletNo}
										onChange={handleInputChange}
										placeholder='Select Account'>
										{accountList?.body?.map((account: any, index: number) => (
											<option key={index} value={account.accountNo}>
												{account.accountNo} - {account.accountName}
											</option>
										))}
									</Select>
								</div>

								{/* Channel Filter */}
								{searchTriggered && uniqueChannels.length > 0 && (
									<div className='flex items-center gap-2'>
										<p>Channel</p>
										<Select
											id='channel'
											name='channel'
											className='w-full md:min-w-[200px]'
											value={selectedChannel}
											onChange={handleChannelFilterChange}>
											<option value='ALL'>ທັງໝົດ (All)</option>
											{uniqueChannels.map((channel: any, index: number) => (
												<option key={index} value={channel}>
													{channel}
												</option>
											))}
										</Select>
									</div>
								)}

								<Button
									variant='solid'
									className='w-full md:w-32'
									startContent={<LuSearch size='18' />}
									color='primary'
									onPress={handleSearch}>
									Search
								</Button>
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						<div className='flex items-center gap-3'>
							{/* Current Filter Indicators */}
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
											!searchTriggered || !fetchedData?.body?.content?.length
										}>
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

						{/* PDF Generator - Hidden component */}
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
								<CardTitle>Summary GL Wallet</CardTitle>
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

export default SummaryGlPage;
