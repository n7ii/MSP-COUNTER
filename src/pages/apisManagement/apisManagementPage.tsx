import { useMemo, useState, useCallback } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';
import Input from '@/components/form/Input.tsx';
import Button from '@/components/ui/Button.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import Badge from '@/components/ui/Badge.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';

import dayjs from 'dayjs';
import { Range } from 'react-date-range';
import {
	useGetApisDataQuery,
	useCancelApiMutation,
	useUploadApisDataMutation,
} from '@/pages/apisManagement/redux/apisApiSlice.ts';
import DateRangeFilter from '@/pages/sales/SalesDashboardPage/DateRangeFilter.tsx';
import { AlertService } from '@/common/services/alert.service.ts';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import { Button as HeroButton } from '@heroui/react';
import { UploadApiFormValues } from '@/pages/apisManagement/types/apisManagement.types.ts';
import UploadApiModal from '@/pages/apisManagement/components/uploadApiModal.tsx';

const alert = new AlertService();

const ApiManagementPage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [searchTriggered, setSearchTriggered] = useState(true); // Changed to true for auto-fetch on mount
	const [customerUsername] = useState('');

	// Modal states
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
	const [cancelReason, setCancelReason] = useState('');

	const [isUploadModalOpen, setUploadModalOpen] = useState(false);

	const [uploadApi, { isLoading: isUploading }] = useUploadApisDataMutation();

	// Date Range State
	const [state, setState] = useState<Range[]>([
		{
			startDate: dayjs().startOf('month').startOf('day').toDate(),
			endDate: dayjs().endOf('month').endOf('day').toDate(),
			key: 'selection',
		},
	]);

	// Computed date values
	const startDate = state[0]?.startDate ? dayjs(state[0].startDate).format('YYYY-MM-DD') : '';
	const endDate = state[0]?.endDate ? dayjs(state[0].endDate).format('YYYY-MM-DD') : '';

	const { data, isLoading } = useGetApisDataQuery(
		{
			startDate,
			endDate,
		},
		{ skip: !searchTriggered },
	);

	const [cancelApi, { isLoading: isCancelling }] = useCancelApiMutation();

	const handleDateChange = useCallback((item: any) => {
		setState([item.selection]);
		setSearchTriggered(false);
	}, []);

	const handleSearch = useCallback(() => {
		setSearchTriggered(true);
	}, []);

	const handleCancelClick = useCallback((row: any) => {
		setSelectedTransaction(row);
		setCancelReason('');
		setModalOpen(true);
	}, []);

	const handleConfirmCancel = useCallback(async () => {
		if (!selectedTransaction) return;

		const { isConfirmed } = await alert.confirmModal('ທ່ານຕ້ອງການຍົກເລີກທຸລະກຳນີ້ຫຼືບໍ່?');

		if (!isConfirmed) return;

		try {
			const result = await cancelApi({
				trn_id: selectedTransaction.trn_id,
			}).unwrap();

			if (result?.header?.status === '01') {
				await alert.success(
					result?.header?.message || 'Transaction cancelled successfully!',
				);
				setModalOpen(false);
				setCancelReason('');
				setSelectedTransaction(null);
			} else {
				await alert.error(result?.header?.message || 'Failed to cancel transaction');
			}
		} catch (error: any) {
			console.error('Cancel error:', error);
			await alert.error(error?.data?.header?.message || 'Failed to cancel transaction');
		}
	}, [selectedTransaction, cancelReason, cancelApi]);

	// Filter data by customerUsername if provided
	const filteredData = useMemo(() => {
		if (!data?.body) return [];
		if (!customerUsername) return data.body;

		return data.body.filter((item: any) =>
			item.trn_id?.toLowerCase().includes(customerUsername.toLowerCase()),
		);
	}, [data?.body, customerUsername]);

	const columnHelper = createColumnHelper<any>();
	const columns = useMemo(
		() => [
			columnHelper.display({
				id: 'no',
				header: 'NO',
				cell: (info) => {
					const currentPageIndex = info.table.getState().pagination.pageIndex;
					const currentPageSize = info.table.getState().pagination.pageSize;
					return currentPageIndex * currentPageSize + info.row.index + 1;
				},
				size: 60,
			}),
			columnHelper.accessor('trn_id', {
				header: 'Transaction ID',
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor('status', {
				header: 'Status',
				cell: (info) => {
					const status = info.getValue();
					return status === 'wait' ? (
						<Badge variant='outline' color='amber' className='border-transparent'>
							Wait
						</Badge>
					) : status === 'cancel' ? (
						<Badge variant='outline' color='red' className='border-transparent'>
							Cancel
						</Badge>
					) : status === 'success' ? (
						<Badge variant='outline' color='emerald' className='border-transparent'>
							Success
						</Badge>
					) : (
						<Badge variant='outline' color='zinc' className='border-transparent'>
							{status}
						</Badge>
					);
				},
			}),
			columnHelper.accessor('bis_date', {
				header: 'Business Date',
				cell: (info) => {
					const date = info.getValue();
					return date ? dayjs(date).format('DD/MM/YYYY') : '-';
				},
			}),
			columnHelper.accessor('create_date', {
				header: 'Create Date',
				cell: (info) => {
					const date = info.getValue();
					return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-';
				},
			}),
			columnHelper.accessor('update_date', {
				header: 'Update Date',
				cell: (info) => {
					const date = info.getValue();
					return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-';
				},
			}),
			columnHelper.accessor('fail_reason', {
				header: 'Fail Reason',
				cell: (info) => info.getValue() || '-',
			}),
			columnHelper.display({
				id: 'actions',
				header: 'Actions',
				cell: (info) => {
					const row = info.row.original;
					const status = row.status;

					return (
						<div className='flex gap-2'>
							{status === 'wait' && (
								<Button
									onClick={() => handleCancelClick(row)}
									variant='outline'
									color='red'
									size='sm'
									icon='HeroXMark'>
									Cancel
								</Button>
							)}
							{status !== 'wait' && <span className='text-sm text-gray-400'>-</span>}
						</div>
					);
				},
				size: 150,
			}),
		],
		[handleCancelClick, isCancelling],
	);

	const handleUploadSubmit = useCallback(
		async (values: UploadApiFormValues) => {
			try {
				const payload: any = {
					...values,
					ex_rate: values.ex_rate || '', // Add the missing field
				};

				const result = await uploadApi(payload).unwrap();

				if (result?.header?.status === '01') {
					await alert.success(result?.header?.message || 'Data uploaded successfully!');
					setUploadModalOpen(false);
				} else {
					await alert.error(result?.header?.message || 'Failed to upload data');
				}
			} catch (error: any) {
				console.error('Upload error:', error);
				await alert.error(error?.data?.header?.message || 'Failed to upload data');
			}
		},
		[uploadApi],
	);

	const table = useReactTable({
		data: filteredData,
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: false,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	return (
		<>
			{(isLoading || isCancelling) && <Loading />}
			<PageWrapper name='API Management'>
				<Subheader>
					<SubheaderLeft>
						<DateRangeFilter
							state={state}
							onDateChange={handleDateChange}
							onSearch={handleSearch}
						/>
					</SubheaderLeft>
					<SubheaderRight>
						<Button
							onClick={() => setUploadModalOpen(true)}
							variant='solid'
							color='emerald'
							icon='HeroArrowUpTray'>
							Upload API Data
						</Button>

						<FieldWrap
							firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
							lastSuffix={
								globalFilter && (
									<Icon
										icon='HeroXMark'
										color='red'
										className='mx-2 cursor-pointer'
										onClick={() => setGlobalFilter('')}
									/>
								)
							}>
							<Input
								id='search'
								name='search'
								placeholder='Search...'
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
							/>
						</FieldWrap>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>API Management</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{filteredData.length} items
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
								<span>{`Showing ${table.getRowModel().rows.length} items out of ${filteredData.length} total items`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>

				{/* Cancel Confirmation Modal */}
				<ModalProvider
					isOpen={isModalOpen}
					onOpenChange={() => setModalOpen(!isModalOpen)}
					title='ຢືນຢັນຍົກເລີກ'
					size='xl'
					scrollBehavior='inside'>
					<div className='space-y-4 py-4'>
						<p className='text-lg'>
							ທ່ານມີຄວາມແນ່ໃຈວ່າຈະຍົກເລີກທຸລະກຳ{' '}
							<span className='font-semibold text-danger'>
								{selectedTransaction?.trn_id}
							</span>{' '}
							ນີ້ບໍ?
						</p>

						<HeroButton
							className='w-full'
							onPress={handleConfirmCancel}
							color='danger'
							size='lg'
							isLoading={isCancelling}>
							ຢືນຢັນຍົກເລີກ
						</HeroButton>
					</div>
				</ModalProvider>

				<ModalProvider
					isOpen={isModalOpen}
					onOpenChange={() => setModalOpen(!isModalOpen)}
					title='ຢືນຢັນຍົກເລີກ'
					size='xl'
					scrollBehavior='inside'>
					<div className='space-y-4 py-4'>
						<p className='text-lg'>
							ທ່ານມີຄວາມແນ່ໃຈວ່າຈະຍົກເລີກທຸລະກຳ{' '}
							<span className='font-semibold text-danger'>
								{selectedTransaction?.trn_id}
							</span>{' '}
							ນີ້ບໍ?
						</p>

						<HeroButton
							className='w-full'
							onPress={handleConfirmCancel}
							color='danger'
							size='lg'
							isLoading={isCancelling}>
							ຢືນຢັນຍົກເລີກ
						</HeroButton>
					</div>
				</ModalProvider>

				{/* Upload API Modal - ADD THIS */}
				<UploadApiModal
					isOpen={isUploadModalOpen}
					onClose={() => setUploadModalOpen(false)}
					onSubmit={handleUploadSubmit}
					isLoading={isUploading}
				/>
			</PageWrapper>
		</>
	);
};

export default ApiManagementPage;
