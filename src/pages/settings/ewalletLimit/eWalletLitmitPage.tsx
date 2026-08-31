import { useState } from 'react';
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

import ModalProvider from '@/components/ui/modal/modalProvider.tsx';

import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';

import toast from 'react-hot-toast';
import { AlertService } from '@/common/services/alert.service.ts';
import {
	useGetWalletLimitQuery,
	useUpdateWalletLimitMutation,
	useDeleteWalletLimitMutation,
	useCreateWalletLimitMutation,
} from '@/pages/settings/redux/queries/eWalletLimitApiSlice.ts';
import { useGetCustomerTypeQuery } from '@/pages/settings/redux/queries/customerTypeApiSlice.ts';
import EWalletLimitForm from '@/pages/settings/ewalletLimit/components/eWalletLimitForm.tsx';

const alert = new AlertService();

const EWalletLimitPage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const { data, isLoading } = useGetWalletLimitQuery({
		page: pageIndex,
		size: pageSize,
		search: globalFilter,
	});

	const [createEWalletLimit] = useCreateWalletLimitMutation();
	const [updateEWalletLimit] = useUpdateWalletLimitMutation();
	const [deleteEWalletLimit] = useDeleteWalletLimitMutation();
	const { data: customerData } = useGetCustomerTypeQuery({ page: 0, size: 100 });

	const [modalOpen, setModalOpen] = useState(false);
	const [currentLimit, setCurrentLimit] = useState<any | null>(null);
	const [isEdit, setIsEditable] = useState(false);

	const handleDelete = async (id: number) => {
		console.log(id);
		const confirmResult = await alert.confirmModal(
			'Are you sure you want to delete this E-Wallet Limit?',
		);

		if (confirmResult.isConfirmed) {
			try {
				await deleteEWalletLimit({ id: id }).unwrap();
				await alert.success('E-Wallet Limit deleted successfully');
			} catch (error) {
				await alert.error('Error occurred while deleting');
			}
		}
	};

	const initial = currentLimit || {
		ccy: '',
		maxAmount: null,
		minAmount: null,
		status: true,

		cusTypeId: '',
	};

	const openModalForCreate = () => {
		setIsEditable(false);
		setCurrentLimit(null);
		setModalOpen(true);
	};

	const openModalForEdit = (limit: any) => {
		setCurrentLimit(limit);
		setIsEditable(true);
		setModalOpen(true);
	};

	const handleFormSubmit = async (values: any) => {
		const payload = {
			ccy: values.ccy,
			maxAmount: values.maxAmount,
			minAmount: values.minAmount,
			status: values.status,
			cusTypeId: values.cusTypeId,
		};

		if (isEdit) {
			await updateEWalletLimit({ walletId: currentLimit.id, ...payload })
				.unwrap()
				.then(() => toast.success('Update Successful'))
				.catch((err) => alert.error(err?.data?.message || 'Error occurred'));
		} else {
			await createEWalletLimit(payload)
				.unwrap()
				.then(() => toast.success('Create Successful'))
				.catch((err) => alert.error(err?.data?.message || 'Error occurred'));
		}

		setModalOpen(false);
	};

	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('id', { header: 'ID', cell: (info) => info.getValue() }),
		columnHelper.accessor('maxAmount', {
			header: 'Max Amount',
			cell: (info) => info.getValue().toLocaleString(),
		}),
		columnHelper.accessor('minAmount', {
			header: 'Min Amount',
			cell: (info) => info.getValue().toLocaleString(),
		}),
		columnHelper.accessor('status', {
			header: 'Status',
			cell: (info) => (info.getValue() ? 'Active' : 'Inactive'),
		}),
		columnHelper.accessor('custType.nameLa', {
			header: 'Name (La)',
			cell: (info) => info.getValue() || 'N/A',
		}),
		columnHelper.accessor('custType.nameEn', {
			header: 'Name (En)',
			cell: (info) => info.getValue() || 'N/A',
		}),
		columnHelper.display({
			header: 'Actions',
			cell: (info) => (
				<div className='flex gap-2'>
					<Button
						onClick={() => openModalForEdit(info.row.original)}
						variant='solid'
						icon='HeroPencilSquare'>
						Edit
					</Button>
					<Button
						onClick={() => handleDelete(info.row.original.id)}
						variant='solid'
						color='red'
						icon='HeroTrash'>
						Delete
					</Button>
				</div>
			),
		}),
	];

	const table = useReactTable({
		data: data?.body?.content || [],
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: data?.body?.totalPages || 1,
		initialState: { pagination: { pageIndex, pageSize } },
	});

	return (
		<>
			{isLoading && <Loading />}
			<PageWrapper name='E-Wallet Limits'>
				<ModalProvider
					isOpen={modalOpen}
					onOpenChange={() => setModalOpen(false)}
					title={isEdit ? 'Edit E-Wallet Limit' : 'New E-Wallet Limit'}
					size='2xl'>
					<EWalletLimitForm
						customerType={customerData?.body?.content}
						initialValues={initial}
						onSubmit={handleFormSubmit}
						onCancel={() => setModalOpen(false)}
						isEditMode={isEdit}
					/>
				</ModalProvider>

				<Subheader>
					<SubheaderLeft>
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
					</SubheaderLeft>
					<SubheaderRight>
						<Button onClick={openModalForCreate} variant='solid' icon='HeroPlus'>
							New E-Wallet Limit
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>ຈັດການວົງເງິນກະເປົ່າ E-Wallet</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4'
									rounded='rounded-full'>
									{data?.body?.totalElements || 0} items
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
								<span>{`Showing ${data?.body?.numberOfElements || 0} items out of ${data?.body?.totalElements || 0} total items`}</span>
							</div>
						</TableCardFooterTemplate>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default EWalletLimitPage;
