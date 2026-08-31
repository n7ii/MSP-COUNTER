import { useState } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
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
	SortingState,
} from '@tanstack/react-table';
import {
	useGetRevertHistoryQuery,
	useGetRevertDetailQuery,
	useRevertTransactionMutation,
} from '@/pages/revert/redux/queries/revertApiSlice.ts';
import { Button, Input, Chip, Textarea } from '@heroui/react';
import { LuSearch, LuHistory, LuFileText, LuRotateCcw, LuX } from 'react-icons/lu';
import { MdOutlineInfo } from 'react-icons/md';
import { HiViewList } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';

const RevertPage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [transactionId, setTransactionId] = useState('');
	const [searchedTransactionId, setSearchedTransactionId] = useState('');
	const [revertReason, setRevertReason] = useState('');
	const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);

	// Fetch revert history (fetch all if no transactionId)
	const {
		data: historyData,
		isLoading: isHistoryLoading,
		refetch: refetchHistory,
	} = useGetRevertHistoryQuery({
		transactionId: searchedTransactionId || undefined,
		page: pageIndex,
		size: pageSize,
	});

	// Fetch transaction detail
	const {
		data: detailData,
		isLoading: isDetailLoading,
		refetch: refetchDetail,
	} = useGetRevertDetailQuery(
		{
			transactionId: searchedTransactionId,
		},
		{ skip: !searchedTransactionId },
	);

	// Revert mutation
	const [revertTransaction, { isLoading: isReverting }] = useRevertTransactionMutation();

	// Handle search
	const handleSearch = () => {
		if (!transactionId.trim()) {
			toast.error('Please enter a transaction ID');
			return;
		}
		setSearchedTransactionId(transactionId);
		setPageIndex(0);
	};

	// Handle view all
	const handleViewAll = () => {
		setTransactionId('');
		setSearchedTransactionId('');
		setPageIndex(0);
	};

	// Handle revert
	const handleRevert = async () => {
		if (!revertReason.trim()) {
			toast.error('Please enter a reason for reverting');
			return;
		}

		try {
			const result = await revertTransaction({
				transactionId: searchedTransactionId,
				reason: revertReason,
			}).unwrap();

			if (result.header.code === '0000') {
				toast.success('Transaction reverted successfully');
				setIsRevertModalOpen(false);
				setRevertReason('');
				refetchHistory();
				refetchDetail();
			} else {
				toast.error(result.header.message || 'Failed to revert transaction');
			}
		} catch (error: any) {
			toast.error(error?.data?.header?.message || 'Failed to revert transaction');
		}
	};

	// History table columns
	const historyColumnHelper = createColumnHelper<any>();
	const historyColumns = [
		historyColumnHelper.accessor('id', {
			header: 'ID',
			cell: (info) => <div className='font-medium'>{info.getValue()}</div>,
		}),
		historyColumnHelper.accessor('referenceId', {
			header: 'Reference ID',
			cell: (info) => <div className='font-semibold text-blue-600'>{info.getValue()}</div>,
		}),
		historyColumnHelper.accessor('rfNo', {
			header: 'RF No',
			cell: (info) => (
				<div className='font-medium'>
					{info.getValue() || <span className='text-gray-400'>N/A</span>}
				</div>
			),
		}),
		historyColumnHelper.accessor('txNo', {
			header: 'Transaction No',
			cell: (info) => (
				<div className='font-medium'>
					{info.getValue() || <span className='text-gray-400'>N/A</span>}
				</div>
			),
		}),
		historyColumnHelper.accessor('time_revert', {
			header: 'Revert Time',
			cell: (info) => (
				<div>{info.getValue() || <span className='text-gray-400'>N/A</span>}</div>
			),
		}),
		historyColumnHelper.accessor('code', {
			header: 'Code',
			cell: (info) => (
				<Chip
					size='sm'
					color={info.getValue() === 'EDCA01' ? 'success' : 'danger'}
					variant='flat'>
					{info.getValue()}
				</Chip>
			),
		}),
		historyColumnHelper.accessor('message', {
			header: 'Message',
			cell: (info) => <div className='max-w-md'>{info.getValue()}</div>,
		}),
		historyColumnHelper.accessor('revert_username', {
			header: 'Username',
			cell: (info) => (
				<div>{info.getValue() || <span className='text-gray-400'>N/A</span>}</div>
			),
		}),
		historyColumnHelper.accessor('revert_tel', {
			header: 'Tel',
			cell: (info) => (
				<div>{info.getValue() || <span className='text-gray-400'>N/A</span>}</div>
			),
		}),
		historyColumnHelper.accessor('revert_name', {
			header: 'Name',
			cell: (info) => (
				<div>
					{info.getValue() && info.row.original.revert_sure_name
						? `${info.getValue()} ${info.row.original.revert_sure_name}`
						: info.getValue() || <span className='text-gray-400'>N/A</span>}
				</div>
			),
		}),
		historyColumnHelper.accessor('roll_back', {
			header: 'Roll Back',
			cell: (info) => (
				<div>
					{info.getValue() ? (
						<Chip size='sm' color='success' variant='flat'>
							Yes
						</Chip>
					) : (
						<span className='text-gray-400'>No</span>
					)}
				</div>
			),
		}),
	];

	// Detail table columns
	const detailColumnHelper = createColumnHelper<any>();
	const detailColumns = [
		detailColumnHelper.accessor('txNo', {
			header: 'Transaction No',
			cell: (info) => <div className='font-medium'>{info.getValue()}</div>,
		}),
		detailColumnHelper.accessor('txnDate', {
			header: 'Transaction Date',
			cell: (info) => <div>{info.getValue()}</div>,
		}),
		detailColumnHelper.accessor('fwlName', {
			header: 'From Wallet',
			cell: (info) => (
				<div>
					<div className='font-medium'>{info.getValue()}</div>
					<div className='text-xs text-gray-500'>{info.row.original.ftel}</div>
				</div>
			),
		}),
		detailColumnHelper.accessor('twlName', {
			header: 'To Wallet',
			cell: (info) => (
				<div>
					<div className='font-medium'>{info.getValue()}</div>
					<div className='text-xs text-gray-500'>{info.row.original.ttel}</div>
				</div>
			),
		}),
		detailColumnHelper.accessor('amount', {
			header: 'Amount',
			cell: (info) => (
				<div className='font-semibold text-blue-600'>
					{info.getValue().toLocaleString()} {info.row.original.ccy}
				</div>
			),
		}),
		detailColumnHelper.accessor('fee', {
			header: 'Fee',
			cell: (info) => (
				<div className='text-orange-600'>
					{info.getValue().toLocaleString()} {info.row.original.feeCcy}
				</div>
			),
		}),
		detailColumnHelper.accessor('drcrgType', {
			header: 'Type',
			cell: (info) => (
				<Chip
					size='sm'
					color={info.getValue() === 'D' ? 'danger' : 'success'}
					variant='flat'>
					{info.getValue() === 'D' ? 'Debit' : 'Credit'}
				</Chip>
			),
		}),
		detailColumnHelper.accessor('beforeTXN', {
			header: 'Before Balance',
			cell: (info) => <div>{info.getValue().toLocaleString()}</div>,
		}),
		detailColumnHelper.accessor('afterTXN', {
			header: 'After Balance',
			cell: (info) => <div>{info.getValue().toLocaleString()}</div>,
		}),
		detailColumnHelper.accessor('remark', {
			header: 'Remark',
			cell: (info) => <div className='max-w-md text-xs'>{info.getValue()}</div>,
		}),
	];

	const historyTable = useReactTable({
		data: historyData?.body?.content || [],
		columns: historyColumns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: historyData?.body?.totalPages || 1,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	const detailTable = useReactTable({
		data: detailData?.body || [],
		columns: detailColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const isLoading = isHistoryLoading || isDetailLoading || isReverting;

	return (
		<>
			{isLoading && <Loading />}
			<ModalProvider
				isOpen={isRevertModalOpen}
				onOpenChange={() => setIsRevertModalOpen(false)}
				title='Revert Transaction'
				scrollBehavior='inside'
				size='lg'>
				<div className='space-y-4 py-4'>
					<div className='rounded-lg bg-yellow-50 p-4'>
						<div className='flex items-start gap-3'>
							<MdOutlineInfo className='mt-1 text-yellow-600' size={24} />
							<div>
								<h4 className='font-semibold text-yellow-800'>Warning</h4>
								<p className='text-sm text-yellow-700'>
									You are about to revert transaction:{' '}
									<strong>{searchedTransactionId}</strong>
									<br />
									This action cannot be undone. Please provide a reason.
								</p>
							</div>
						</div>
					</div>

					<Textarea
						label='Reason for Revert'
						placeholder='Enter the reason for reverting this transaction'
						value={revertReason}
						onValueChange={setRevertReason}
						minRows={4}
						variant='bordered'
						isRequired
					/>

					<div className='flex justify-end gap-2'>
						<Button
							color='default'
							variant='light'
							onPress={() => setIsRevertModalOpen(false)}>
							Cancel
						</Button>
						<Button
							color='danger'
							startContent={<LuRotateCcw size={18} />}
							onPress={handleRevert}
							isLoading={isReverting}
							isDisabled={!revertReason.trim()}>
							Confirm Revert
						</Button>
					</div>
				</div>
			</ModalProvider>

			<PageWrapper name='Revert Transaction'>
				<Subheader>
					<SubheaderLeft>
						<FieldWrap>
							<div className='flex items-center gap-4'>
								<Input
									type='text'
									placeholder='Enter Transaction ID'
									value={transactionId}
									onValueChange={setTransactionId}
									className='min-w-[300px]'
									size='md'
									variant='bordered'
									startContent={<LuSearch className='text-gray-400' />}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											handleSearch();
										}
									}}
								/>
								<Button
									color='primary'
									startContent={<LuSearch size={18} />}
									onPress={handleSearch}
									isDisabled={!transactionId.trim()}>
									Search
								</Button>
								<Button
									color='default'
									variant='flat'
									startContent={<HiViewList size={18} />}
									onPress={handleViewAll}>
									View All
								</Button>
								{searchedTransactionId && (
									<Button
										color='default'
										variant='light'
										isIconOnly
										onPress={handleViewAll}>
										<LuX size={20} />
									</Button>
								)}
							</div>
						</FieldWrap>
					</SubheaderLeft>
					<SubheaderRight>
						{searchedTransactionId && (
							<Button
								color='danger'
								variant='flat'
								startContent={<LuRotateCcw size={18} />}
								onPress={() => setIsRevertModalOpen(true)}>
								Revert Transaction
							</Button>
						)}
					</SubheaderRight>
				</Subheader>

				<Container>
					{searchedTransactionId && (
						<div className='mb-4 rounded-lg bg-blue-50 p-4'>
							<div className='flex items-center gap-2'>
								<MdOutlineInfo className='text-blue-600' size={20} />
								<span className='font-medium text-blue-800'>
									Viewing results for: <strong>{searchedTransactionId}</strong>
								</span>
							</div>
						</div>
					)}

					{/* Transaction Detail Card */}
					{searchedTransactionId && detailData?.body && detailData.body.length > 0 && (
						<Card className='mb-4'>
							<CardHeader>
								<CardHeaderChild>
									<div className='flex items-center gap-2'>
										<LuFileText className='text-blue-600' size={20} />
										<CardTitle>Transaction Details</CardTitle>
									</div>
									<Badge
										variant='outline'
										className='border-transparent px-4'
										rounded='rounded-full'>
										{detailData.body.length} record(s)
									</Badge>
								</CardHeaderChild>
							</CardHeader>
							<CardBody className='overflow-auto'>
								<TableTemplate
									className='table-fixed max-md:min-w-[70rem]'
									table={detailTable}
									hasFooter={false}
								/>
							</CardBody>
						</Card>
					)}

					{/* Revert History Card */}
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<div className='flex items-center gap-2'>
									<LuHistory className='text-purple-600' size={20} />
									<CardTitle>
										{searchedTransactionId
											? 'Revert History'
											: 'All Revert History'}
									</CardTitle>
								</div>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{historyTable.getFilteredRowModel().rows.length} /{' '}
									{historyData?.body?.totalElements || 0} items
								</Badge>
							</CardHeaderChild>
						</CardHeader>
						<CardBody className='overflow-auto'>
							<TableTemplate
								className='table-fixed max-md:min-w-[60rem]'
								table={historyTable}
							/>
						</CardBody>
						<TableCardFooterTemplate
							table={historyTable}
							onPageChange={(newPage) => setPageIndex(newPage)}
							onPageSizeChange={(newSize) => setPageSize(newSize)}>
							<div className='pagination-info'>
								<span>{`Showing ${historyData?.body?.numberOfElements || 0} items out of ${historyData?.body?.totalElements || 0} total items`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default RevertPage;
