import { useState, useEffect, useCallback } from 'react';
import {
	createColumnHelper,
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	ColumnFiltersState,
} from '@tanstack/react-table';
import { Range } from 'react-date-range';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

// Components
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import Badge from '@/components/ui/Badge.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import Icon from '@/components/icon/Icon.tsx';
import {
	Button,
	Dropdown as HeroDropdown,
	DropdownItem as HeroDropdownItem,
	DropdownTrigger as HeroDropdownTrigger,
	DropdownMenu as HeroDropdownMenu,
} from '@heroui/react';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { HiChevronDown } from 'react-icons/hi';

// Custom Components
import SearchFilters from './components/SearchFilters';
import TransactionTable from '@/pages/reports/statement/components/TransactionTable.tsx';

// Utils & API
import { useGetCustomerStatementQuery } from '@/pages/reports/redux/queries/txnWalletApiSlice.ts';
import { createColumns } from '@/pages/reports/statement/utils/tableColumns.tsx';
import { exportToExcel } from '@/pages/reports/statement/components/excels/ExportWalletStatement.tsx';
import { exportAllToExcel } from '@/pages/reports/utils/statementUtils.ts';
import PDFGeneratorCustomer from '@/pages/reports/components/statementPDFCustomer.tsx';
import Select from '@/components/form/Select.tsx';

// Constants
const INITIAL_PAGE_SIZE = 10;
const EXPORT_PAGE_SIZE = 1000000000;
const DEFAULT_CUSTOMER_USERNAME = '2059944454';

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

const StatementPage = () => {
	// Table State
	const [globalFilter, setGlobalFilter] = useState('');
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
	const [selectedStmType, setSelectedStmType] = useState<string>('ALL');
	const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

	// Search State
	const [customerUsername, setCustomerUsername] = useState(DEFAULT_CUSTOMER_USERNAME);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchTrigger, setSearchTrigger] = useState(0);
	const [fetchedData, setFetchedData] = useState<any>(null);

	// Date Range State
	const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().startOf('month').startOf('day').toDate(),
			endDate: dayjs().endOf('month').endOf('day').toDate(),
			key: 'selection',
		},
	]);

	// PDF Export State
	const [pdfType, setPdfType] = useState<'type1' | 'type2' | null>(null);
	const [transPDF, setTransPDF] = useState<any>([]);
	const [transSummary, setTransSummary] = useState<any>([]);
	const [customerDetail, setCustomerDetail] = useState<any>([]);

	// Computed values
	const startDate = state[0]?.startDate?.toISOString().split('T')[0] || '';
	const endDate = state[0]?.endDate?.toISOString().split('T')[0] || '';

	// API Query
	const { data, isLoading, refetch } = useGetCustomerStatementQuery(
		{
			page: pageIndex,
			size: pageSize,
			customerUsername,
			dateStart: state[0].startDate
				? dayjs(state[0].startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss')
				: '',
			dateEnd: state[0].endDate
				? dayjs(state[0].endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
				: '',
		},
		{ skip: searchTrigger === 0 },
	);

	// Effects - Update fetched data
	useEffect(() => {
		if (data) {
			const responseData = data?.body?.data;
			setFetchedData(responseData);
			setIsSearchLoading(false);
		}
	}, [data]);

	// Get unique channels from data
	const uniqueChannels = Array.from(
		new Set(fetchedData?.content?.map((item: any) => item.channel).filter(Boolean)),
	).sort();

	// Handlers
	const handleSearch = useCallback(() => {
		setIsSearchLoading(true);
		setSearchTrigger((prev) => prev + 1);
		refetch();
	}, [refetch]);

	const handleDateChange = useCallback((item: any) => {
		setState([item.selection]);
		setSearchTrigger(0);
	}, []);

	const handleInputChange = useCallback((value: string) => {
		setCustomerUsername(value);
		setSearchTrigger(0);
	}, []);

	const handleChannelFilterChange = useCallback((e: any) => {
		const value = e.target.value;
		setSelectedChannel(value);
		if (value === 'ALL') {
			setColumnFilters([]);
		} else {
			setColumnFilters([{ id: 'channel', value }]);
		}
	}, []);

	// Export filtered data by type
	const exportTypeDataToExcel = useCallback(
		async (typeKey?: string) => {
			try {
				if (searchTrigger === 0 || !fetchedData?.content?.length) {
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

				if (allData?.body?.data?.content?.length) {
					// Filter data by selected statement type and channel
					let filteredData = allData.body.data.content;

					if (exportType !== 'ALL') {
						filteredData = filteredData.filter(
							(item: any) => item.stmType === exportType,
						);
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
					const fileName = `Statement_Wallet_${exportType}_Report`;

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
		},
		[
			refetch,
			pageSize,
			pageIndex,
			selectedStmType,
			selectedChannel,
			searchTrigger,
			fetchedData,
		],
	);

	// Export all data with multiple sheets
	const exportExcelAll = useCallback(async () => {
		try {
			if (searchTrigger === 0 || !fetchedData?.content?.length) {
				toast.error('ກະລຸນາຄົ້ນຫາຂໍ້ມູນກ່ອນສົ່ງອອກ!');
				return;
			}

			const originalPageSize = pageSize;
			const originalPageIndex = pageIndex;

			setPageIndex(0);
			setPageSize(EXPORT_PAGE_SIZE);

			await new Promise((resolve) => setTimeout(resolve, 200));

			const { data: allData } = await refetch();

			if (allData?.body?.data?.content?.length) {
				// Apply channel filter if selected
				let dataToExport = allData.body.data.content;
				if (selectedChannel !== 'ALL') {
					dataToExport = dataToExport.filter(
						(item: any) => item.channel === selectedChannel,
					);
				}

				console.log('Exporting all data with multiple sheets...');
				await exportAllToExcel(dataToExport, 'Statement_Wallet_All_Report');

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
	}, [refetch, pageSize, pageIndex, selectedChannel, searchTrigger, fetchedData]);

	// Export to PDF
	const handleExportPdf = useCallback(
		async (type: 'type1' | 'type2') => {
			try {
				setPdfType(null);
				setPageSize(EXPORT_PAGE_SIZE);

				await new Promise((resolve) => setTimeout(resolve, 0));

				const { data: allData } = await refetch();

				if (allData?.body?.data?.content?.length) {
					// Apply channel filter
					let transactions = allData.body.data.content;
					if (selectedChannel !== 'ALL') {
						transactions = transactions.filter(
							(item: any) => item.channel === selectedChannel,
						);
					}

					setTransPDF(transactions);
					setTransSummary(allData.body.summary);
					setCustomerDetail(allData.body.customerDetail);
					setPdfType(type);
				} else {
					toast.error('No data available for export.');
				}
			} catch (error) {
				console.error('Error exporting data:', error);
				toast.error('Failed to export data.');
			} finally {
				setPageSize(INITIAL_PAGE_SIZE);
			}
		},
		[refetch, selectedChannel],
	);

	const handleExportExcel = useCallback(
		(key: React.Key) => {
			const selectedKey = key.toString();

			if (selectedKey === 'EXPORT_ALL') {
				exportExcelAll();
			} else {
				setSelectedStmType(selectedKey);
				exportTypeDataToExcel(selectedKey);
			}
		},
		[exportExcelAll, exportTypeDataToExcel],
	);

	// Table Setup
	const columnHelper = createColumnHelper<any>();
	const columns = createColumns(columnHelper);

	const table = useReactTable({
		data: fetchedData?.content || [],
		columns,
		state: {
			globalFilter,
			columnFilters,
		},
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: fetchedData?.totalPages || 1,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	return (
		<>
			{(isSearchLoading || isLoading) && <Loading />}

			<PageWrapper name='Statement Wallet'>
				<Subheader>
					<SubheaderLeft>
						<SearchFilters
							state={state}
							customerUsername={customerUsername}
							onDateChange={handleDateChange}
							onInputChange={handleInputChange}
							onSearch={handleSearch}
						/>
						<div className='flex flex-col gap-4 pb-4'>
							{/* Channel Filter - Show only after search */}
							{searchTrigger > 0 && uniqueChannels.length > 0 && (
								<div className='flex items-center gap-2'>
									<p className='text-sm font-medium'>Channel:</p>
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
						</div>
					</SubheaderLeft>
					<SubheaderRight>
						<div className='flex items-center gap-3'>
							{/* Current Filter Indicators */}
							<div className='flex items-center gap-2'>
								{selectedStmType !== 'ALL' && searchTrigger > 0 && (
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
								{selectedChannel !== 'ALL' && searchTrigger > 0 && (
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
								searchTrigger > 0 && <div className='h-8 w-px bg-gray-300' />}

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
											searchTrigger === 0 || !fetchedData?.content?.length
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
								onPress={() => handleExportPdf('type1')}
								isDisabled={searchTrigger === 0 || !fetchedData?.content?.length}>
								Export PDF
							</Button>
						</div>

						{/* PDF Generator - Hidden component */}
						{pdfType === 'type1' && transPDF.length > 0 && (
							<PDFGeneratorCustomer
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
								<CardTitle>Statement Wallet</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{table.getFilteredRowModel().rows.length} /{' '}
									{fetchedData?.totalElements || 0} items
								</Badge>
							</CardHeaderChild>
						</CardHeader>

						<TransactionTable
							table={table}
							fetchedData={fetchedData}
							onPageChange={setPageIndex}
							onPageSizeChange={setPageSize}
						/>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default StatementPage;
