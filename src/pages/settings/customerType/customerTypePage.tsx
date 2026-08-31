import { useState, useEffect } from 'react';
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
import {
	useCreateCustomerTypeMutation,
	useGetCustomerTypeQuery,
	useUpdateCustomerTypeMutation,
} from '@/pages/settings/redux/queries/customerTypeApiSlice.ts';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';

import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import toast from 'react-hot-toast';
import { AlertService } from '@/common/services/alert.service.ts';
import CustomerTypeForm from '@/pages/settings/customerType/components/customerForm.tsx';

const alert = new AlertService();

const CustomerTypePage = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const { data, isLoading } = useGetCustomerTypeQuery({
		page: pageIndex,
		size: pageSize,
		search: globalFilter,
	});

	const [createCustomerType] = useCreateCustomerTypeMutation();
	const [updateCustomerType] = useUpdateCustomerTypeMutation();

	const [modalOpen, setModalOpen] = useState(false);
	const [currentCustomerType, setCurrentCustomerType] = useState<any | null>(null);

	const initial = currentCustomerType || {
		nameEn: '',
		nameLa: '',
		status: true,
		feeStatus: false,
		tplStatus: false,
	};

	useEffect(() => {
		if (pageIndex === 0) return;
	}, [pageIndex, pageSize, globalFilter]);

	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('id', { header: 'ID', cell: (info) => info.getValue() }),
		columnHelper.accessor('nameEn', { header: 'Name (EN)', cell: (info) => info.getValue() }),
		columnHelper.accessor('nameLa', { header: 'Name (LA)', cell: (info) => info.getValue() }),

		// Status Column
		columnHelper.accessor('status', {
			header: 'Status',
			cell: (info) =>
				info.getValue() ? (
					<Badge variant='outline' color='emerald' className='border-transparent'>
						Active
					</Badge>
				) : (
					<Badge variant='outline' color='red' className='border-transparent'>
						Inactive
					</Badge>
				),
		}),

		// Fee Status Column
		columnHelper.accessor('feeStatus', {
			header: 'Fee Status',
			cell: (info) =>
				info.getValue() ? (
					<Badge variant='outline' color='emerald' className='border-transparent'>
						Active
					</Badge>
				) : (
					<Badge variant='outline' color='red' className='border-transparent'>
						Inactive
					</Badge>
				),
		}),

		// Template Status Column
		columnHelper.accessor('tplStatus', {
			header: 'Template Status',
			cell: (info) =>
				info.getValue() ? (
					<Badge variant='outline' color='emerald' className='border-transparent'>
						Active
					</Badge>
				) : (
					<Badge variant='outline' color='red' className='border-transparent'>
						Inactive
					</Badge>
				),
		}),

		// Actions Column
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
				</div>
			),
		}),
	];

	const openModalForCreate = () => {
		setCurrentCustomerType(null);
		setModalOpen(true);
	};

	const openModalForEdit = (customerType: any) => {
		setCurrentCustomerType(customerType);
		setModalOpen(true);
	};

	const handleFormSubmit = async (values: any) => {
		if (currentCustomerType) {
			await updateCustomerType({ id: currentCustomerType.id, ...values })
				.unwrap()
				.then(async (res) => {
					if (res?.header.status === '01') {
						toast.success('Updated successfully!');
					} else {
						await alert.error(res?.header.message || 'An error occurred');
					}
				});
		} else {
			await createCustomerType(values)
				.unwrap()
				.then(async (res) => {
					if (res?.header.status === '01') {
						toast.success('Customer type added successfully!');
					} else {
						await alert.error(res?.header.message || 'An error occurred');
					}
				});
		}
		setModalOpen(false);
	};

	const table = useReactTable({
		data: data?.body?.content || [],
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		enableGlobalFilter: true,
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
			<PageWrapper name='Customer Types'>
				<ModalProvider
					isOpen={modalOpen}
					onOpenChange={() => setModalOpen(false)}
					title={currentCustomerType ? 'Edit Customer Type' : 'New Customer Type'}
					size='2xl'>
					<CustomerTypeForm
						initialValues={initial}
						onSubmit={handleFormSubmit}
						onCancel={() => setModalOpen(false)}
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
							New Customer Type
						</Button>
					</SubheaderRight>
				</Subheader>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>ປະເພດລູກຄ້າ</CardTitle>
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
							onPageChange={(newPage) => {
								setPageIndex(newPage);
							}}
							onPageSizeChange={(newSize) => {
								setPageSize(newSize);
							}}>
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

export default CustomerTypePage;
